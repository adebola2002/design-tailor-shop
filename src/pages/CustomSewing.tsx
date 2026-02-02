import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { fetchSewingStyles, fetchCategories, createOrder, createSewingOrderDetails, SewingStyle, Category, formatPrice } from '@/lib/supabase-helpers';
import { Scissors, Ruler, Check, ArrowRight, ArrowLeft, Sparkles } from 'lucide-react';

const MEASUREMENT_FIELDS = [
  { key: 'chest', label: 'Chest (inches)', placeholder: 'e.g., 42' },
  { key: 'shoulder', label: 'Shoulder Width (inches)', placeholder: 'e.g., 18' },
  { key: 'arm_length', label: 'Arm Length (inches)', placeholder: 'e.g., 25' },
  { key: 'waist', label: 'Waist (inches)', placeholder: 'e.g., 36' },
  { key: 'hip', label: 'Hip (inches)', placeholder: 'e.g., 40' },
  { key: 'length', label: 'Outfit Length (inches)', placeholder: 'e.g., 45' },
  { key: 'trouser_length', label: 'Trouser Length (inches)', placeholder: 'e.g., 42' },
  { key: 'thigh', label: 'Thigh (inches)', placeholder: 'e.g., 24' },
];

const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', 'XXL', 'XXXL'];

