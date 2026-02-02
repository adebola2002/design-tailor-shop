import { useState } from 'react';
import { toast } from 'sonner';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    try {
      const response = await fetch(`${API_URL}/subscribers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      toast.success('Thank you for subscribing');
      setEmail('');
    } catch (error) {
      toast.error('Unable to subscribe. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-24 lg:py-32 bg-foreground text-background">
      <div className="container-narrow text-center">
        <p className="text-label text-background/60 mb-4">
          Stay Connected
        </p>
        <h2 className="text-editorial text-3xl lg:text-4xl mb-4">
          Join the Maison
        </h2>
        <p className="text-background/70 mb-10 max-w-md mx-auto">
          Be the first to discover new collections, exclusive events, 
          and the art of Nigerian luxury fashion.
        </p>

        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-6 py-4 bg-transparent border border-background/30 text-background placeholder:text-background/50 text-sm tracking-wide focus:outline-none focus:border-background transition-colors"
              required
            />
            <button
              type="submit"
              disabled={isLoading}
              className="px-8 py-4 bg-background text-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-background/90 transition-colors disabled:opacity-50"
            >
              {isLoading ? 'Subscribing...' : 'Subscribe'}
            </button>
          </div>
        </form>

        <p className="text-xs text-background/40 mt-6">
          By subscribing, you agree to receive marketing communications from Dowslakers.
        </p>
      </div>
    </section>
  );
}
