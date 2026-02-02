import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { formatPrice } from '@/lib/supabase-helpers';
import { ShoppingBag, Minus, Plus, Trash2, ArrowRight } from 'lucide-react';

export default function Cart() {
  const { items, updateQuantity, removeItem, totalAmount, totalItems, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleCheckout = () => {
    if (!user) {
      navigate('/auth');
    } else {
      navigate('/checkout');
    }
  };

  if (items.length === 0) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <ShoppingBag className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Your Cart is Empty</h1>
          <p className="text-muted-foreground mb-8">Looks like you haven't added anything yet</p>
          <Link to="/shop">
            <Button size="lg" className="gap-2">
              <ShoppingBag className="h-5 w-5" />
              Continue Shopping
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="Shopping Cart - Dowslakers"
        description="Review and checkout your selected African wear items from Dowslakers. Secure payment, free shipping on orders, custom tailoring options available."
        keywords="shopping cart, checkout, purchase, African fashion, secure payment, order summary"
        canonical="https://dowslakers.com/cart"
      />
      <div className="section-container py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Shopping Cart</h1>
          <span className="text-muted-foreground">{totalItems} items</span>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={`${item.product.id}-${item.size}`}
                className="flex gap-4 bg-card border rounded-xl p-4 animate-fade-in"
              >
                {/* Image */}
                <div className="w-24 h-32 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                  <img
                    src={item.product.images?.[0] || '/placeholder.svg'}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between gap-2">
                    <div>
                      <Link to={`/product/${item.product.id}`} className="font-medium hover:underline line-clamp-1">
                        {item.product.name}
                      </Link>
                      <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id, item.size)}
                      className="text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between mt-4">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Minus className="h-3 w-3" />
                      </button>
                      <span className="w-8 text-center font-medium">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center hover:bg-secondary transition-colors"
                      >
                        <Plus className="h-3 w-3" />
                      </button>
                    </div>

                    <span className="font-bold">{formatPrice(item.product.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}

            <Button variant="ghost" onClick={clearCart} className="text-destructive hover:text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear Cart
            </Button>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-card border rounded-xl p-6 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>

              <div className="border-t my-6" />

              <div className="flex justify-between text-lg font-bold mb-6">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>

              <Button onClick={handleCheckout} className="w-full gap-2" size="lg">
                {user ? 'Proceed to Checkout' : 'Login to Checkout'}
                <ArrowRight className="h-4 w-4" />
              </Button>

              <Link to="/shop" className="block text-center text-sm text-muted-foreground mt-4 hover:text-foreground">
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
