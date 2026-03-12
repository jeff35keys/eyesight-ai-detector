import { PredictionResult } from './types';

const STORAGE_KEY = 'retina-ai-history';

export function getHistory(): PredictionResult[] {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveResult(result: PredictionResult) {
  const history = getHistory();
  history.unshift(result);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.slice(0, 100)));
}

export function clearHistory() {
  localStorage.removeItem(STORAGE_KEY);
}
