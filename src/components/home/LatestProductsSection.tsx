import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, Product } from '@/lib/supabase-helpers';

export function LatestProductsSection() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          .eq('is_active', true)
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;
        setProducts(data || []);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, []);

  if (isLoading) {
    return (
      <section className="py-20 lg:py-32 bg-secondary/50">
        <div className="section-container">
          <div className="text-center mb-16">
            <p className="text-label text-muted-foreground mb-4">Shop</p>
            <h2 className="text-editorial text-3xl lg:text-5xl mb-6">Latest Arrivals</h2>
            <div className="divider-luxury" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-secondary animate-pulse" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (products.length === 0) {
    return null;
  }

  return (
    <section className="py-20 lg:py-32 bg-secondary/50">
      <div className="section-container">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="text-label text-muted-foreground mb-4 animate-fade-in">
            Shop
          </p>
          <h2 className="text-editorial text-3xl lg:text-5xl mb-6 animate-fade-in-up delay-100">
            Latest Arrivals
          </h2>
          <div className="divider-luxury" />
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-1">
          {products.map((product, index) => (
            <Link
              key={product.id}
              to={`/product/${product.id}`}
              className="group relative img-zoom aspect-[3/4] animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 50}ms` }}
            >
              <img
                src={product.images?.[0] || '/placeholder.svg'}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-500" />
              
              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-6 bg-gradient-to-t from-black/70 to-transparent text-white">
                <h3 className="font-display text-sm lg:text-base font-light mb-1 line-clamp-1">
                  {product.name}
                </h3>
                <p className="text-sm text-white/80">
                  {formatPrice(product.price)}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* View More Button */}
        <div className="text-center mt-12">
          <Link 
            to="/shop"
            className="inline-flex items-center gap-3 px-8 py-4 border border-foreground text-xs tracking-[0.15em] uppercase font-medium hover:bg-foreground hover:text-background transition-colors"
          >
            View All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
