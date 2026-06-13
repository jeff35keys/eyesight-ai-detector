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
  {
    id: 'hypertensive-retinopathy',
    name: 'Hypertensive Retinopathy',
    shortName: 'HR',
    icon: 'HeartPulse',
    color: 'medical-blue',
    description: 'Damage to the retina caused by chronic high blood pressure affecting retinal blood vessels.',
    symptoms: ['Reduced vision', 'Eye swelling', 'Burst blood vessel', 'Double vision with headaches'],
    stages: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4 (Malignant)'],
    cnnDetection: 'The CNN detects arteriolar narrowing, arteriovenous nicking, cotton-wool spots, flame hemorrhages, and papilledema.',
  },
  {
    id: 'retinal-vein-occlusion',
    name: 'Retinal Vein Occlusion',
    shortName: 'RVO',
    icon: 'GitBranch',
    color: 'medical-teal',
    description: 'A blockage of the small veins that carry blood away from the retina, causing sudden vision loss.',
    symptoms: ['Sudden blurry vision', 'Vision loss in one eye', 'Floaters', 'Eye pain (rare)'],
    stages: ['Non-ischemic', 'Ischemic', 'Branch RVO', 'Central RVO'],
    cnnDetection: 'The CNN identifies dilated tortuous veins, intraretinal hemorrhages in a sectoral pattern, cotton-wool spots, and macular edema.',
  },
  {
    id: 'macular-edema',
    name: 'Macular Edema',
    shortName: 'ME',
    icon: 'Droplets',
    color: 'medical-cyan',
    description: 'Swelling and thickening of the macula due to fluid accumulation, often a complication of other retinal diseases.',
    symptoms: ['Wavy central vision', 'Colors appear washed out', 'Reading difficulty', 'Central blur'],
    stages: ['Focal', 'Diffuse', 'Cystoid', 'Ischemic'],
    cnnDetection: 'The CNN recognizes retinal thickening, cystoid spaces, hard exudate rings, and foveal contour changes characteristic of macular edema.',
  },
  {
    id: 'retinitis-pigmentosa',
    name: 'Retinitis Pigmentosa',
    shortName: 'RP',
    icon: 'Sparkles',
    color: 'medical-green',
    description: 'A group of inherited disorders causing progressive degeneration of the retinal photoreceptor cells.',
    symptoms: ['Night blindness', 'Loss of peripheral vision', 'Tunnel vision', 'Difficulty in low light'],
    stages: ['Early', 'Mid-stage', 'Advanced', 'End-stage'],
    cnnDetection: 'The CNN detects bone-spicule pigmentation in the mid-periphery, attenuated retinal vessels, and waxy pallor of the optic disc.',
  },
  {
    id: 'pathological-myopia',
    name: 'Pathological Myopia',
    shortName: 'PM',
    icon: 'Focus',
    color: 'medical-blue',
    description: 'Severe nearsightedness with degenerative changes in the retina and choroid, leading to progressive vision loss.',
    symptoms: ['Severe nearsightedness', 'Distorted vision', 'Floaters', 'Risk of retinal detachment'],
    stages: ['Tessellated fundus', 'Diffuse atrophy', 'Patchy atrophy', 'Macular atrophy'],
    cnnDetection: 'The CNN identifies posterior staphyloma, lacquer cracks, choroidal neovascularization, and chorioretinal atrophy patterns.',
  },
] as const;
