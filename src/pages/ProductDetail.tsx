import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { fetchProduct, Product, formatPrice } from '@/lib/supabase-helpers';
import { ChevronLeft, ChevronRight, Minus, Plus, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { addItem } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const loadProduct = useCallback(async () => {
    if (!id) return;
    try {
      const data = await fetchProduct(id);
      setProduct(data);
      if (data.sizes && data.sizes.length > 0) {
        setSelectedSize(data.sizes[0]);
      }
    } catch (error) {
      console.error('Error loading product:', error);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      loadProduct();
    }
  }, [id, loadProduct]);

  useEffect(() => {
    if (product) {
      setIsWishlisted(isInWishlist(product.id));
    }
  }, [product, isInWishlist]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      toast({
        title: "Select a Size",
        description: "Please select a size before adding to cart",
        variant: "destructive",
      });
      return;
    }
    
    for (let i = 0; i < quantity; i++) {
      addItem(product, selectedSize);
    }
    
    toast({
      title: "Added to Cart",
      description: `${product.name} (${selectedSize}) x${quantity} added to your cart`,
    });
  };

  const handleWishlistToggle = async () => {
    if (!product || isToggling) return;
    setIsToggling(true);

    try {
      if (isWishlisted) {
        await removeFromWishlist(product.id);
        setIsWishlisted(false);
        toast({
          title: "Removed from Wishlist",
          description: `${product.name} has been removed from your wishlist`,
        });
      } else {
        await addToWishlist(product.id);
        setIsWishlisted(true);
        toast({
          title: "Added to Wishlist",
          description: `${product.name} has been added to your wishlist`,
        });
      }
    } catch (error) {
      console.error('Error toggling wishlist:', error);
      toast({
        title: "Error",
        description: "Failed to update wishlist",
        variant: "destructive",
      });
    } finally {
      setIsToggling(false);
    }
  };

  const images = product?.images || ['/placeholder.svg'];

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="pt-24 pb-16">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-12">
              <div className="aspect-[3/4] bg-secondary animate-pulse" />
              <div className="space-y-6">
                <div className="h-8 bg-secondary animate-pulse w-3/4" />
                <div className="h-6 bg-secondary animate-pulse w-1/4" />
                <div className="h-20 bg-secondary animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!product) {
    return (
      <Layout>
        <div className="pt-32 pb-16 text-center">
          <h1 className="font-display text-3xl mb-4">Product Not Found</h1>
          <Link 
            to="/shop"
            className="text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
          >
            Back to Shop
          </Link>
        </div>
      </Layout>
    );
  }

  const sizes = product.sizes || ['S', 'M', 'L', 'XL'];

  return (
    <Layout>
      <SEO
        title={product.name}
        description={`${product.name} - ${product.description}. Premium African wear from Dowslakers.`}
        keywords={`${product.name}, ${product.category}, african wear, fashion, dowslakers`}
        canonical={`https://dowslakers.com/product/${product.id}`}
      />
      <div className="pt-24 pb-16 lg:pb-24">
        <div className="section-container">
          {/* Breadcrumb */}
          <ScrollAnimationWrapper variant="fade" duration={0.4}>
            <nav className="mb-8">
              <ol className="flex items-center gap-2 text-sm text-muted-foreground">
                <li><Link to="/" className="hover:text-foreground">Home</Link></li>
                <li>/</li>
                <li><Link to="/shop" className="hover:text-foreground">Shop</Link></li>
                <li>/</li>
                <li className="text-foreground">{product.name}</li>
              </ol>
            </nav>
          </ScrollAnimationWrapper>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-16">
            {/* Image Gallery */}
            <ScrollAnimationWrapper variant="slide-left" duration={0.6}>
              <div className="space-y-4">
                {/* Main Image */}
                <div className="relative aspect-[3/4] bg-secondary overflow-hidden group">
                  <img
                    src={images[selectedImageIndex]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                  
                  {images.length > 1 && (
                    <>
                      <button 
                        onClick={prevImage}
                        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronLeft className="h-5 w-5" />
                      </button>
                      <button 
                        onClick={nextImage}
                        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-background/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <ChevronRight className="h-5 w-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnails */}
                {images.length > 1 && (
                  <div className="flex gap-2 overflow-x-auto pb-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => setSelectedImageIndex(index)}
                        className={cn(
                          'flex-shrink-0 w-20 h-24 overflow-hidden border-2 transition-colors',
                          selectedImageIndex === index ? 'border-foreground' : 'border-transparent'
                        )}
                      >
                        <img
                          src={img}
                          alt={`${product.name} ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </ScrollAnimationWrapper>

            {/* Product Info */}
            <ScrollAnimationWrapper variant="slide-right" duration={0.6} delay={0.1}>
              <div className="lg:py-8">
                {product.category && (
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-4">
                    {product.category.name}
                  </p>
                )}
              
              <h1 className="font-display text-3xl lg:text-4xl font-light mb-4">
                {product.name}
              </h1>
              
              <p className="text-xl mb-8">
                {formatPrice(product.price)}
              </p>

              {product.description && (
                <p className="text-muted-foreground mb-8 leading-relaxed">
                  {product.description}
                </p>
              )}

              {/* Size Selection */}
              <div className="mb-8">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-medium">Select Size</span>
                  <Link 
                    to="/size-guide"
                    className="text-xs text-muted-foreground hover:text-foreground underline"
                  >
                    Size Guide
                  </Link>
                </div>
                <div className="flex flex-wrap gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={cn(
                        'min-w-[48px] h-12 px-4 border transition-colors',
                        selectedSize === size 
                          ? 'border-foreground bg-foreground text-background' 
                          : 'border-border hover:border-foreground'
                      )}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity */}
              <div className="mb-8">
                <span className="text-sm font-medium block mb-4">Quantity</span>
                <div className="flex items-center border border-border w-fit">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-12 text-center">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-12 h-12 flex items-center justify-center hover:bg-secondary transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Add to Cart */}
              <Button 
                onClick={handleAddToCart}
                className="w-full h-14 text-sm tracking-[0.1em] uppercase"
              >
                Add to Cart
              </Button>

              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={isToggling}
                className={cn(
                  'w-full h-14 mt-4 border-2 flex items-center justify-center gap-2 transition-all',
                  isWishlisted
                    ? 'border-red-500 bg-red-50 hover:bg-red-100'
                    : 'border-border hover:border-foreground'
                )}
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-all',
                    isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
                  )}
                  strokeWidth={1.5}
                />
                <span className="text-sm tracking-[0.1em] uppercase">
                  {isWishlisted ? 'Saved' : 'Save to Wishlist'}
                </span>
              </button>

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t space-y-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Delivery</span>
                  <span>3-5 Business Days</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Returns</span>
                  <span>Free 30-Day Returns</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Care</span>
                  <span>Dry Clean Only</span>
                </div>
              </div>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </div>
    </Layout>
  );
}
