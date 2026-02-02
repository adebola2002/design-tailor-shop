import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { fetchProducts, Product, formatPrice } from '@/lib/supabase-helpers';

import agbadaHero from '@/assets/agbada-hero.jpg';
import kaftanHero from '@/assets/kaftan-hero.jpg';
import urbanHero from '@/assets/urban-hero.jpg';

const collectionData: Record<string, { title: string; subtitle: string; description: string; hero: string; slug: string }> = {
  agbada: {
    title: 'Agbada',
    subtitle: 'Royal Elegance Redefined',
    description: 'The Agbada represents the pinnacle of Nigerian formal wear. Each piece is a masterwork of traditional craftsmanship, designed for those who command presence.',
    hero: agbadaHero,
    slug: 'agbada',
  },
  kaftan: {
    title: 'Kaftan',
    subtitle: 'Timeless Sophistication',
    description: 'Our Kaftan collection blends comfort with refined style. Perfect for both casual elegance and formal occasions.',
    hero: kaftanHero,
    slug: 'kaftan',
  },
  urban: {
    title: 'Urban Wears',
    subtitle: 'Contemporary African Style',
    description: 'Modern silhouettes meet traditional African aesthetics. For the fashion-forward individual who celebrates their heritage.',
    hero: urbanHero,
    slug: 'urban',
  },
};

function ProductCard({ product, onAddToCart }: { product: Product; onAddToCart: (product: Product, size: string) => void }) {
  const [selectedSize, setSelectedSize] = useState<string>('');
  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="aspect-[3/4] overflow-hidden mb-4 bg-secondary">
        <img
          src={product.images?.[0] || '/placeholder.svg'}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
      </div>
      <h3 className="text-sm font-medium mb-1">{product.name}</h3>
      <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
    </Link>
  );
}

export default function Collection() {
  const { slug } = useParams<{ slug: string }>();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addItem } = useCart();
  const { toast } = useToast();

  const collection = slug ? collectionData[slug] : null;

  const loadProducts = useCallback(async () => {
    try {
      const data = await fetchProducts(collection?.slug);
      setProducts(data);
    } catch (error) {
      console.error('Error loading products:', error);
    } finally {
      setIsLoading(false);
    }
  }, [collection?.slug]);

  useEffect(() => {
    if (collection) {
      loadProducts();
    }
  }, [collection, loadProducts]);

  const handleAddToCart = (product: Product, size: string) => {
    addItem(product, size);
    toast({
      title: "Added to Cart",
      description: `${product.name} (${size}) added to your cart`,
    });
  };

  if (!collection) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="font-display text-3xl">Collection Not Found</h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={collection ? `${collection.title} Collection` : "Collection"}
        description={collection ? `Explore our exclusive ${collection.title.toLowerCase()} collection at Dowslakers. Premium African wear and custom tailoring.` : "Browse our exclusive collections at Dowslakers"}
        keywords={`${collection?.title || 'collection'}, african wear, fashion, dowslakers`}
        canonical={`https://dowslakers.com/collection/${slug}`}
      />
      {/* Hero */}
      <section className="relative h-[70vh] min-h-[500px] bg-black overflow-hidden">
        <img 
          src={collection.hero}
          alt={collection.title}
          className="absolute inset-0 w-full h-full object-cover opacity-70"
        />
        <div className="absolute inset-0 flex items-end">
          <div className="section-container pb-16 lg:pb-24 text-white">
            <p className="text-xs tracking-[0.2em] uppercase text-white/80 mb-4">
              {collection.subtitle}
            </p>
            <h1 className="font-display text-4xl lg:text-6xl font-light mb-4">
              {collection.title}
            </h1>
            <p className="max-w-xl text-white/80 text-sm leading-relaxed">
              {collection.description}
            </p>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="py-16 lg:py-24">
        <div className="section-container">
          <div className="flex items-center justify-between mb-12">
            <p className="text-sm text-muted-foreground">
              {products.length} {products.length === 1 ? 'piece' : 'pieces'}
            </p>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {[...Array(8)].map((_, i) => (
                <div key={i}>
                  <div className="aspect-[3/4] bg-secondary animate-pulse mb-4" />
                  <div className="h-4 bg-secondary animate-pulse mb-2 w-3/4" />
                  <div className="h-4 bg-secondary animate-pulse w-1/2" />
                </div>
              ))}
            </div>
          ) : products.length > 0 ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
              {products.map((product, index) => (
                <div 
                  key={product.id} 
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <ProductCard product={product} onAddToCart={handleAddToCart} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No products in this collection yet.</p>
              <Link 
                to="/shop"
                className="text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
              >
                Browse All Products
              </Link>
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
