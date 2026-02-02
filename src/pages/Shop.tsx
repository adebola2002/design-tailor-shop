import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { fetchProducts, fetchCategories, Product, Category, formatPrice } from '@/lib/supabase-helpers';
import { Search, X, SlidersHorizontal, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

function ProductCard({ product }: { product: Product }) {
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setIsWishlisted(isInWishlist(product.id));
  }, [product.id, isInWishlist]);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isToggling) return;
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

  return (
    <div className="group block">
      <Link to={`/product/${product.id}`} className="block relative">
        <div className="aspect-[3/4] overflow-hidden mb-4 bg-secondary relative">
          <img
            src={product.images?.[0] || '/placeholder.svg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
          />
          <button
            onClick={handleWishlistToggle}
            className="absolute top-4 right-4 w-10 h-10 bg-background/80 backdrop-blur-sm flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 hover:bg-background"
            title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          >
            <Heart
              className={cn(
                'h-5 w-5 transition-all',
                isWishlisted ? 'fill-red-500 text-red-500' : 'text-foreground'
              )}
              strokeWidth={1.5}
            />
          </button>
        </div>
      </Link>
      <div className="space-y-1">
        {product.category && (
          <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
            {product.category.name}
          </p>
        )}
        <h3 className="text-sm font-medium">{product.name}</h3>
        <p className="text-sm text-muted-foreground">{formatPrice(product.price)}</p>
      </div>
    </div>
  );
}

export default function Shop() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [showFilters, setShowFilters] = useState(false);
  
  const { toast } = useToast();

  const loadData = useCallback(async () => {
    try {
      const [productsData, categoriesData] = await Promise.all([
        fetchProducts(),
        fetchCategories()
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error loading shop data:', error);
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Filter and sort products
  const filteredProducts = products
    .filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'all' || product.category?.slug === selectedCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'name':
          return a.name.localeCompare(b.name);
        default:
          return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
    });

  return (
    <Layout>
      <SEO
        title="Shop - Premium African Fashion | Dowslakers"
        description="Shop premium African wear including Agbada, Kaftan, and Urban collections. Handcrafted garments, custom tailoring, and luxury African fashion from Dowslakers."
        keywords="shop African wear, buy agbada online, kaftan dress, urban wear, premium African clothing, Nigerian fashion, custom tailoring, luxury wear, handcrafted garments, African fashion brand"
        canonical="https://dowslakers.com/shop"
      />
      {/* Hero */}
      <section className="pt-32 pb-12 bg-secondary/30">
        <div className="section-container text-center">
          <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4">
            Ready to Wear
          </p>
          <h1 className="font-display text-4xl lg:text-5xl font-light">
            Shop Collection
          </h1>
        </div>
      </section>

      <div className="section-container py-8 lg:py-12">
        {/* Filters Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-8 pb-8 border-b">
          {/* Search */}
          <div className="relative max-w-sm w-full">
            <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-6 border-0 border-b border-border rounded-none focus-visible:ring-0 focus-visible:border-foreground bg-transparent"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-0 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          {/* Desktop Filters */}
          <div className="hidden lg:flex items-center gap-6">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[160px] border-0 border-b border-border rounded-none focus:ring-0 bg-transparent">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[160px] border-0 border-b border-border rounded-none focus:ring-0 bg-transparent">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Mobile Filter Toggle */}
          <button
            className="lg:hidden flex items-center gap-2 text-sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-4 w-4" />
            Filters
          </button>
        </div>

        {/* Mobile Filters */}
        {showFilters && (
          <div className="lg:hidden flex flex-col gap-4 mb-8 p-4 bg-secondary/30 animate-fade-in">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger>
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.slug}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger>
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="name">Name A-Z</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {/* Results Count */}
        <p className="text-sm text-muted-foreground mb-8">
          {filteredProducts.length} {filteredProducts.length === 1 ? 'product' : 'products'}
        </p>

        {/* Products Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {[...Array(8)].map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-secondary animate-pulse mb-4" />
                <div className="h-4 bg-secondary animate-pulse mb-2 w-1/2" />
                <div className="h-4 bg-secondary animate-pulse w-3/4" />
              </div>
            ))}
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {filteredProducts.map((product, index) => (
              <ScrollAnimationWrapper
                key={product.id}
                delay={index * 0.05}
                variant="slide-up"
              >
                <ProductCard product={product} />
              </ScrollAnimationWrapper>
            ))}
          </div>
        ) : (
          <ScrollAnimationWrapper variant="fade">
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No products found</p>
              <button 
                onClick={() => { setSearchTerm(''); setSelectedCategory('all'); }}
                className="text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
              >
                Clear Filters
              </button>
            </div>
          </ScrollAnimationWrapper>
        )}
      </div>
    </Layout>
  );
}
