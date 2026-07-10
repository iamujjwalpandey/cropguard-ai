import {
  AlertTriangle,
  BookOpen,
  Camera,
  Download,
  Eye,
  FileJson,
  Languages,
  Leaf,
  Lock,
  Microscope,
  Radar,
  ScanLine,
  ShieldCheck,
  Sparkles,
  Sprout,
  UploadCloud,
  WandSparkles
} from 'lucide-react';

export const PRODUCT_NAME = 'CropGuard AI';
export const MOTTO = 'Scan. Detect. Protect.';
export const ADVISORY_DISCLAIMER =
  'This AI analysis is for advisory and educational support only. Please consult a certified agriculture expert before applying chemical treatments.';

export const GEMINI_SYSTEM_PROMPT =
  'You are CropGuard AI, an expert agricultural AI assistant specializing in crop health analysis, plant disease symptoms, crop protection, and farmer-friendly advisory. Analyze the provided crop image carefully. Identify visible symptoms, possible disease categories, severity, risk level, possible causes, prevention steps, and treatment guidance. Do not claim final diagnosis. Provide advisory and educational support only. If the image is unclear, say expert verification is required. Avoid dangerous pesticide dosage instructions. Always include a chemical treatment safety warning. Return only structured JSON using the required schema.';

export const GROQ_SYSTEM_PROMPT =
  'You are CropGuard AI’s farmer communication assistant. Convert technical crop health analysis into simple, clear, farmer-friendly language. Keep it practical, short, calm, and easy to understand. Support English and Hindi. Do not claim final diagnosis. Always recommend expert consultation for severe or unclear cases.';

export const LOADING_MESSAGES = [
  'Scanning leaf texture…',
  'Detecting visible symptoms…',
  'Analyzing crop health…',
  'Estimating severity level…',
  'Generating treatment plan…',
  'Preparing farmer-friendly guidance…'
];

export const FEATURE_CARDS = [
  {
    title: 'Real-Time Crop Scan',
    description: 'Use the browser camera to capture affected leaves and plants with a futuristic scanner interface.',
    icon: Camera
  },
  {
    title: 'Gemini Vision Analysis',
    description: 'Send crop imagery to Gemini Vision for structured multimodal crop health reasoning.',
    icon: Sparkles
  },
  {
    title: 'Disease Risk Detection',
    description: 'Identify possible disease categories, symptom patterns, and contextual risk indicators.',
    icon: Radar
  },
  {
    title: 'Severity Estimation',
    description: 'Classify severity qualitatively as Healthy, Mild, Moderate, Severe, Critical, or Unknown.',
    icon: AlertTriangle
  },
  {
    title: 'Cure & Prevention Plan',
    description: 'Generate actionable next steps, organic options, monitoring plans, and safe treatment warnings.',
    icon: ShieldCheck
  },
  {
    title: 'Farmer-Friendly Explanation',
    description: 'Translate complex analysis into calm, practical language farmers can understand quickly.',
    icon: Sprout
  },
  {
    title: 'Expert Mode Reasoning',
    description: 'Show deeper agronomy-style reasoning for students, researchers, and crop advisors.',
    icon: Microscope
  },
  {
    title: 'Hindi & English Support',
    description: 'Request advisories in English, Hindi, or bilingual style for Indian farming contexts.',
    icon: Languages
  },
  {
    title: 'No Database Privacy',
    description: 'Process images temporarily with no permanent database storage for reports or crop photos.',
    icon: Lock
  },
  {
    title: 'Exportable Crop Report',
    description: 'Copy, download Markdown, or print/save the crop health report as a PDF.',
    icon: Download
  }
];

export const HOW_IT_WORKS = [
  {
    title: 'Capture or upload',
    description: 'Scan with your camera or upload a close, well-lit image of the affected leaf or plant.',
    icon: UploadCloud
  },
  {
    title: 'AI vision analysis',
    description: 'Gemini Vision inspects visible symptoms and returns a structured crop health report.',
    icon: Eye
  },
  {
    title: 'Farmer advisory',
    description: 'CropGuard AI explains possible causes, severity, prevention, monitoring, and next steps.',
    icon: BookOpen
  },
  {
    title: 'Export safely',
    description: 'Copy or download a privacy-first advisory report without storing it in a database.',
    icon: FileJson
  }
];

export const TECH_STACK = [
  'Next.js',
  'React',
  'TypeScript',
  'Tailwind CSS',
  'ShadCN UI',
  'Framer Motion',
  'Lucide Icons',
  'React Three Fiber',
  'Three.js',
  'Gemini Vision',
  'Groq API',
  'MediaDevices API',
  'Vercel'
];