export default function CustomSewing() {
  const [styles, setStyles] = useState<SewingStyle[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [step, setStep] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [selectedStyle, setSelectedStyle] = useState<SewingStyle | null>(null);
  const [sizeOption, setSizeOption] = useState<'standard' | 'custom'>('standard');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [measurements, setMeasurements] = useState<Record<string, string>>({});
  const [specialInstructions, setSpecialInstructions] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [stylesData, categoriesData] = await Promise.all([
        fetchSewingStyles(),
        fetchCategories()
      ]);
      setStyles(stylesData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading data:', error);
      toast({
        title: "Error",
        description: "Failed to load sewing styles",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const filteredStyles = selectedCategory
    ? styles.filter(s => s.category_id === selectedCategory)
    : styles;

  const handleSubmit = async () => {
    if (!user) {
      toast({
        title: "Login Required",
        description: "Please login to submit your sewing request",
        variant: "destructive",
      });
      navigate('/auth');
      return;
    }

    if (!selectedStyle) {
      toast({
        title: "Select a Style",
        description: "Please select a sewing style first",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Create the order
      const order = await createOrder({
        user_id: user.id,
        order_type: 'sewing',
        notes: specialInstructions || undefined,
      });

      // Create sewing order details
      await createSewingOrderDetails({
        order_id: order.id,
        sewing_style_id: selectedStyle.id,
        size_option: sizeOption === 'standard' ? selectedSize : 'custom',
        measurements: sizeOption === 'custom' ? measurements : undefined,
        special_instructions: specialInstructions || undefined,
      });

      toast({
        title: "Request Submitted!",
        description: "Your custom sewing request has been submitted. We'll contact you shortly.",
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error submitting order:', error);
      toast({
        title: "Error",
        description: "Failed to submit your request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return selectedStyle !== null;
      case 2:
        if (sizeOption === 'standard') return true;
        return Object.values(measurements).some(v => v.trim() !== '');
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <Layout>
      <SEO
        title="Custom Sewing & Bespoke Tailoring | Dowslakers"
        description="Get custom-made garments with Dowslakers bespoke tailoring service. Premium fabrics, expert craftsmanship, personalized fit for weddings, events, or everyday elegance."
        keywords="custom sewing, bespoke tailoring, made to measure, custom agbada, custom kaftan, tailoring service, personalized clothing, premium tailoring, expert craftsmen, African tailoring"
        canonical="https://dowslakers.com/custom-sewing"
      />
      {/* Hero */}
      <div className="bg-primary text-primary-foreground py-16 px-4">
        <div className="section-container text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-sm mb-6">
            <Scissors className="h-4 w-4" />
            <span className="text-sm">Custom Tailoring</span>
          </div>
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 animate-fade-in-up">
            Sew Your Signature Style
          </h1>
          <p className="text-primary-foreground/80 max-w-xl mx-auto animate-fade-in-up delay-100">
            Choose from our curated collection of traditional styles. Made-to-measure perfection.
          </p>
        </div>
      </div>

      <div className="section-container py-12">
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-12">
          {[1, 2, 3].map((s) => (
            <div key={s} className="flex items-center gap-4">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                step >= s ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'
              }`}>
                {step > s ? <Check className="h-5 w-5" /> : s}
              </div>
              {s < 3 && (
                <div className={`w-20 h-0.5 hidden sm:block ${step > s ? 'bg-primary' : 'bg-secondary'}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step Labels */}
        <div className="flex justify-center gap-8 md:gap-20 text-sm text-muted-foreground mb-12">
          <span className={step >= 1 ? 'text-foreground font-medium' : ''}>Select Style</span>
          <span className={step >= 2 ? 'text-foreground font-medium' : ''}>Measurements</span>
          <span className={step >= 3 ? 'text-foreground font-medium' : ''}>Review</span>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {/* Step 1: Select Style */}
            {step === 1 && (
              <div className="animate-fade-in">
                {/* Category Filter */}
                <div className="flex flex-wrap gap-3 justify-center mb-8">
                  <button
                    onClick={() => setSelectedCategory('')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      !selectedCategory ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    All Styles
                  </button>
                  {categories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setSelectedCategory(cat.id)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                        selectedCategory === cat.id ? 'bg-primary text-primary-foreground' : 'bg-secondary hover:bg-secondary/80'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>

                {/* Styles Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredStyles.map((style) => (
                    <div
                      key={style.id}
                      onClick={() => setSelectedStyle(style)}
                      className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all card-hover ${
                        selectedStyle?.id === style.id
                          ? 'border-primary ring-2 ring-primary/20'
                          : 'border-transparent hover:border-border'
                      }`}
                    >
                      <div className="aspect-product bg-secondary overflow-hidden">
                        <img
                          src={style.images?.[0] || '/placeholder.svg'}
                          alt={style.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-4 bg-card">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-medium text-lg">{style.name}</h3>
                            <p className="text-sm text-muted-foreground">{style.category?.name}</p>
                          </div>
                          {style.base_price && (
                            <span className="font-bold">From {formatPrice(style.base_price)}</span>
                          )}
                        </div>
                        {selectedStyle?.id === style.id && (
                          <div className="mt-3 flex items-center gap-2 text-primary">
                            <Check className="h-4 w-4" />
                            <span className="text-sm font-medium">Selected</span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredStyles.length === 0 && (
                  <div className="text-center py-20">
                    <Scissors className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">No styles available in this category</p>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Measurements */}
            {step === 2 && (
              <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="bg-card border rounded-xl p-6 mb-6">
                  <div className="flex items-center gap-3 mb-6">
                    <Ruler className="h-5 w-5 text-primary" />
                    <h2 className="text-xl font-medium">Size Information</h2>
                  </div>

                  <RadioGroup value={sizeOption} onValueChange={(v) => setSizeOption(v as 'standard' | 'custom')}>
                    <div className="space-y-4">
                      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        sizeOption === 'standard' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                      }`}>
                        <RadioGroupItem value="standard" id="standard" />
                        <Label htmlFor="standard" className="flex-1 cursor-pointer">
                          <div className="font-medium">Standard Size</div>
                          <div className="text-sm text-muted-foreground">Choose from our standard size chart</div>
                        </Label>
                      </div>

                      <div className={`flex items-center gap-3 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                        sizeOption === 'custom' ? 'border-primary bg-primary/5' : 'border-border hover:border-muted-foreground'
                      }`}>
                        <RadioGroupItem value="custom" id="custom" />
                        <Label htmlFor="custom" className="flex-1 cursor-pointer">
                          <div className="font-medium">Custom Measurements</div>
                          <div className="text-sm text-muted-foreground">Provide your exact measurements for a perfect fit</div>
                        </Label>
                      </div>
                    </div>
                  </RadioGroup>
                </div>

                {sizeOption === 'standard' ? (
                  <div className="bg-card border rounded-xl p-6 animate-fade-in">
                    <h3 className="font-medium mb-4">Select Your Size</h3>
                    <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
                      {SIZE_OPTIONS.map((size) => (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`py-3 rounded-lg border-2 font-medium transition-all ${
                            selectedSize === size
                              ? 'border-primary bg-primary text-primary-foreground'
                              : 'border-border hover:border-foreground'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="bg-card border rounded-xl p-6 animate-fade-in">
                    <h3 className="font-medium mb-4">Enter Your Measurements</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {MEASUREMENT_FIELDS.map((field) => (
                        <div key={field.key}>
                          <Label htmlFor={field.key}>{field.label}</Label>
                          <Input
                            id={field.key}
                            placeholder={field.placeholder}
                            value={measurements[field.key] || ''}
                            onChange={(e) => setMeasurements(prev => ({ ...prev, [field.key]: e.target.value }))}
                            className="mt-1"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Review */}
            {step === 3 && (
              <div className="max-w-2xl mx-auto animate-fade-in">
                <div className="bg-card border rounded-xl overflow-hidden">
                  {/* Selected Style Preview */}
                  <div className="flex flex-col sm:flex-row">
                    <div className="w-full sm:w-1/3 aspect-product bg-secondary">
                      <img
                        src={selectedStyle?.images?.[0] || '/placeholder.svg'}
                        alt={selectedStyle?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 p-6">
                      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm mb-3">
                        <Sparkles className="h-3 w-3" />
                        Selected Style
                      </div>
                      <h2 className="text-2xl font-display font-bold mb-2">{selectedStyle?.name}</h2>
                      <p className="text-muted-foreground mb-4">{selectedStyle?.category?.name}</p>
                      {selectedStyle?.base_price && (
                        <p className="text-xl font-bold">From {formatPrice(selectedStyle.base_price)}</p>
                      )}
                    </div>
                  </div>

                  <div className="border-t p-6 space-y-4">
                    <div>
                      <h3 className="font-medium mb-2">Size Information</h3>
                      {sizeOption === 'standard' ? (
                        <p className="text-muted-foreground">Standard Size: <span className="text-foreground font-medium">{selectedSize}</span></p>
                      ) : (
                        <div className="grid grid-cols-2 gap-2 text-sm">
                          {Object.entries(measurements).filter(([_, v]) => v.trim()).map(([key, value]) => (
                            <div key={key} className="flex justify-between">
                              <span className="text-muted-foreground capitalize">{key.replace('_', ' ')}:</span>
                              <span className="font-medium">{value}"</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Special Instructions */}
                    <div>
                      <Label htmlFor="instructions">Special Instructions (Optional)</Label>
                      <Textarea
                        id="instructions"
                        placeholder="Any specific requirements or preferences..."
                        value={specialInstructions}
                        onChange={(e) => setSpecialInstructions(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-12 max-w-2xl mx-auto">
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
                disabled={step === 1}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>

              {step < 3 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                  className="gap-2"
                >
                  Continue
                  <ArrowRight className="h-4 w-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="gap-2"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Request'}
                  <Scissors className="h-4 w-4" />
                </Button>
              )}
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
