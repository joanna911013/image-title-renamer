
import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";
import vision from "@google-cloud/vision";
import OpenAI from "openai";
import tesseract from "node-tesseract-ocr";

dotenv.config();

const app = express();
const upload = multer({ dest: "tmp/" });

// Config
const OCR_PROVIDER = (process.env.OCR_PROVIDER || "azure").toLowerCase();
const USE_UTC = (process.env.TIMEZONE || "local").toLowerCase() === "utc";

// Lazy Google Vision client
let visionClient = null;
function getVisionClient() {
  if (!visionClient) visionClient = new vision.ImageAnnotatorClient();
  return visionClient;
}

// Optional OpenAI for English keywords
let openai = null;
if (process.env.OPENAI_API_KEY) {
  openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
}

// PII masking utility
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

// Azure Read OCR helper
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

// Google Vision OCR helper
async function googleVisionOCR(filePath) {
  const client = getVisionClient();
  const [result] = await client.textDetection(filePath);
  const detections = result.textAnnotations || [];
  const fullText = detections.length ? detections[0].description : "";
  return (fullText || "").trim();
}

// Local Tesseract OCR helper
async function tesseractOCR(filePath) {
  try {
    const text = await tesseract.recognize(filePath, {
      lang: "eng",
      oem: 1,
      psm: 3,
    });
    return (text || "").trim();
  } catch (e) {
    console.error("Tesseract error:", e.message);
    return "";
  }
}

// Timestamp helper: YYYY-MM-DD_HH-mm (local or UTC)
function buildTimestamp() {
  const d = USE_UTC ? new Date(new Date().toUTCString()) : new Date();
  const pad = (n) => String(n).padStart(2, "0");
  const yyyy = d.getFullYear();
  const mm = pad((USE_UTC ? d.getUTCMonth() : d.getMonth()) + 1);
  const dd = pad(USE_UTC ? d.getUTCDate() : d.getDate());
  const HH = pad(USE_UTC ? d.getUTCHours() : d.getHours());
  const MM = pad(USE_UTC ? d.getUTCMinutes() : d.getMinutes());
  return `${yyyy}-${mm}-${dd}_${HH}-${MM}`;
}

app.post("/api/rename", upload.single("image"), async (req, res) => {
  try {
    const filePath = req.file?.path;
    if (!filePath) return res.status(400).json({ error: "No file uploaded" });

    // 1) OCR with fallback
    let fullText = "";
    if (OCR_PROVIDER === "azure") {
      try {
        fullText = await azureReadOCR(filePath);
      } catch (e) {
        console.warn("Azure OCR failed, falling back to Google:", e.message);
        try {
          fullText = await googleVisionOCR(filePath);
        } catch (e2) {
          console.warn("Google OCR failed, falling back to Tesseract:", e2.message);
          fullText = await tesseractOCR(filePath);
        }
      }
    } else if (OCR_PROVIDER === "google") {
      try {
        fullText = await googleVisionOCR(filePath);
      } catch (e) {
        console.warn("Google OCR failed, try Azure:", e.message);
        try {
          fullText = await azureReadOCR(filePath);
        } catch (e2) {
          console.warn("Azure OCR failed, falling back to Tesseract:", e2.message);
          fullText = await tesseractOCR(filePath);
        }
      }
    } else {
      try {
        fullText = await tesseractOCR(filePath);
      } catch (e) {
        console.warn("Tesseract OCR failed, falling back to Azure:", e.message);
        try {
          fullText = await azureReadOCR(filePath);
        } catch (e2) {
          console.warn("Azure OCR failed, falling back to Google:", e2.message);
          fullText = await googleVisionOCR(filePath);
        }
      }
    }

    // 2) Clean (+ optional PII mask)
    let cleaned = (fullText || "")
      .replace(/\r/g, " ")
      .replace(/\t/g, " ")
      .replace(/[^\S\r\n]+/g, " ")
      .trim();

    if (String(process.env.PII_MASK).toLowerCase() === "true") {
      const level = (process.env.PII_MASK_LEVEL || "basic").toLowerCase();
      cleaned = maskPII(cleaned, level);
    }

    // 3) Filename core via LLM (English) or heuristic
    let filenameCore = "";
    if (openai) {
      const prompt = `You are a naming assistant. From the OCR text below, produce a short English filename core with 3–6 words.
- 30 characters max.
- Only English letters, numbers, and underscores.
- Replace spaces with underscores.
- Remove forbidden characters (:?*/\\|\"<>.).
- No trailing punctuation.
Return only the filename core (no extension).

OCR text:
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
        filenameCore = filenameCore
          .replace(/[:?*\/\\|\"<>.]/g, "")
          .replace(/\s+/g, "_");
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
      // Ensure ASCII-ish fallback
      if (!/^[\x00-\x7F]+$/.test(filenameCore)) {
        filenameCore = "screenshot";
      }
    }

    // 4) Append timestamp (YYYY-MM-DD_HH-mm)
    const stamp = buildTimestamp();
    const ext = path.extname(req.file.originalname || ".png") || ".png";
    let finalName = `${filenameCore}_${stamp}${ext}`;
    finalName = finalName.replace(/_+/g, "_");

    // 5) Move file to out/ with new name
    const outDir = "out";
    fs.mkdirSync(outDir, { recursive: true });
    const outPath = path.join(outDir, finalName);
    fs.renameSync(filePath, outPath);

    return res.json({
      suggestedName: finalName,
      timestamp: stamp,
      timezone: USE_UTC ? "UTC" : "local",
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
