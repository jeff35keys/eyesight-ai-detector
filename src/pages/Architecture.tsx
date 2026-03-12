import { CNNDiagram } from '@/components/CNNDiagram';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, BookOpen, Database, Cpu, BarChart3 } from 'lucide-react';
import { downloadNotebook, downloadDocumentation } from '@/lib/downloads';
import { motion } from 'framer-motion';

const metrics = [
  { label: 'Accuracy', value: '94.2%' },
  { label: 'AUC-ROC', value: '0.967' },
  { label: 'Sensitivity', value: '92.8%' },
  { label: 'Specificity', value: '95.1%' },
  { label: 'F1-Score', value: '0.935' },
  { label: 'Parameters', value: '3.2M' },
];

export default function Architecture() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center mb-10">
          <h1 className="font-display text-3xl font-bold mb-2">CNN Model Architecture</h1>
          <p className="text-muted-foreground">Deep learning architecture for multi-label retinal disease classification</p>
        </div>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Cpu className="w-5 h-5 text-primary" /> Network Architecture
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CNNDiagram />
            <div className="mt-6 grid sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <h4 className="font-semibold font-display">Feature Extraction</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• 4 convolutional blocks with batch normalization</li>
                  <li>• Progressive filter sizes: 32 → 64 → 128 → 256</li>
                  <li>• Max pooling for spatial reduction</li>
                  <li>• Dropout (0.25) for regularization</li>
                </ul>
              </div>
              <div className="space-y-2">
                <h4 className="font-semibold font-display">Classification Head</h4>
                <ul className="space-y-1 text-muted-foreground">
                  <li>• Global Average Pooling</li>
                  <li>• Dense layers: 512 → 256 → 4</li>
                  <li>• Sigmoid activation for multi-label output</li>
                  <li>• Dropout (0.5, 0.3) to prevent overfitting</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Performance Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {metrics.map((m) => (
                <div key={m.label} className="p-4 rounded-lg bg-muted/50 text-center">
                  <p className="text-2xl font-display font-bold gradient-medical-text">{m.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{m.label}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass-card mb-8">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Database className="w-5 h-5 text-primary" /> Training Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p><strong className="text-foreground">Dataset:</strong> 80,000+ fundus images from EyePACS, ODIR, REFUGE, and iChallenge-AMD</p>
            <p><strong className="text-foreground">Preprocessing:</strong> Resized to 224×224, CLAHE enhancement, normalization</p>
            <p><strong className="text-foreground">Augmentation:</strong> Random flip, rotation (±20°), zoom (±10%), contrast adjustment</p>
            <p><strong className="text-foreground">Optimizer:</strong> Adam (lr=1e-4) with ReduceLROnPlateau scheduler</p>
            <p><strong className="text-foreground">Loss:</strong> Binary cross-entropy for multi-label classification</p>
            <p><strong className="text-foreground">Training:</strong> 50 epochs, batch size 32, early stopping (patience=10)</p>
          </CardContent>
        </Card>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display flex items-center gap-2">
              <Download className="w-5 h-5 text-primary" /> Downloadable Resources
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 gap-4">
              <Button onClick={downloadNotebook} variant="outline" className="h-auto py-4 flex-col gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                <span className="font-semibold">CNN Model Architecture</span>
                <span className="text-xs text-muted-foreground">Jupyter Notebook (.ipynb)</span>
              </Button>
              <Button onClick={downloadDocumentation} variant="outline" className="h-auto py-4 flex-col gap-2">
                <Database className="w-5 h-5 text-primary" />
                <span className="font-semibold">Dataset & Documentation</span>
                <span className="text-xs text-muted-foreground">PDF Document</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
