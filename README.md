# CropGuard AI

**Motto:** **Scan. Detect. Protect.**

CropGuard AI is a premium, privacy-first AI crop health scanner and advisory platform built with Next.js, TypeScript, Gemini Vision, optional Groq fast text generation, browser camera APIs, Tailwind CSS, ShadCN-style UI components, Framer Motion, Lucide Icons, and React Three Fiber.

It helps farmers, agriculture students, crop advisors, researchers, and agritech teams scan or upload crop images and receive a structured AI advisory report containing possible disease insights, visible symptoms, severity, risk level, causes, prevention guidance, organic treatment options, chemical safety warnings, farmer-friendly explanations, expert reasoning, and exportable reports.

> **Safety disclaimer:** This AI analysis is for advisory and educational support only. Please consult a certified agriculture expert before applying chemical treatments.

---

## Why this project is recruiter-grade

CropGuard AI is designed as a serious AI agritech SaaS portfolio project rather than a basic demo. It demonstrates:

- Real browser camera access with capture, retake, camera switching, and permission handling.
- Multimodal Gemini Vision crop image reasoning.
- Optional Groq-powered farmer-friendly rewriting and Hindi simplification.
- Structured JSON schema prompting, response parsing, validation, and fallback behavior.
- No-database, privacy-first architecture.
- Exportable Markdown, clipboard, and print/save-PDF reports.
- Premium responsive dark green SaaS UI with glassmorphism, animations, and 3D visuals.
- Responsible AI design with no final diagnosis claims and chemical treatment warnings.

---

## Features

### Core product features

- Real-time camera crop scanning
- Manual image upload mode
- Google Gemini Vision-powered crop image analysis
- Optional Groq-powered fast farmer-friendly summaries
- AI confidence label using qualitative labels only
- Disease severity estimator
- Cure and prevention plan
- Farmer-friendly mode
- Expert mode
- English, Hindi, and bilingual advisory support
- Privacy-first no-database architecture
- Exportable crop health reports
- Premium 3D website experience
- Vercel-ready API routes and deployment config

### Report includes

- Crop Health Summary
- Possible Disease
- Disease Category
- Visible Symptoms Detected
- Severity Level
- Risk Level
- AI Confidence Label
- Possible Causes
- Spread Risk
- Estimated Urgency
- Cure Suggestions
- Organic Treatment Suggestions
- Chemical Treatment Safety Warning
- Prevention Plan
- Monitoring Plan
- Farmer-Friendly Explanation
- Expert Explanation
- Next Steps
- When to Consult an Expert
- Limitations
- Disclaimer
- Copy Report button
- Download Markdown Report button
- Print / Save PDF button
- Analyze Another Image button

---

## Tech Stack

- **Next.js** App Router
- **React**
- **TypeScript**
- **Tailwind CSS**
- **ShadCN-style UI components**
- **Framer Motion**
- **Lucide Icons**
- **Three.js / React Three Fiber**
- **Google Gemini API**
- **Groq API**
- **Browser MediaDevices Camera API**
- **Vercel deployment**
- **No database**

---

## Architecture

```txt
CropGuard AI
├── app/
│   ├── page.tsx                    # Home page
│   ├── scan/page.tsx               # Real-time camera scanner
│   ├── upload/page.tsx             # Drag-and-drop upload flow
│   ├── result/page.tsx             # Analysis result report
│   ├── guide/page.tsx              # Farmer guide
│   ├── settings/page.tsx           # AI provider settings
│   ├── about/page.tsx              # Project explanation
│   └── api/
│       ├── analyze-crop/route.ts   # Gemini Vision analysis
│       ├── summarize-advisory/route.ts # Groq/Gemini summary
│       ├── test-gemini/route.ts    # Gemini key/model test
│       └── test-groq/route.ts      # Groq key/model test
├── components/
│   ├── CameraScanner.tsx
│   ├── ImageUploader.tsx
│   ├── AnalysisReport.tsx
│   ├── SettingsPanel.tsx
│   ├── Hero3D.tsx
│   └── ui/                         # ShadCN-style primitives
├── lib/
│   ├── server/ai.ts                # Provider API helpers
│   ├── client-analysis.ts          # Client analysis workflow
│   ├── types.ts
│   ├── report.ts
│   └── constants.ts
└── public/
```

---

## AI Workflow

### 1. Image capture or upload

The user either:

- Opens the camera scanner and captures a crop image, or
- Uploads a JPG, PNG, or WEBP image through the upload page.

### 2. Temporary processing

The image is sent to the `/api/analyze-crop` route as multipart form data. CropGuard AI validates:

- Missing image
- Unsupported image format
- Image size over 8 MB
- Missing Gemini API key
- Invalid provider response
- Parsing errors
- Timeout and rate limit failures

### 3. Gemini Vision analysis

