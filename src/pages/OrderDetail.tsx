import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { Order, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS, formatPrice } from '@/lib/supabase-helpers';
import { ArrowLeft, Package, Scissors, Clock, MapPin, Phone, Truck, Store } from 'lucide-react';

export default function OrderDetail() {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
      return;
    }

    if (user && id) {
      loadOrder();
    }
  }, [user, authLoading, id]);

  const loadOrder = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*, product:products(*)),
          sewing_order_details(*, sewing_style:sewing_styles(*))
        `)
        .eq('id', id!)
        .eq('user_id', user!.id)
        .maybeSingle();

      if (error) throw error;
      setOrder(data as unknown as Order);
    } catch (error) {
      console.error('Error loading order:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading || isLoading) {
    return (
      <Layout>
        <div className="section-container py-20 flex justify-center">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (!order) {
    return (
      <Layout>
        <div className="section-container py-20 text-center">
          <Package className="h-20 w-20 mx-auto text-muted-foreground/50 mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Order Not Found</h1>
          <p className="text-muted-foreground mb-8">This order doesn't exist or you don't have access to it.</p>
          <Link to="/orders">
            <Button className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Orders
            </Button>
          </Link>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`Order #${order.id.slice(0, 8).toUpperCase()} - Dowslakers`}
        description="View your order details and tracking information."
      />

      <div className="section-container py-8 max-w-4xl mx-auto">
        <Button variant="ghost" onClick={() => navigate('/orders')} className="mb-6 gap-2">
          <ArrowLeft className="h-4 w-4" />
          Back to Orders
        </Button>

        {/* Order Header */}
        <div className="bg-card border rounded-xl p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <h1 className="font-display text-2xl font-bold mb-1">
                Order #{order.id.slice(0, 8).toUpperCase()}
              </h1>
              <p className="text-sm text-muted-foreground">
                Placed on {new Date(order.created_at).toLocaleDateString('en-NG', { 
                  year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' 
                })}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                order.order_type === 'sewing' ? 'order-sewing' : 'order-ready-made'
              }`}>
                {order.order_type === 'sewing' ? 'Custom Sewing' : 'Ready-Made'}
              </span>
              <span className={`px-3 py-1 rounded-full text-xs font-medium border ${ORDER_STATUS_COLORS[order.status]}`}>
                {ORDER_STATUS_LABELS[order.status]}
              </span>
            </div>
          </div>

          {order.total_amount && (
            <div className="text-2xl font-bold">{formatPrice(order.total_amount)}</div>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Order Items */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-medium text-lg mb-4">
              {order.order_type === 'sewing' ? 'Sewing Details' : 'Order Items'}
            </h2>

            {order.order_items && order.order_items.length > 0 && (
              <div className="space-y-4">
                {order.order_items.map((item) => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-20 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                      <img
                        src={item.product?.images?.[0] || '/placeholder.svg'}
                        alt={item.product?.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{item.product?.name || 'Product'}</p>
                      <p className="text-sm text-muted-foreground">
                        {item.size && `Size: ${item.size}`} · Qty: {item.quantity}
                      </p>
                      <p className="text-sm font-medium mt-1">{formatPrice(item.price * item.quantity)}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {order.sewing_order_details && order.sewing_order_details.length > 0 && (
              <div className="space-y-4">
                {order.sewing_order_details.map((detail) => (
                  <div key={detail.id} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Scissors className="h-4 w-4 text-primary" />
                      <span className="font-medium">{detail.sewing_style?.name || 'Custom Style'}</span>
                    </div>
                    {detail.size_option && (
                      <p className="text-sm text-muted-foreground">Size: {detail.size_option}</p>
                    )}
                    {detail.special_instructions && (
                      <p className="text-sm text-muted-foreground">Notes: {detail.special_instructions}</p>
                    )}
                    {detail.measurements && typeof detail.measurements === 'object' && (
                      <div className="text-sm text-muted-foreground">
                        <p className="font-medium text-foreground mb-1">Measurements:</p>
                        {Object.entries(detail.measurements as Record<string, string>).map(([key, val]) => (
                          <p key={key} className="capitalize">{key.replace(/_/g, ' ')}: {val}</p>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Delivery Info */}
          <div className="bg-card border rounded-xl p-6">
            <h2 className="font-medium text-lg mb-4">Delivery Information</h2>

            <div className="space-y-4">
              <div className="flex items-start gap-3">
                {order.delivery_method === 'pickup' ? (
                  <Store className="h-5 w-5 text-muted-foreground mt-0.5" />
                ) : (
                  <Truck className="h-5 w-5 text-muted-foreground mt-0.5" />
                )}
                <div>
                  <p className="font-medium">
                    {order.delivery_method === 'pickup' ? 'Store Pickup' : 'Home Delivery'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {order.delivery_method === 'pickup' ? 'Pick up from our store in Lagos' : 'Delivered to your address'}
                  </p>
                </div>
              </div>

              {order.delivery_address && (
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_address}</p>
                  </div>
                </div>
              )}

              {order.delivery_contact && (
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Contact</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_contact}</p>
                  </div>
                </div>
              )}

              {order.delivery_days && (
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">{order.delivery_days} days</p>
                  </div>
                </div>
              )}

              {order.notes && (
                <div className="pt-4 border-t">
                  <p className="font-medium mb-1">Order Notes</p>
                  <p className="text-sm text-muted-foreground">{order.notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
