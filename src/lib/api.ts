import { PredictionResult, DiseasePrediction } from './types';
import { supabase } from '@/integrations/supabase/client';

async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export async function analyzeImage(imageFile: File): Promise<PredictionResult> {
  const imageBase64 = await fileToBase64(imageFile);

  const { data, error } = await supabase.functions.invoke('analyze-retina', {
    body: {
      imageBase64,
      imageName: imageFile.name,
      mimeType: imageFile.type,
    },
  });

  if (error) {
    throw new Error(error.message || 'AI analysis failed');
  }
  if (data?.error) {
    throw new Error(data.error);
  }

  // Ensure shape conforms to PredictionResult
  const predictions: DiseasePrediction[] = (data.predictions || []).map((p: any) => ({
    disease: p.disease,
    confidence: Number(p.confidence) || 0,
    detected: !!p.detected,
  }));

  return {
    id: data.id,
    timestamp: data.timestamp,
    imageName: data.imageName,
    predictions,
    severity: data.severity,
    overallRisk: data.overallRisk,
  };
}