Gemini receives:

- The crop image as base64 inline data
- The CropGuard AI system prompt
- A strict structured JSON schema request

Gemini returns the required JSON structure:

```json
{
  "cropHealthStatus": "",
  "possibleDisease": "",
  "diseaseCategory": "",
  "visibleSymptoms": [],
  "severityLevel": "",
  "riskLevel": "",
  "confidenceLabel": "",
  "possibleCauses": [],
  "spreadRisk": "",
  "estimatedUrgency": "",
  "farmerFriendlyExplanation": "",
  "expertExplanation": "",
  "organicTreatment": [],
  "chemicalTreatmentWarning": "",
  "preventionPlan": [],
  "monitoringPlan": [],
  "nextSteps": [],
  "whenToConsultExpert": "",
  "limitations": "",
  "disclaimer": ""
}
```

### 4. Optional Groq summary

If Groq is configured, `/api/summarize-advisory` uses Groq to rewrite the technical advisory into simple farmer-friendly language. If Groq fails and Gemini is configured, the route falls back to Gemini.

### 5. Report generation

The result is stored in temporary browser session state and rendered on the Analysis Result Page. Users can copy or export the report.

---

## No-database privacy-first design

CropGuard AI intentionally does **not** use:

- Supabase
- Firebase
- MongoDB
- PostgreSQL
- MySQL
- Any permanent application database

Instead it uses:

- React state
- Browser `sessionStorage` for the current temporary report
- Browser `localStorage` only for demo API provider settings
- Downloadable Markdown reports
- Clipboard export
- Browser print/save-PDF flow

Crop images and crop analysis reports are not stored permanently by the application.

---

## Environment Variables

Create a `.env.local` file:

```bash
GEMINI_API_KEY=
GROQ_API_KEY=
```

- `GEMINI_API_KEY` is required for crop image analysis.
- `GROQ_API_KEY` is optional and used for fast farmer-friendly summaries.

For demo mode, users can enter keys in the Settings page. Demo keys are stored locally in the browser only.

> API keys are sensitive. In demo mode, keys are stored locally in your browser. For production, use secure server-side environment variables.

---

## Setup Instructions

### 1. Clone the repository

```bash
git clone https://github.com/your-username/cropguard-ai.git
cd cropguard-ai
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

```bash
cp .env.example .env.local
```

Add your Gemini and optional Groq keys.

### 4. Run locally

```bash
npm run dev
```

Open:

```txt
http://localhost:3000
```

### 5. Type check

```bash
npm run typecheck
```

### 6. Production build

```bash
npm run build
npm run start
```

---

## Deploy on Vercel

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add environment variables in Vercel Project Settings:

```bash
GEMINI_API_KEY=
GROQ_API_KEY=
```

4. Deploy.

The project includes `vercel.json` and uses Next.js API routes for provider calls.

---

## Screenshots

Add screenshots after deployment:

- Home Page
- Live Crop Scan Page
- Upload Image Page
- Analysis Result Page
- Settings Page
- Farmer Guide Page

Suggested filename layout:

```txt
public/screenshots/home.png
public/screenshots/scan.png
public/screenshots/result.png
public/screenshots/settings.png
```

---

## Safety and Responsible AI

CropGuard AI does **not** claim final diagnosis. It provides advisory and educational support only.

The app is designed to:

- Avoid fake numeric accuracy claims
- Use qualitative AI confidence labels
- Show limitations clearly
- Warn before chemical treatment decisions
- Avoid exact pesticide dosage instructions
- Recommend expert consultation for severe or unclear cases

Required disclaimer shown in the UI:

> This AI analysis is for advisory and educational support only. Please consult a certified agriculture expert before applying chemical treatments.

---

## Future Improvements

- Weather API integration
- Offline PWA mode
- More Indian regional languages
- Voice-based farmer assistant
- Expert verification workflow
- Disease dataset fine-tuning
- Leaf segmentation
- Severity heatmap
- Farm history dashboard
- IoT sensor integration
- WhatsApp advisory sharing
- Government agriculture scheme integration

---

## Resume Bullet Points

- Built CropGuard AI, a real-time AI crop health scanner using Next.js, TypeScript, Gemini Vision, and Groq for crop image analysis and farmer-friendly advisory generation.
- Implemented browser-based camera scanning with image capture, upload flow, structured AI response parsing, severity estimation, and risk labeling.
- Designed a privacy-first no-database architecture that processes crop images temporarily without persistent storage.
- Built a premium responsive 3D SaaS-style interface using Tailwind CSS, ShadCN UI, Framer Motion, and React Three Fiber.
- Developed exportable crop health reports with prevention plans, treatment guidance, expert reasoning, and responsible AI disclaimers.

---

## License

This project is provided as a portfolio and educational AI agritech project. Add your preferred license before publishing.
