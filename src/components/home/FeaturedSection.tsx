import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export function FeaturedSection() {
  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-1">
          {/* Left - Image */}
          <div className="relative aspect-[4/5] lg:aspect-auto img-zoom">
            <img
              src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?q=80&w=1280"
              alt="Ready to Wear"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Right - Content */}
          <div className="flex items-center justify-center p-8 lg:p-16 bg-background">
            <div className="max-w-md text-center">
              <p className="text-label text-muted-foreground mb-4">
                Ready to Wear
              </p>
              <h2 className="text-editorial text-3xl lg:text-4xl mb-6">
                Effortless Elegance
              </h2>
              <p className="text-muted-foreground mb-8 leading-relaxed">
                Discover our curated selection of ready-to-wear pieces, 
                each crafted with the same attention to detail and quality 
                as our bespoke creations.
              </p>
              <Link 
                to="/shop"
                className="btn-luxury inline-block"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
