import { PredictionResult, DiseasePrediction } from './types';

const API_ENDPOINT = import.meta.env.VITE_ML_API_ENDPOINT || '';

export async function analyzeImage(imageFile: File): Promise<PredictionResult> {
  if (API_ENDPOINT) {
    const formData = new FormData();
    formData.append('image', imageFile);

    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  }

  // Simulated prediction when no API endpoint is configured
  await new Promise((resolve) => setTimeout(resolve, 2500));

  const predictions: DiseasePrediction[] = [
    { disease: 'Diabetic Retinopathy', confidence: Math.random() * 0.6 + 0.2, detected: Math.random() > 0.4 },
    { disease: 'Glaucoma', confidence: Math.random() * 0.5 + 0.1, detected: Math.random() > 0.5 },
    { disease: 'Age-related Macular Degeneration', confidence: Math.random() * 0.4 + 0.1, detected: Math.random() > 0.6 },
    { disease: 'Cataracts', confidence: Math.random() * 0.5 + 0.15, detected: Math.random() > 0.5 },
  ];

  const detectedCount = predictions.filter((p) => p.detected).length;
  const maxConf = Math.max(...predictions.map((p) => p.confidence));
  const severityLevels: PredictionResult['severity'][] = ['Normal', 'Mild', 'Moderate', 'Severe', 'Proliferative'];
  const severityIndex = Math.min(Math.floor(maxConf * 5), 4);

  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    imageName: imageFile.name,
    predictions,
    severity: detectedCount === 0 ? 'Normal' : severityLevels[severityIndex],
    overallRisk: Math.round(maxConf * 100),
  };
}
