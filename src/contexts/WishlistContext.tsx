import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { useToast } from '@/hooks/use-toast';
 import { supabase } from '@/integrations/supabase/client';

interface WishlistItem {
  id: string;
  product_id: string;
  created_at: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (productId: string) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isInWishlist: (productId: string) => boolean;
  totalItems: number;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadWishlist = useCallback(async () => {
    if (!user) return;
    
    setIsLoading(true);
    try {
       const { data, error } = await supabase
         .from('wishlists')
         .select('id, product_id, created_at')
         .eq('user_id', user.id);
 
       if (error) throw error;
       setItems(data?.map(item => ({
         id: item.id,
         product_id: item.product_id || '',
         created_at: item.created_at
       })) || []);
    } catch (error) {
      console.error('Error loading wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      loadWishlist();
    } else {
      setItems([]);
    }
  }, [user, loadWishlist]);

  async function addToWishlist(productId: string) {
    if (!user) {
      toast({
        title: 'Please sign in',
        description: 'You need to be signed in to add items to your wishlist.',
        variant: 'destructive',
      });
      return;
    }

    try {
       const { data, error } = await supabase
         .from('wishlists')
         .insert({ user_id: user.id, product_id: productId })
         .select()
         .single();
 
       if (error) {
         if (error.code === '23505') {
           throw new Error('duplicate');
         }
         throw error;
      }

       setItems(prev => [...prev, {
         id: data.id,
         product_id: data.product_id || '',
         created_at: data.created_at
       }]);
      toast({
        title: 'Added to wishlist',
        description: 'Item has been added to your wishlist.',
      });
    } catch (error: unknown) {
      if (error instanceof Error && error.message === 'duplicate') {
        toast({
          title: 'Already in wishlist',
          description: 'This item is already in your wishlist.',
        });
      } else {
        console.error('Error adding to wishlist:', error);
        toast({
          title: 'Error',
          description: 'Failed to add item to wishlist.',
          variant: 'destructive',
        });
      }
    }
  }

  async function removeFromWishlist(productId: string) {
    if (!user) return;

    try {
       const { error } = await supabase
         .from('wishlists')
         .delete()
         .eq('user_id', user.id)
         .eq('product_id', productId);
 
       if (error) throw error;

      setItems(prev => prev.filter(item => item.product_id !== productId));
      toast({
        title: 'Removed from wishlist',
        description: 'Item has been removed from your wishlist.',
      });
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast({
        title: 'Error',
        description: 'Failed to remove item from wishlist.',
        variant: 'destructive',
      });
    }
  }

  function isInWishlist(productId: string) {
    return items.some(item => item.product_id === productId);
  }

  return (
    <WishlistContext.Provider
      value={{
        items,
        isLoading,
        addToWishlist,
        removeFromWishlist,
        isInWishlist,
        totalItems: items.length,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (context === undefined) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
}
