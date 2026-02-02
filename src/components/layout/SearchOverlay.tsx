import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatPrice } from '@/lib/supabase-helpers';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface SearchOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

interface SearchResult {
  id: string;
  name: string;
  price: number;
  images: string[];
  type: 'product' | 'style';
}

export function SearchOverlay({ isOpen, onClose }: SearchOverlayProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
    if (!isOpen) {
      setQuery('');
      setResults([]);
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length < 2) {
        setResults([]);
        return;
      }

      setIsSearching(true);
      try {
        const token = localStorage.getItem('token');
        const [productsRes, stylesRes] = await Promise.all([
          fetch(`${API_URL}/products?search=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token || ''}` },
          }),
          fetch(`${API_URL}/sewing-styles?search=${encodeURIComponent(query)}`, {
            headers: { Authorization: `Bearer ${token || ''}` },
          }),
        ]);

        const productsData = await productsRes.json();
        const stylesData = await stylesRes.json();

        const products: SearchResult[] = (productsData || []).slice(0, 5).map((p: SearchResult) => ({
          ...p,
          type: 'product' as const,
        }));

        const styles: SearchResult[] = (stylesData || []).slice(0, 5).map((s: SearchResult) => ({
          id: s.id,
          name: s.name,
          price: s.price || 0,
          images: s.images,
          type: 'style' as const,
        }));

        setResults([...products, ...styles]);
      } catch (error) {
        console.error('Search error:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const handleResultClick = (result: SearchResult) => {
    if (result.type === 'product') {
      navigate(`/product/${result.id}`);
    } else {
      navigate('/custom-sewing');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/60 z-[200]"
            onClick={onClose}
          />

          {/* Search Panel */}
          <motion.div
            initial={{ y: '-100%' }}
            animate={{ y: 0 }}
            exit={{ y: '-100%' }}
            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1] }}
            className="fixed top-0 left-0 right-0 bg-background z-[201] max-h-[80vh] overflow-y-auto"
          >
            <div className="section-container py-8">
              {/* Close Button */}
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:opacity-60 transition-opacity"
              >
                <X className="h-5 w-5" strokeWidth={1.5} />
              </button>

              {/* Search Input */}
              <div className="max-w-2xl mx-auto">
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search products, styles..."
                    className="w-full pl-10 pr-4 py-4 text-lg bg-transparent border-b border-border focus:border-foreground focus:outline-none transition-colors placeholder:text-muted-foreground"
                  />
                </div>

                {/* Results */}
                <div className="mt-8">
                  {isSearching && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      Searching...
                    </p>
                  )}

                  {!isSearching && query.length >= 2 && results.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-8">
                      No results found for "{query}"
                    </p>
                  )}

                  {results.length > 0 && (
                    <div className="space-y-4">
                      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                        {results.length} Result{results.length !== 1 ? 's' : ''}
                      </p>
                      <div className="grid gap-4">
                        {results.map((result) => (
                          <motion.button
                            key={`${result.type}-${result.id}`}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            onClick={() => handleResultClick(result)}
                            className="flex items-center gap-4 p-4 hover:bg-secondary/50 transition-colors text-left w-full"
                          >
                            <div className="w-16 h-16 bg-secondary overflow-hidden flex-shrink-0">
                              {result.images?.[0] && (
                                <img
                                  src={result.images[0]}
                                  alt={result.name}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="font-medium">{result.name}</p>
                              <p className="text-sm text-muted-foreground">
                                {result.type === 'product' ? 'Ready to Wear' : 'Custom Sewing'} • {formatPrice(result.price)}
                              </p>
                            </div>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Quick Links */}
                  {query.length < 2 && (
                    <div className="space-y-6">
                      <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                        Popular Searches
                      </p>
                      <div className="flex flex-wrap gap-3">
                        {['Agbada', 'Kaftan', 'Urban', 'Custom Sewing'].map((term) => (
                          <button
                            key={term}
                            onClick={() => setQuery(term)}
                            className="px-4 py-2 border border-border hover:border-foreground transition-colors text-sm"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