export const GUIDE_SECTIONS = [
  {
    title: 'How to capture good crop images',
    points: [
      'Photograph the affected leaf or plant in bright, natural light when possible.',
      'Hold the camera steady and fill most of the frame with the symptom area.',
      'Capture both sides of a leaf if symptoms appear on the underside.',
      'Avoid heavy shadows, motion blur, water droplets, and extreme zoom blur.',
      'Take multiple images: close-up symptoms, whole plant, and field context.'
    ]
  },
  {
    title: 'Common crop disease symptoms',
    points: [
      'Brown, black, yellow, or gray spots on leaves.',
      'Powdery or fuzzy growth on the surface of leaves or stems.',
      'Leaf curling, wilting, mosaic patterns, chlorosis, or necrotic margins.',
      'Stunted growth, fruit lesions, stem rot, cankers, or root discoloration.',
      'Symptom patterns that spread from older leaves to younger growth.'
    ]
  },
  {
    title: 'Fungal vs bacterial vs viral vs nutrient issues',
    points: [
      'Fungal issues often show spots, mold, rings, blights, or powdery growth, especially in humid conditions.',
      'Bacterial issues may show water-soaked lesions, ooze, angular leaf spots, or rapid tissue collapse.',
      'Viral issues often show mosaic patterns, leaf distortion, yellow streaks, or abnormal growth.',
      'Nutrient issues commonly create generalized yellowing, interveinal chlorosis, or edge burn patterns.',
      'Many symptoms overlap, so field history and expert inspection remain important.'
    ]
  },
  {
    title: 'Basic prevention tips',
    points: [
      'Use disease-free seeds or seedlings and choose resistant varieties when available.',
      'Improve field sanitation by removing infected plant debris responsibly.',
      'Avoid overhead irrigation when leaf wetness encourages disease spread.',
      'Rotate crops and avoid planting the same crop family repeatedly in infected soil.',
      'Maintain spacing and airflow to reduce humidity around the canopy.'
    ]
  },
  {
    title: 'Safe pesticide usage warning',
    points: [
      'Do not apply chemical treatments based only on AI output.',
      'Consult a certified agriculture expert, extension officer, or label instructions before use.',
      'Use personal protective equipment and follow local regulations.',
      'Avoid mixing chemicals unless a qualified expert confirms compatibility.',
      'CropGuard AI does not provide exact chemical dosage instructions.'
    ]
  },
  {
    title: 'When to consult an agriculture expert',
    points: [
      'Symptoms are severe, spreading quickly, or affecting a large part of the field.',
      'The crop is high-value or close to harvest.',
      'The image is unclear or symptoms do not match common patterns.',
      'Chemical treatment is being considered.',
      'Multiple pests, nutrient stress, weather damage, or disease symptoms appear together.'
    ]
  },
  {
    title: 'How AI crop analysis works',
    points: [
      'The app temporarily sends the selected image to Gemini Vision for visual reasoning.',
      'The model evaluates visible symptoms and generates a structured advisory JSON report.',
      'Groq can optionally rewrite technical content into short farmer-friendly language.',
      'Reports are stored only in temporary browser session state unless you export them.',
      'No permanent database stores crop images or analysis reports.'
    ]
  },
  {
    title: 'Limitations of AI image analysis',
    points: [
      'AI cannot confirm a final diagnosis from an image alone.',
      'Similar symptoms may be caused by disease, pests, weather, nutrient issues, or chemical injury.',
      'Image quality, lighting, crop variety, and missing field context can reduce reliability.',
      'Lab testing or expert field inspection may be required for severe or unclear cases.',
      'Always treat CropGuard AI as advisory and educational support.'
    ]
  }
];

export const MODEL_PRIORITIES = {
  geminiFree: [
    'models/gemini-1.5-flash',
    'models/gemini-1.5-flash-latest',
    'models/gemini-2.0-flash-lite',
    'models/gemini-2.0-flash',
    'models/gemini-2.5-flash'
  ],
  geminiGeneral: [
    'models/gemini-2.0-flash',
    'models/gemini-2.5-flash',
    'models/gemini-1.5-flash',
    'models/gemini-1.5-pro'
  ],
  groqFree: [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'llama3-8b-8192',
    'gemma2-9b-it'
  ],
  groqGeneral: [
    'llama-3.1-8b-instant',
    'llama-3.3-70b-versatile',
    'mixtral-8x7b-32768',
    'llama3-70b-8192'
  ]
};

export const ANALYSIS_SCHEMA_FIELDS = [
  'cropHealthStatus',
  'possibleDisease',
  'diseaseCategory',
  'visibleSymptoms',
  'severityLevel',
  'riskLevel',
  'confidenceLabel',
  'possibleCauses',
  'spreadRisk',
  'estimatedUrgency',
  'farmerFriendlyExplanation',
  'expertExplanation',
  'organicTreatment',
  'chemicalTreatmentWarning',
  'preventionPlan',
  'monitoringPlan',
  'nextSteps',
  'whenToConsultExpert',
  'limitations',
  'disclaimer'
] as const;
