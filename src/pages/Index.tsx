import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, Upload, BarChart3, Download, Brain, ShieldCheck, Zap, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { DISEASES } from '@/lib/types';

const steps = [
  { icon: Upload, title: 'Upload', desc: 'Upload a retina fundus image in any standard format' },
  { icon: Brain, title: 'Analyze', desc: 'Our CNN model processes the image and detects diseases' },
  { icon: Download, title: 'Download', desc: 'Get detailed PDF reports, CSV exports, and more' },
];

const Index = () => (
  <div className="min-h-screen">
    {/* Hero */}
    <section className="relative overflow-hidden py-20 md:py-32">
      <div className="absolute inset-0 gradient-medical opacity-5" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
            <ShieldCheck className="w-4 h-4" />
            CNN-Powered Retina Analysis
          </div>
          <h1 className="font-display text-4xl md:text-6xl font-bold tracking-tight mb-6">
            Automated Retina
            <span className="gradient-medical-text block">Disease Detection</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Upload fundus images and get instant AI-powered predictions for Diabetic Retinopathy, Glaucoma, AMD, and Cataracts with downloadable reports.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="gradient-medical text-primary-foreground shadow-medical">
              <Link to="/analyze"><Upload className="w-4 h-4 mr-2" /> Start Analysis</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/architecture"><Brain className="w-4 h-4 mr-2" /> View CNN Model</Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>

    {/* How It Works */}
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card text-center h-full hover:shadow-medical transition-shadow">
                <CardContent className="pt-8 pb-6">
                  <div className="w-14 h-14 rounded-xl gradient-medical flex items-center justify-center mx-auto mb-4 shadow-medical">
                    <s.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <div className="text-xs font-bold text-primary mb-1">STEP {i + 1}</div>
                  <h3 className="font-display text-xl font-semibold mb-2">{s.title}</h3>
                  <p className="text-sm text-muted-foreground">{s.desc}</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Diseases */}
    <section className="py-20">
      <div className="container mx-auto px-4">
        <h2 className="font-display text-3xl font-bold text-center mb-4">Supported Conditions</h2>
        <p className="text-center text-muted-foreground mb-12 max-w-lg mx-auto">
          Our CNN model is trained to detect four major retinal diseases with high accuracy.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {DISEASES.map((d, i) => (
            <motion.div
              key={d.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="glass-card h-full hover:shadow-medical transition-all group cursor-pointer">
                <CardContent className="pt-6">
                  <div className={`w-10 h-10 rounded-lg bg-${d.color}/10 flex items-center justify-center mb-3`}>
                    <Eye className={`w-5 h-5 text-${d.color}`} />
                  </div>
                  <h3 className="font-display font-semibold mb-1">{d.name}</h3>
                  <p className="text-xs text-muted-foreground line-clamp-2">{d.description}</p>
                  <Link to="/diseases" className="text-xs text-primary flex items-center gap-1 mt-3 group-hover:gap-2 transition-all">
                    Learn more <ArrowRight className="w-3 h-3" />
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>

    {/* Stats */}
    <section className="py-16 gradient-medical">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-primary-foreground">
          {[
            { value: '94.2%', label: 'Accuracy' },
            { value: '0.967', label: 'AUC-ROC' },
            { value: '80K+', label: 'Training Images' },
            { value: '4', label: 'Disease Classes' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-display font-bold">{s.value}</p>
              <p className="text-sm opacity-80 mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* CTA */}
    <section className="py-20">
      <div className="container mx-auto px-4 text-center">
        <h2 className="font-display text-3xl font-bold mb-4">Ready to Analyze?</h2>
        <p className="text-muted-foreground mb-6">Upload your first fundus image and get instant results.</p>
        <Button asChild size="lg" className="gradient-medical text-primary-foreground shadow-medical">
          <Link to="/analyze"><Zap className="w-4 h-4 mr-2" /> Get Started</Link>
        </Button>
      </div>
    </section>
  </div>
);

export default Index;
