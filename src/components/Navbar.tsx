import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Eye, Menu, X, LogOut, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const links = [
  { to: '/', label: 'Home' },
  { to: '/analyze', label: 'Analyze' },
  { to: '/architecture', label: 'CNN Model' },
  { to: '/diseases', label: 'Diseases' },
  { to: '/dashboard', label: 'Dashboard' },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 glass-card border-b">
      <div className="container mx-auto flex items-center justify-between h-16 px-4">
        <Link to="/" className="flex items-center gap-2 font-display font-bold text-lg">
          <div className="w-8 h-8 rounded-lg gradient-medical flex items-center justify-center">
            <Eye className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="gradient-medical-text">RetinaAI</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className={cn(
                'px-3 py-2 rounded-md text-sm font-medium transition-colors',
                location.pathname === l.to
                  ? 'bg-primary/10 text-primary'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted'
              )}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <Button variant="ghost" size="sm" onClick={handleLogout} className="ml-2">
              <LogOut className="w-4 h-4 mr-2" /> Sign Out
            </Button>
          ) : (
            <Button asChild size="sm" className="ml-2 gradient-medical text-primary-foreground">
              <Link to="/auth"><LogIn className="w-4 h-4 mr-2" /> Sign In</Link>
            </Button>
          )}
        </div>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X /> : <Menu />}
        </Button>
      </div>

      {open && (
        <div className="md:hidden border-t bg-card p-4 space-y-1">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={cn(
                'block px-3 py-2 rounded-md text-sm font-medium',
                location.pathname === l.to ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
              )}
            >
              {l.label}
            </Link>
          ))}
          {user ? (
            <button
              onClick={() => { setOpen(false); handleLogout(); }}
              className="w-full text-left block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground"
            >
              Sign Out
            </button>
          ) : (
            <Link to="/auth" onClick={() => setOpen(false)} className="block px-3 py-2 rounded-md text-sm font-medium text-primary">
              Sign In / Register
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
