import { PredictionResult } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Download, FileText, FileSpreadsheet, AlertTriangle, CheckCircle } from 'lucide-react';
import { downloadPDFReport, downloadCSV } from '@/lib/downloads';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const COLORS = ['#178484', '#2d6ea5', '#3ba5a5', '#2a8f5a'];

const severityStyles: Record<string, string> = {
  Normal: 'bg-medical-green/10 text-medical-green border-medical-green/30',
  Mild: 'bg-medical-warning/10 text-medical-warning border-medical-warning/30',
  Moderate: 'bg-orange-100 text-orange-700 border-orange-300',
  Severe: 'bg-medical-danger/10 text-medical-danger border-medical-danger/30',
  Proliferative: 'bg-red-100 text-red-900 border-red-400',
};

export function ResultsDisplay({ result }: { result: PredictionResult }) {
  const chartData = result.predictions.map((p) => ({
    name: p.disease.split(' ').map(w => w[0]).join(''),
    fullName: p.disease,
    confidence: Math.round(p.confidence * 100),
    detected: p.detected,
  }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4">
        <Card className="flex-1 glass-card">
          <CardContent className="pt-6 flex items-center gap-4">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${result.severity === 'Normal' ? 'bg-medical-green/10' : 'bg-medical-danger/10'}`}>
              {result.severity === 'Normal' ? (
                <CheckCircle className="w-6 h-6 text-medical-green" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-medical-danger" />
              )}
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Severity</p>
              <Badge variant="outline" className={severityStyles[result.severity]}>{result.severity}</Badge>
            </div>
          </CardContent>
        </Card>
        <Card className="flex-1 glass-card">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Overall Risk Score</p>
            <p className="text-3xl font-display font-bold gradient-medical-text">{result.overallRisk}%</p>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Confidence Scores</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="name" tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <YAxis domain={[0, 100]} tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 12 }} />
              <Tooltip
                contentStyle={{ background: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
                formatter={(value: number, _: string, entry: any) => [`${value}%`, entry.payload.fullName]}
              />
              <Bar dataKey="confidence" radius={[6, 6, 0, 0]}>
                {chartData.map((_, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="font-display text-lg">Detailed Predictions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.predictions.map((p, i) => (
            <div key={i} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="font-medium text-sm">{p.disease}</span>
                <Badge variant={p.detected ? 'destructive' : 'secondary'} className="text-xs">
                  {p.detected ? 'Detected' : 'Not Detected'}
                </Badge>
              </div>
              <div className="flex items-center gap-3">
                <Progress value={p.confidence * 100} className="h-2 flex-1" />
                <span className="text-sm font-mono text-muted-foreground w-14 text-right">
                  {(p.confidence * 100).toFixed(1)}%
                </span>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex flex-wrap gap-3">
        <Button onClick={() => downloadPDFReport(result)} className="gradient-medical text-primary-foreground">
          <FileText className="w-4 h-4 mr-2" /> Download PDF Report
        </Button>
        <Button variant="outline" onClick={() => downloadCSV([result])}>
          <FileSpreadsheet className="w-4 h-4 mr-2" /> Export CSV
        </Button>
      </div>
    </div>
  );
}
