import { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { fetchUserOrders, Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '@/lib/supabase-helpers';
import { Package, Scissors, ShoppingBag, Clock, ArrowRight } from 'lucide-react';

export default function Orders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  const loadOrders = useCallback(async () => {
    if (!user) return;
    try {
      const data = await fetchUserOrders(user.id);
      setOrders(data as unknown as Order[]);
    } catch (error) {
      console.error('Error loading orders:', error);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadOrders();
    }
  }, [user, authLoading, navigate, loadOrders]);

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="section-container py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title="My Orders - Track Your Dowslakers Purchase"
        description="Track your Dowslakers orders and manage purchases. View delivery status, order history, and custom tailoring progress."
        keywords="track orders, order tracking, delivery status, purchase history, my orders, custom order tracking"
        canonical="https://dowslakers.com/orders"
      />
      <div className="section-container py-8">
        <h1 className="font-display text-3xl font-bold mb-8">My Orders</h1>

        {orders.length === 0 ? (
          <div className="text-center py-20">
            <Package className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
            <h2 className="text-xl font-medium mb-4">No orders yet</h2>
            <p className="text-muted-foreground mb-8">Start shopping or place a custom sewing order</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/shop">
                <Button className="gap-2">
                  <ShoppingBag className="h-4 w-4" />
                  Shop Now
                </Button>
              </Link>
              <Link to="/custom-sewing">
                <Button variant="outline" className="gap-2">
                  <Scissors className="h-4 w-4" />
                  Custom Sewing
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-card border rounded-xl p-6 animate-fade-in"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        order.order_type === 'sewing' ? 'order-sewing' : 'order-ready-made'
                      }`}>
                        {order.order_type === 'sewing' ? 'Custom Sewing' : 'Ready-Made'}
                      </span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ORDER_STATUS_COLORS[order.status]}`}>
                        {ORDER_STATUS_LABELS[order.status]}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Order #{order.id.slice(0, 8).toUpperCase()} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>

                  {order.total_amount && (
                    <span className="text-xl font-bold">{formatPrice(order.total_amount)}</span>
                  )}
                </div>

                {/* Order Items Preview */}
                {order.order_items && order.order_items.length > 0 && (
                  <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                    {order.order_items.map((item) => (
                      <div key={item.id} className="flex-shrink-0">
                        <div className="w-16 h-20 bg-secondary rounded-lg overflow-hidden">
                          <img
                            src={item.product?.images?.[0] || '/placeholder.svg'}
                            alt={item.product?.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Sewing Order Details */}
                {order.sewing_order_details && order.sewing_order_details.length > 0 && (
                  <div className="flex gap-3 mb-4">
                    {order.sewing_order_details.map((detail) => (
                      <div key={detail.id} className="flex items-center gap-3 text-sm">
                        <Scissors className="h-4 w-4 text-primary" />
                        <span>{detail.sewing_style?.name || 'Custom Style'}</span>
                        {detail.size_option && (
                          <span className="text-muted-foreground">• Size: {detail.size_option}</span>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                {/* Delivery Info */}
                {order.delivery_days && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: {order.delivery_days} days</span>
                  </div>
                )}

                <div className="mt-4 pt-4 border-t">
                  <Link to={`/orders/${order.id}`}>
                    <Button variant="ghost" size="sm" className="gap-2">
                      View Details
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
