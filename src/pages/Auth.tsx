import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

const emailSchema = z.string().trim().email({ message: 'Invalid email' }).max(255);
const passwordSchema = z.string().min(6, { message: 'Password must be at least 6 characters' }).max(72);
const nameSchema = z.string().trim().min(1, { message: 'Name is required' }).max(100);

export default function Auth() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const from = (location.state as { from?: string })?.from || '/analyze';

  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');

  useEffect(() => {
    if (!authLoading && user) navigate(from, { replace: true });
  }, [user, authLoading, navigate, from]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const em = emailSchema.safeParse(email);
    const pw = passwordSchema.safeParse(password);
    if (!em.success || !pw.success) {
      toast({ title: 'Invalid input', description: em.error?.issues[0]?.message || pw.error?.issues[0]?.message, variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: em.data, password: pw.data });
    setLoading(false);
    if (error) toast({ title: 'Sign in failed', description: error.message, variant: 'destructive' });
    else toast({ title: 'Welcome back!' });
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    const nm = nameSchema.safeParse(fullName);
    const em = emailSchema.safeParse(email);
    const pw = passwordSchema.safeParse(password);
    if (!nm.success || !em.success || !pw.success) {
      toast({ title: 'Invalid input', description: nm.error?.issues[0]?.message || em.error?.issues[0]?.message || pw.error?.issues[0]?.message, variant: 'destructive' });
      return;
    }
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: em.data,
      password: pw.data,
      options: {
        emailRedirectTo: `${window.location.origin}/`,
        data: { full_name: nm.data },
      },
    });
    setLoading(false);
    if (error) {
      toast({ title: 'Sign up failed', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Account created', description: 'You can sign in now.' });
    }
  };

  return (
    <div className="container mx-auto px-4 py-16 max-w-md">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <Link to="/" className="flex items-center justify-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-lg gradient-medical flex items-center justify-center">
            <Eye className="w-5 h-5 text-primary-foreground" />
          </div>
          <span className="font-display font-bold text-xl gradient-medical-text">RetinaAI</span>
        </Link>

        <Card className="glass-card">
          <CardHeader className="text-center">
            <CardTitle className="font-display">Welcome</CardTitle>
            <CardDescription>Sign in or create an account to analyze scans</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="signin">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="signin">Sign In</TabsTrigger>
                <TabsTrigger value="signup">Register</TabsTrigger>
              </TabsList>

              <TabsContent value="signin">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="si-email">Email</Label>
                    <Input id="si-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="si-pw">Password</Label>
                    <Input id="si-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gradient-medical text-primary-foreground">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Sign In'}
                  </Button>
                </form>
              </TabsContent>

              <TabsContent value="signup">
                <form onSubmit={handleSignUp} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="su-name">Full Name</Label>
                    <Input id="su-name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-email">Email</Label>
                    <Input id="su-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="su-pw">Password</Label>
                    <Input id="su-pw" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
                  </div>
                  <Button type="submit" disabled={loading} className="w-full gradient-medical text-primary-foreground">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Create Account'}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
