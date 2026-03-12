import { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { ResultsDisplay } from '@/components/ResultsDisplay';
import { analyzeImage } from '@/lib/api';
import { saveResult } from '@/lib/storage';
import { PredictionResult } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, ScanEye, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

export default function Analyze() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<PredictionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError(null);
    try {
      const res = await analyzeImage(file);
      if (preview) res.imageData = preview;
      saveResult(res);
      setResult(res);
      toast({ title: 'Analysis Complete', description: `Severity: ${res.severity} | Risk: ${res.overallRisk}%` });
    } catch (e: any) {
      setError(e.message || 'Analysis failed');
      toast({ title: 'Error', description: 'Analysis failed. Please try again.', variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-8">
          <h1 className="font-display text-3xl font-bold mb-2">Retina Image Analysis</h1>
          <p className="text-muted-foreground">Upload a fundus image to detect retinal diseases using our CNN model.</p>
        </div>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <ScanEye className="w-5 h-5 text-primary" /> Upload Fundus Image
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <ImageUpload
              onImageSelect={(f, p) => { setFile(f); setPreview(p); setResult(null); setError(null); }}
              preview={preview}
              onClear={() => { setFile(null); setPreview(null); setResult(null); }}
            />
            {file && !result && (
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                className="w-full gradient-medical text-primary-foreground shadow-medical"
                size="lg"
              >
                {loading ? (
                  <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Analyzing...</>
                ) : (
                  <><ScanEye className="w-4 h-4 mr-2" /> Analyze Image</>
                )}
              </Button>
            )}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 text-destructive text-sm">
                <AlertCircle className="w-4 h-4" /> {error}
              </div>
            )}
          </CardContent>
        </Card>

        {loading && (
          <Card className="glass-card">
            <CardContent className="py-12 text-center">
              <Loader2 className="w-10 h-10 animate-spin text-primary mx-auto mb-4" />
              <p className="font-display font-semibold">Processing Image...</p>
              <p className="text-sm text-muted-foreground mt-1">Running CNN inference on your fundus image</p>
            </CardContent>
          </Card>
        )}

        {result && <ResultsDisplay result={result} />}

        {!import.meta.env.VITE_ML_API_ENDPOINT && (
          <p className="text-xs text-center text-muted-foreground mt-6">
            ⚠️ No ML API endpoint configured. Running simulated predictions. Set <code className="bg-muted px-1 rounded">VITE_ML_API_ENDPOINT</code> to connect your model.
          </p>
        )}
      </motion.div>
    </div>
  );
}
