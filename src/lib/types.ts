export interface PredictionResult {
  id: string;
  timestamp: string;
  imageName: string;
  imageData?: string;
  predictions: DiseasePrediction[];
  severity: 'Normal' | 'Mild' | 'Moderate' | 'Severe' | 'Proliferative';
  overallRisk: number;
}

export interface DiseasePrediction {
  disease: string;
  confidence: number;
  detected: boolean;
}

export interface AnalysisHistory {
  results: PredictionResult[];
}

export const DISEASES = [
  {
    id: 'diabetic-retinopathy',
    name: 'Diabetic Retinopathy',
    shortName: 'DR',
    icon: 'Eye',
    color: 'medical-teal',
    description: 'A diabetes complication that affects the blood vessels of the retinal tissue at the back of the eye.',
    symptoms: ['Blurred vision', 'Floaters', 'Dark areas of vision', 'Vision loss'],
    stages: ['No DR', 'Mild NPDR', 'Moderate NPDR', 'Severe NPDR', 'Proliferative DR'],
    cnnDetection: 'The CNN identifies microaneurysms, hemorrhages, hard exudates, and neovascularization patterns in fundus images through learned convolutional filters.',
  },
  {
    id: 'glaucoma',
    name: 'Glaucoma',
    shortName: 'GL',
    icon: 'Activity',
    color: 'medical-blue',
    description: 'A group of eye conditions that damage the optic nerve, often caused by abnormally high pressure in the eye.',
    symptoms: ['Patchy blind spots', 'Tunnel vision', 'Severe headache', 'Eye pain'],
    stages: ['Suspect', 'Early', 'Moderate', 'Advanced', 'End-stage'],
    cnnDetection: 'The CNN analyzes optic disc morphology, cup-to-disc ratio, neuroretinal rim thinning, and peripapillary atrophy patterns.',
  },
  {
    id: 'amd',
    name: 'Age-related Macular Degeneration',
    shortName: 'AMD',
    icon: 'Scan',
    color: 'medical-cyan',
    description: 'A progressive eye condition affecting the macula, leading to loss of central vision.',
    symptoms: ['Distorted vision', 'Reduced central vision', 'Need for brighter light', 'Difficulty reading'],
    stages: ['Early AMD', 'Intermediate AMD', 'Late Dry AMD', 'Late Wet AMD'],
    cnnDetection: 'The CNN detects drusen deposits, pigment changes, geographic atrophy, and choroidal neovascularization in the macular region.',
  },
  {
    id: 'cataracts',
    name: 'Cataracts',
    shortName: 'CT',
    icon: 'CircleDot',
    color: 'medical-green',
    description: 'A clouding of the normally clear lens of the eye, leading to decreased vision.',
    symptoms: ['Clouded vision', 'Sensitivity to light', 'Fading colors', 'Double vision'],
    stages: ['Incipient', 'Immature', 'Mature', 'Hypermature'],
    cnnDetection: 'The CNN identifies lens opacity patterns, nuclear sclerosis, cortical changes, and posterior subcapsular opacification.',
  },
] as const;
