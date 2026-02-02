import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff, Lock, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminUnlock() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();
  const { toast } = useToast();
  const { unlock } = useAdminSession();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!password) {
      toast({
        title: 'Missing password',
        description: 'Please enter the admin password.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      // Check against stored local password in localStorage, fallback to universal
      const stored = localStorage.getItem('admin_unlock_password') || 'dowslakers12';
      if (password === stored) {
        unlock();
        toast({
          title: 'Unlocked',
          description: 'Access granted.',
        });
        setTimeout(() => navigate('/admin'), 300);
      } else {
        toast({
          title: 'Invalid',
          description: 'Incorrect password.',
          variant: 'destructive',
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Lock className="h-12 w-12 mx-auto mb-4 text-foreground/60" />
          <h1 className="text-3xl font-light mb-2 font-display">Admin Access</h1>
          <p className="text-muted-foreground">Enter your admin password to continue</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <motion.div
            className="space-y-2"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
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
                autoFocus
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
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-12 bg-foreground text-background hover:opacity-80 transition-opacity font-light tracking-wider text-sm"
            >
              <span className="flex items-center justify-center gap-2">
                {isSubmitting ? 'Unlocking...' : 'UNLOCK'}
                {!isSubmitting && <ArrowRight className="h-4 w-4" />}
              </span>
            </Button>
          </motion.div>
        </form>

        <p className="text-xs text-muted-foreground text-center mt-8">
          This panel is restricted to authorized administrators only.
        </p>
      </motion.div>
    </div>
  );
}
