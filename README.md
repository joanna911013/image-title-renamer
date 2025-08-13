
# Screenshot → Smart Filename 

Generate meaningful filenames for screenshots/images:
- OCR: **Azure AI Vision Read** (default) with **Google Vision** fallback
- (Optional) LLM (OpenAI) to produce concise English keywords
- Timestamp format in filenames: **YYYY-MM-DD_HH-mm**
- Optional **PII masking** before passing text to LLM and returning previews

## Quick Start
```bash
npm i
cp .env.example .env

# Edit .env:
# OCR_PROVIDER=azure | google
# Azure: AZURE_VISION_ENDPOINT / AZURE_VISION_KEY
# Google: GOOGLE_APPLICATION_CREDENTIALS=/abs/path/to/service-account.json
# OpenAI (optional): OPENAI_API_KEY=sk-...
# PII_MASK=true|false (default false)
# PII_MASK_LEVEL=basic|strict
# TIMEZONE=UTC|local  (default local)

npm run dev
# Open http://localhost:3000
```

## Filename Rules
- Core is English-only (LLM prompt enforces English words/underscores).
- Sanitization removes `:?*/\|"<>.` and collapses multiple underscores.
- Final pattern: `<core>_YYYY-MM-DD_HH-mm.<ext>`
- Timestamp uses **local time** by default; set `TIMEZONE=UTC` to switch.

## API
- `POST /api/rename` with `multipart/form-data` file field `image`
- Response JSON:
```json
{
  "suggestedName": "meeting_notes_2025-08-13_22-35.png",
  "timestamp": "2025-08-13_22-35",
  "timezone": "local",
  "ocrProvider": "azure",
  "ocrPreview": "...",
  "savedAt": "out/meeting_notes_2025-08-13_22-35.png"
}
```

## Notes
- If OpenAI key is missing, a heuristic fallback uses the first text line; non-ASCII fallback becomes `screenshot`.
- For production, consider serverless deployment (AWS Lambda/API Gateway or Cloud Run) and S3 for persistent storage.
