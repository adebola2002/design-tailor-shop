import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useWishlist } from '@/contexts/WishlistContext';
import { useAuth } from '@/contexts/AuthContext';
 import { formatPrice, Product } from '@/lib/supabase-helpers';
 import { supabase } from '@/integrations/supabase/client';
import { Heart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageTransition, ScrollReveal, StaggerContainer, StaggerItem } from '@/components/layout/PageTransition';

export default function Wishlist() {
  const { items, removeFromWishlist } = useWishlist();
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (items.length === 0) {
        setProducts([]);
        setIsLoading(false);
        return;
      }

      try {
        const productIds = items.map(item => item.product_id);
        
         const { data, error } = await supabase
           .from('products')
           .select('*')
           .in('id', productIds);
        
         if (error) throw error;
         setProducts((data || []) as Product[]);
      } catch (error) {
        console.error('Error loading products:', error);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [items]);

  if (!user) {
    return (
      <Layout>
        <PageTransition>
          <div className="min-h-screen flex items-center justify-center px-4">
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h1 className="font-display text-2xl font-light mb-4">Your Wishlist</h1>
              <p className="text-muted-foreground mb-6">
                Please sign in to view your saved items.
              </p>
              <Link to="/auth" className="btn-luxury inline-block">
                Sign In
              </Link>
            </div>
          </div>
        </PageTransition>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Wishlist - Save Your Favorite Dowslakers Pieces"
        description="Create your Dowslakers wishlist and save favorite African wear items. Track prices and get notified about new collections and sales."
        keywords="wishlist, favorite items, saved items, price alerts, shopping list, fashion wishlist"
        canonical="https://dowslakers.com/wishlist"
      />
      <PageTransition>
        {/* Hero */}
        <section className="pt-32 pb-16 bg-secondary/30">
          <div className="section-container text-center">
            <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
              Saved Items
            </p>
            <h1 className="font-display text-4xl lg:text-5xl font-light">
              Your Wishlist
            </h1>
          </div>
        </section>

        {/* Content */}
        <section className="py-16">
          <div className="section-container">
            {isLoading ? (
              <div className="flex justify-center py-20">
                <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-20">
                <Heart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <p className="text-muted-foreground mb-6">
                  Your wishlist is empty.
                </p>
                <Link to="/shop" className="btn-luxury inline-block">
                  Explore Collection
                </Link>
              </div>
            ) : (
              <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                {products.map((product) => (
                  <StaggerItem key={product.id}>
                    <div className="group relative">
                      <Link to={`/product/${product.id}`}>
                        <div className="aspect-product bg-secondary overflow-hidden mb-4">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              No image
                            </div>
                          )}
                        </div>
                        <h3 className="font-display text-lg mb-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
                      </Link>
                      <button
                        onClick={() => removeFromWishlist(product.id)}
                        className="absolute top-4 right-4 p-2 bg-background/90 hover:bg-background transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            )}
          </div>
        </section>
      </PageTransition>
    </Layout>
  );
}
