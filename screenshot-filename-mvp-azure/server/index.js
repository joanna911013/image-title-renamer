
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import vision from "@google-cloud/vision";
import OpenAI from "openai";

dotenv.config();

const app = express();
const upload = multer({ dest: "tmp/" });

// ---- Provider selection ----
const OCR_PROVIDER = (process.env.OCR_PROVIDER || "azure").toLowerCase();

// Google Vision client (lazy init)
let visionClient = null;
function getVisionClient() {
  if (!visionClient) visionClient = new vision.ImageAnnotatorClient();
  return visionClient;
}

// OpenAI (optional)
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// --- PII masking utility ---
function maskPII(text, level = "basic") {
  if (!text) return text;
  let out = String(text);

  const emailRe = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/gi;
  out = out.replace(emailRe, "[email]");

  const phoneRe = /\b(\+?\d{1,3}[-.\s]?)?(\(?0\d{1,2}\)?[-.\s]?)?\d{3,4}[-.\s]?\d{4}\b/g;
  out = out.replace(phoneRe, "[phone]");

  if (level === "strict") {
    const cardishRe = /\b(?:\d[ -]*?){13,19}\b/g;
    out = out.replace(cardishRe, "[number]");
  }
  return out;
}

app.use(express.static("public"));

// ---- Azure OCR helper ----
async function azureReadOCR(filePath) {
  const endpoint = process.env.AZURE_VISION_ENDPOINT;
  const key = process.env.AZURE_VISION_KEY;
  if (!endpoint || !key) throw new Error("Azure Vision credentials missing");

  const analyzeUrl = `${endpoint}/vision/v3.2/read/analyze`;
  const imageBuffer = fs.readFileSync(filePath);
  const resp = await fetch(analyzeUrl, {
    method: "POST",
    headers: {
      "Ocp-Apim-Subscription-Key": key,
      "Content-Type": "application/octet-stream",
    },
    body: imageBuffer,
  });
  if (!resp.ok) {
    const txt = await resp.text();
    throw new Error(`Azure analyze error: ${resp.status} ${txt}`);
  }
  const operationLocation = resp.headers.get("operation-location");
  if (!operationLocation) throw new Error("Azure: missing operation-location");

  let result = null;
  for (let i = 0; i < 15; i++) {
    await new Promise(r => setTimeout(r, 800));
    const r2 = await fetch(operationLocation, {
      headers: { "Ocp-Apim-Subscription-Key": key }
    });
    result = await r2.json();
    const status = (result.status || result.analyzeResult?.status || "").toLowerCase();
    if (status === "succeeded" || status === "failed" || result.analyzeResult) break;
  }

  const lines = [];
  const analyze = result.analyzeResult || result;
  const readResults = analyze?.readResults || analyze?.analyzeResult?.readResults;
  if (readResults && Array.isArray(readResults)) {
    for (const page of readResults) {
      for (const line of (page.lines || [])) {
        if (line.text) lines.push(line.text);
      }
    }
  } else if (analyze?.pages) {
    for (const page of analyze.pages) {
      for (const line of (page.lines || [])) {
        if (line.content) lines.push(line.content);
      }
    }
  }
  return lines.join("\n").trim();
}

// ---- Google Vision helper ----
async function googleVisionOCR(filePath) {
  const client = getVisionClient();
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations || [];
  const fullText = detections.length ? detections[0].description : "";
  return (fullText || "").trim();
}

// ---- Main route ----
app.post("/api/rename", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: "No file uploaded" });

    // 1) OCR via provider (with fallback)
    let fullText = "";
    if (OCR_PROVIDER === "azure") {
      try {
        fullText = await azureReadOCR(filePath);
      } catch (e) {
        console.warn("Azure OCR failed, falling back to Google:", e.message);
        fullText = await googleVisionOCR(filePath);
      }
    } else {
      try {
        fullText = await googleVisionOCR(filePath);
      } catch (e) {
        console.warn("Google OCR failed, try Azure as fallback:", e.message);
        fullText = await azureReadOCR(filePath);
      }
    }

    // 2) Clean text
    let cleaned = (fullText || "")
      .replace(/\r/g, " ")
      .replace(/\t/g, " ")
      .replace(/[^\S\r\n]+/g, " ")
      .trim();

    // 2-1) Optional PII masking
    if (String(process.env.PII_MASK).toLowerCase() === "true") {
      const level = (process.env.PII_MASK_LEVEL || "basic").toLowerCase();
      cleaned = maskPII(cleaned, level);
    }

    // 3) Generate name (LLM preferred)
    let filenameCore = "";
    if (openai) {
      const prompt = `다음 OCR 텍스트를 바탕으로 3~6단어의 한글 키워드로 파일명 코어를 만들어줘.
- 30자 이내.
- 공백은 _로 변경.
- 금칙문자(:?*/\\|\"<>.) 제거.
- 예: 키워드_키워드_키워드

OCR 텍스트:
---
${cleaned}
---`;

      try {
        const resp = await openai.chat.completions.create({
          model: "gpt-4o-mini",
          messages: [{ role: "user", content: prompt }],
          temperature: 0.2,
        });
        filenameCore = (resp.choices?.[0]?.message?.content || "").split("\n")[0].trim();
      } catch (e) {
        console.error("OpenAI error:", e.message);
      }
    }

    if (!filenameCore) {
      const firstLine = cleaned.split("\n").find(Boolean) || "screenshot";
      filenameCore = firstLine
        .slice(0, 30)
        .replace(/[:?*\/\\|\"<>.]/g, "")
        .replace(/\s+/g, "_")
        .trim() || "screenshot";
    }

    const now = new Date();
    const pad = (n) => String(n).padStart(2, "0");
    const stamp = `${now.getFullYear()}${pad(now.getMonth()+1)}${pad(now.getDate())}_${pad(now.getHours())}${pad(now.getMinutes())}`;

    let finalName = `${filenameCore}_${stamp}${path.extname(req.file.originalname || ".png")}`;
    finalName = finalName.replace(/_+/g, "_");

    const outDir = "out";
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, finalName);
    fs.renameSync(filePath, outPath);

    return res.json({
      suggestedName: finalName,
      ocrProvider: OCR_PROVIDER,
      ocrPreview: cleaned.slice(0, 800),
      savedAt: outPath,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to process image" });
  }
});

app.get("/healthz", (_req, res) => res.json({ ok: true }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`MVP server running on http://localhost:${PORT}`);
});
