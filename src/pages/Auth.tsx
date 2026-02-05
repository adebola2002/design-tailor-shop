import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
 import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
 import { Mail, Lock, User, Eye, EyeOff, ArrowRight, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';
import logoIcon from '@/assets/logo-icon.png';

export default function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
   const [phoneNumber, setPhoneNumber] = useState('');
   const [deliveryAddress, setDeliveryAddress] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const validateForm = () => {
    if (!email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast({
        title: "Error",
        description: "Please enter a valid email address",
        variant: "destructive",
      });
      return false;
    }
    
    if (password.length < 6) {
      toast({
        title: "Error",
        description: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return false;
    }
    
    if (!isLogin && !fullName.trim()) {
      toast({
        title: "Error",
        description: "Please enter your full name",
        variant: "destructive",
      });
      return false;
    }
    
     if (!isLogin && !phoneNumber.trim()) {
       toast({
         title: "Error",
         description: "Please enter your phone number",
         variant: "destructive",
       });
       return false;
     }
     
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Login Failed",
            description: error.message === 'Invalid login credentials' 
              ? 'Invalid email or password' 
              : error.message,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Welcome Back!",
            description: "You have successfully logged in",
          });
          navigate('/');
        }
      } else {
        // Parse full name into first and last name
        const nameParts = fullName.trim().split(' ');
        const firstName = nameParts[0] || '';
        const lastName = nameParts.slice(1).join(' ') || '';
         const { error } = await signUp(email, password, firstName, lastName, phoneNumber, deliveryAddress);
        if (error) {
          let errorMessage = error.message;
          if (error.message.includes('already registered')) {
            errorMessage = 'An account with this email already exists';
          }
          toast({
            title: "Signup Failed",
            description: errorMessage,
            variant: "destructive",
          });
        } else {
          toast({
            title: "Account Created!",
            description: "Welcome to Dowslakers. You are now logged in.",
          });
          navigate('/');
        }
      }
    } catch {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout hideFooter>
      <SEO
        title="Sign In / Register - Dowslakers Account"
        description="Create your Dowslakers account or sign in. Access custom tailoring services, order tracking, wishlist, and exclusive member benefits for premium African fashion."
        keywords="sign in, login, create account, register, member account, custom order account, user profile"
        canonical="https://dowslakers.com/auth"
      />
      <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-4 py-12">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 w-full max-w-5xl items-center">
          {/* Left - Hero Section */}
          <ScrollAnimationWrapper variant="slide-left" className="hidden lg:block">
            <div className="space-y-6">
              <div>
                <img 
                  src={logoIcon} 
                  alt="Dowslakers" 
                  className="h-16 mb-8 opacity-80"
                />
                <h2 className="font-display text-4xl lg:text-5xl font-light leading-tight mb-4">
                  Discover Your Signature Style
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Join Dowslakers to explore our exclusive collection of premium African wear. 
                  Crafted with elegance, designed for you.
                </p>
              </div>
              
              <div className="space-y-4 pt-8">
                <div className="flex gap-4 items-start">
                  <div className="w-1 h-12 bg-foreground/50"></div>
                  <div>
                    <h3 className="font-medium text-sm tracking-wide mb-1">PREMIUM QUALITY</h3>
                    <p className="text-sm text-muted-foreground">Handcrafted with finest materials</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-1 h-12 bg-foreground/50"></div>
                  <div>
                    <h3 className="font-medium text-sm tracking-wide mb-1">CUSTOM TAILORING</h3>
                    <p className="text-sm text-muted-foreground">Perfect fit, your way</p>
                  </div>
                </div>
                <div className="flex gap-4 items-start">
                  <div className="w-1 h-12 bg-foreground/50"></div>
                  <div>
                    <h3 className="font-medium text-sm tracking-wide mb-1">FAST DELIVERY</h3>
                    <p className="text-sm text-muted-foreground">3-5 business days worldwide</p>
                  </div>
                </div>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Right - Auth Form */}
          <ScrollAnimationWrapper variant="slide-right" className="w-full">
            <div className="space-y-8">
              {/* Header */}
              <div className="text-center lg:text-left">
                <h1 className="font-display text-3xl font-light mb-2">
                  {isLogin ? 'Welcome Back' : 'Create Account'}
                </h1>
                <p className="text-muted-foreground">
                  {isLogin 
                    ? 'Sign in to access your account' 
                    : 'Join us and start your journey'}
                </p>
              </div>

              {/* Tab Toggle */}
              <div className="flex gap-1 bg-secondary p-1 rounded-lg">
                <motion.button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-6 text-sm tracking-wider font-light transition-all ${
                    isLogin 
                      ? 'bg-background text-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  SIGN IN
                </motion.button>
                <motion.button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-6 text-sm tracking-wider font-light transition-all ${
                    !isLogin 
                      ? 'bg-background text-foreground shadow-md' 
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  REGISTER
                </motion.button>
              </div>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                {!isLogin && (
                  <motion.div 
                    className="space-y-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Label htmlFor="fullName" className="text-xs tracking-widest uppercase">Full Name</Label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                      <Input
                        id="fullName"
                        type="text"
                        placeholder="Your full name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        className="pl-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors py-3"
                      />
                    </div>
                  </motion.div>
                )}

                 {!isLogin && (
                   <motion.div 
                     className="space-y-2"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: 0.05 }}
                   >
                     <Label htmlFor="phoneNumber" className="text-xs tracking-widest uppercase">Phone Number</Label>
                     <div className="relative group">
                       <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                       <Input
                         id="phoneNumber"
                         type="tel"
                         placeholder="+234 800 000 0000"
                         value={phoneNumber}
                         onChange={(e) => setPhoneNumber(e.target.value)}
                         className="pl-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors py-3"
                       />
                     </div>
                   </motion.div>
                 )}
 
                 {!isLogin && (
                   <motion.div 
                     className="space-y-2"
                     initial={{ opacity: 0, y: 10 }}
                     animate={{ opacity: 1, y: 0 }}
                     transition={{ duration: 0.3, delay: 0.1 }}
                   >
                     <Label htmlFor="deliveryAddress" className="text-xs tracking-widest uppercase">Delivery Address (Optional)</Label>
                     <div className="relative group">
                       <MapPin className="absolute left-4 top-4 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                       <Textarea
                         id="deliveryAddress"
                         placeholder="Your delivery address"
                         value={deliveryAddress}
                         onChange={(e) => setDeliveryAddress(e.target.value)}
                         className="pl-12 min-h-[70px] bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors resize-none"
                       />
                     </div>
                   </motion.div>
                 )}
 
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-xs tracking-widest uppercase">Email Address</Label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors py-3"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-xs tracking-widest uppercase">Password</Label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-foreground transition-colors" />
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-12 pr-12 bg-secondary/50 border-0 border-b-2 border-secondary rounded-none focus-visible:ring-0 focus-visible:border-foreground transition-colors py-3"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Button
                    type="submit"
                    className="w-full py-3 px-6 text-sm tracking-[0.15em] uppercase font-light bg-foreground text-background hover:opacity-80 transition-opacity"
                    disabled={isSubmitting}
                  >
                    <span className="flex items-center justify-center gap-2">
                      {isSubmitting ? 'Please wait...' : isLogin ? 'SIGN IN' : 'CREATE ACCOUNT'}
                      {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                    </span>
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  {isLogin ? "Don't have an account? " : "Already registered? "}
                  <button
                    onClick={() => {
                      setIsLogin(!isLogin);
                      setEmail('');
                      setPassword('');
                      setFullName('');
                       setPhoneNumber('');
                       setDeliveryAddress('');
                    }}
                    className="text-foreground font-medium hover:underline tracking-wide"
                  >
                    {isLogin ? 'REGISTER NOW' : 'SIGN IN'}
                  </button>
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </div>
    </Layout>
  );
}
