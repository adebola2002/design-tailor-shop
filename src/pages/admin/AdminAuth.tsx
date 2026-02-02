import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { Eye, EyeOff, Shield, Lock, Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import logoIcon from '@/assets/logo-icon.png';

export default function AdminAuth() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localPasswordMode, setLocalPasswordMode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, user, isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && user && isAdmin) {
      navigate('/admin');
    }
  }, [user, isAdmin, isLoading, navigate]);

  // If the route is used as local unlock (no server), enable local mode
  useEffect(() => {
    // detect if this route should use local unlock by checking the pathname
    if (window.location.pathname === '/admin/unlock') {
      setLocalPasswordMode(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (localPasswordMode) {
      if (!password) {
        toast({ title: 'Missing password', description: 'Please enter the admin password.', variant: 'destructive' });
        return;
      }

      setIsSubmitting(true);
      try {
        // Check against stored local password in localStorage, fallback to universal
        const stored = localStorage.getItem('admin_unlock_password') || 'dowslakers12';
        if (password === stored) {
          toast({ title: 'Unlocked', description: 'Access granted.' });
          // mark admin in local session and navigate
          localStorage.setItem('isLocalAdmin', '1');
          setTimeout(() => navigate('/admin'), 300);
        } else {
          toast({ title: 'Invalid', description: 'Incorrect password.', variant: 'destructive' });
        }
      } finally {
        setIsSubmitting(false);
      }
      return;
    }

    if (!email || !password) {
      toast({
        title: 'Missing fields',
        description: 'Please enter your email and password.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const { error } = await signIn(email, password);
      if (error) {
        toast({
          title: 'Sign in failed',
          description: 'Invalid email or password.',
          variant: 'destructive',
        });
      } else {
        // Wait briefly for profile to load
        setTimeout(() => {
          toast({
            title: 'Welcome back',
            description: 'Redirecting to dashboard...',
          });
          navigate('/admin');
        }, 500);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-background">
      {/* Left Panel - Premium Brand Section */}
      <ScrollAnimationWrapper variant="slide-left" className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-foreground to-foreground/90 text-background flex-col items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          <img 
            src={logoIcon} 
            alt="Dowslakers" 
            className="h-32 mb-12 opacity-90"
          />
          <h1 className="font-display text-4xl font-light mb-4">
            Admin Portal
          </h1>
          <p className="text-background/70 text-lg leading-relaxed max-w-sm mb-12">
            Exclusive access to manage your premium collection, orders, and customers.
          </p>
          
          <div className="space-y-4 pt-8">
            <div className="flex gap-4 items-start justify-center">
              <Shield className="h-5 w-5 flex-shrink-0 mt-1 text-background/60" />
              <p className="text-sm text-background/70">Secure authentication</p>
            </div>
            <div className="flex gap-4 items-start justify-center">
              <Lock className="h-5 w-5 flex-shrink-0 mt-1 text-background/60" />
              <p className="text-sm text-background/70">Authorized access only</p>
            </div>
          </div>
        </motion.div>
      </ScrollAnimationWrapper>

      {/* Right Panel - Sign In Form */}
      <ScrollAnimationWrapper variant="slide-right" className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:hidden text-center mb-12"
          >
            <h2 className="text-2xl font-light tracking-wide">Admin Access</h2>
          </motion.div>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mb-8"
          >
            <div className="flex items-center gap-2 mb-4">
              <div className="w-1 h-6 bg-foreground"></div>
              <span className="text-xs tracking-[0.2em] uppercase font-light">
                Secured Access
              </span>
            </div>
            <h3 className="text-3xl font-light mb-2">Sign In</h3>
            <p className="text-muted-foreground text-sm">
              Enter your credentials to access the dashboard
            </p>
          </motion.div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-light">
                Email Address
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@dowslakers.com"
                  className="h-12 pl-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors font-light"
                />
              </div>
            </motion.div>

            <motion.div
              className="space-y-2"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <label className="text-xs tracking-[0.15em] uppercase text-muted-foreground font-light">
                Password
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="h-12 pl-12 pr-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors font-light"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <Button
                type="submit"
                disabled={isSubmitting}
                className="w-full h-12 bg-foreground text-background hover:opacity-80 transition-opacity font-light tracking-wider text-sm"
              >
                <span className="flex items-center justify-center gap-2">
                  {isSubmitting ? 'Authenticating...' : 'ENTER DASHBOARD'}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Footer */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 text-xs text-muted-foreground text-center"
          >
            This portal is restricted to authorized administrators only.
          </motion.p>
        </div>
      </ScrollAnimationWrapper>
    </div>
  );
}
