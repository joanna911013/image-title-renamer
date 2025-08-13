
# Screenshot → Smart Filename (MVP, Azure OCR + PII Masking)

Azure AI Vision Read(기본) + Google Vision(폴백)로 텍스트를 추출하고,
(선택) OpenAI로 키워드를 생성해 의미 있는 파일명으로 저장합니다.
PII 마스킹 옵션으로 이메일/전화 등을 치환합니다.

## 시작
```bash
npm i
cp .env.example .env
# OCR_PROVIDER=azure | google
# AZURE_VISION_ENDPOINT / AZURE_VISION_KEY 설정
# (옵션) GOOGLE_APPLICATION_CREDENTIALS, OPENAI_API_KEY, PII_MASK=true
npm run dev
open http://localhost:3000
```
