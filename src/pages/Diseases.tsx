import { DISEASES } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { motion } from 'framer-motion';
import { Eye, Activity, Scan, CircleDot, Brain, HeartPulse, GitBranch, Droplets, Sparkles, Focus } from 'lucide-react';

const iconMap: Record<string, any> = { Eye, Activity, Scan, CircleDot, HeartPulse, GitBranch, Droplets, Sparkles, Focus };

export default function Diseases() {
  return (
    <div className="container mx-auto px-4 py-10 max-w-5xl">
      <div className="text-center mb-10">
        <h1 className="font-display text-3xl font-bold mb-2">Retinal Disease Information</h1>
        <p className="text-muted-foreground">Comprehensive information about the conditions our CNN model detects</p>
      </div>

      <div className="space-y-8">
        {DISEASES.map((disease, i) => {
          const Icon = iconMap[disease.icon] || Eye;
          return (
            <motion.div
              key={disease.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card overflow-hidden">
                <CardHeader className="pb-2">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-xl gradient-medical flex items-center justify-center shrink-0">
                      <Icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <div>
                      <CardTitle className="font-display text-xl">{disease.name}</CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">{disease.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <h4 className="text-sm font-semibold font-display mb-2">Symptoms</h4>
                      <ul className="space-y-1">
                        {disease.symptoms.map((s) => (
                          <li key={s} className="text-sm text-muted-foreground flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" /> {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold font-display mb-2">Stages</h4>
                      <div className="flex flex-wrap gap-1.5">
                        {disease.stages.map((s) => (
                          <Badge key={s} variant="secondary" className="text-xs">{s}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold font-display mb-2 flex items-center gap-1">
                        <Brain className="w-3.5 h-3.5 text-primary" /> CNN Detection
                      </h4>
                      <p className="text-sm text-muted-foreground">{disease.cnnDetection}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
