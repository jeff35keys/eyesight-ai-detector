import { useState, useEffect } from 'react';
import { getHistory, clearHistory } from '@/lib/storage';
import { downloadCSV } from '@/lib/downloads';
import { PredictionResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileSpreadsheet, Trash2, History, Eye, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

const severityVariant: Record<string, 'default' | 'secondary' | 'destructive' | 'outline'> = {
  Normal: 'secondary',
  Mild: 'outline',
  Moderate: 'outline',
  Severe: 'destructive',
  Proliferative: 'destructive',
};

export default function Dashboard() {
  const [history, setHistory] = useState<PredictionResult[]>([]);
  const { toast } = useToast();

  useEffect(() => { getHistory().then(setHistory); }, []);

  const handleClear = async () => {
    await clearHistory();
    setHistory([]);
    toast({ title: 'History Cleared' });
  };

  const detected = history.reduce((a, r) => a + r.predictions.filter((p) => p.detected).length, 0);
  const avgRisk = history.length ? Math.round(history.reduce((a, r) => a + r.overallRisk, 0) / history.length) : 0;

  return (
    <div className="container mx-auto px-4 py-10 max-w-6xl">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Analysis Dashboard</h1>
            <p className="text-muted-foreground">View and export your analysis history</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => downloadCSV(history)} disabled={!history.length}>
              <FileSpreadsheet className="w-4 h-4 mr-2" /> Export All CSV
            </Button>
            <Button variant="outline" onClick={handleClear} disabled={!history.length} className="text-destructive">
              <Trash2 className="w-4 h-4 mr-2" /> Clear
            </Button>
          </div>
        </div>

        <div className="grid sm:grid-cols-3 gap-4 mb-8">
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg gradient-medical flex items-center justify-center">
                <Eye className="w-5 h-5 text-primary-foreground" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{history.length}</p>
                <p className="text-xs text-muted-foreground">Total Analyses</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-medical-danger/10 flex items-center justify-center">
                <BarChart3 className="w-5 h-5 text-medical-danger" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{detected}</p>
                <p className="text-xs text-muted-foreground">Detections</p>
              </div>
            </CardContent>
          </Card>
          <Card className="glass-card">
            <CardContent className="pt-6 flex items-center gap-4">
              <div className="w-10 h-10 rounded-lg bg-medical-warning/10 flex items-center justify-center">
                <History className="w-5 h-5 text-medical-warning" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{avgRisk}%</p>
                <p className="text-xs text-muted-foreground">Avg Risk Score</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="glass-card">
          <CardHeader>
            <CardTitle className="font-display">Analysis History</CardTitle>
          </CardHeader>
          <CardContent>
            {history.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                <History className="w-10 h-10 mx-auto mb-3 opacity-40" />
                <p>No analyses yet. Upload an image to get started.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Image</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Risk</TableHead>
                      <TableHead>DR</TableHead>
                      <TableHead>GL</TableHead>
                      <TableHead>AMD</TableHead>
                      <TableHead>CT</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {history.map((r) => (
                      <TableRow key={r.id}>
                        <TableCell className="text-xs whitespace-nowrap">{new Date(r.timestamp).toLocaleDateString()}</TableCell>
                        <TableCell className="text-xs max-w-[120px] truncate">{r.imageName}</TableCell>
                        <TableCell><Badge variant={severityVariant[r.severity]}>{r.severity}</Badge></TableCell>
                        <TableCell className="font-mono text-sm">{r.overallRisk}%</TableCell>
                        {r.predictions.map((p, i) => (
                          <TableCell key={i}>
                            <span className={`text-xs font-medium ${p.detected ? 'text-medical-danger' : 'text-medical-green'}`}>
                              {(p.confidence * 100).toFixed(0)}%
                            </span>
                          </TableCell>
                        ))}
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
