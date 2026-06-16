import { supabase } from '@/integrations/supabase/client';
import { PredictionResult } from './types';

const STORAGE_KEY = 'retina-ai-history';

function getLocal(): PredictionResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

function setLocal(history: PredictionResult[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
}

function rowToResult(r: any): PredictionResult {
  return {
    id: r.id,
    timestamp: r.created_at,
    imageName: r.image_name,
    imageData: r.image_url ?? undefined,
    predictions: r.predictions,
    severity: r.severity,
    overallRisk: r.overall_risk,
  };
}

export async function getHistory(): Promise<PredictionResult[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return getLocal();
  const { data, error } = await supabase
    .from('analyses')
    .select('*')
    .order('created_at', { ascending: false });
  if (error || !data) return getLocal();
  return data.map(rowToResult);
}

export async function saveResult(result: PredictionResult) {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    const history = getLocal();
    history.unshift(result);
    setLocal(history);
    return;
  }
  await supabase.from('analyses').insert({
    user_id: user.id,
    image_name: result.imageName,
    image_url: result.imageData ?? null,
    severity: result.severity,
    overall_risk: result.overallRisk,
    predictions: result.predictions as any,
  });
}

export async function clearHistory() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase.from('analyses').delete().eq('user_id', user.id);
  }
  localStorage.removeItem(STORAGE_KEY);
}
