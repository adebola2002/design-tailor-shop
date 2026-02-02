import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { supabase } from '@/integrations/supabase/client';
import { formatPrice, ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '@/lib/supabase-helpers';
import { Package, Scissors } from 'lucide-react';

interface OrderItem {
  id: string;
  product_id: string | null;
  quantity: number;
  size: string | null;
  price: number;
  product?: {
    name: string;
    images: string[] | null;
  } | null;
}

interface SewingOrderDetail {
  id: string;
  sewing_style_id: string | null;
  size_option: string | null;
  special_instructions: string | null;
  sewing_style?: {
    name: string;
    images: string[] | null;
  } | null;
}

interface Order {
  id: string;
  user_id: string;
  order_type: string;
  status: string;
  total_amount: number | null;
  notes: string | null;
  delivery_method: string | null;
  delivery_address: string | null;
  delivery_contact: string | null;
  delivery_days: number | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
  sewing_order_details?: SewingOrderDetail[];
}

const ORDER_STATUSES = [
  'pending',
  'processing',
  'in_progress',
  'ready',
  'shipped',
  'delivered',
  'cancelled',
];

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  const loadOrders = useCallback(async () => {
    try {
      setError(null);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items(*, product:products(name, images)),
          sewing_order_details(*, sewing_style:sewing_styles(name, images))
        `)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setOrders((data || []) as unknown as Order[]);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error loading orders:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      loadOrders();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadOrders]);

  const updateOrderStatus = async (orderId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId);

      if (error) throw error;

      toast({ title: 'Order status updated' });
      loadOrders();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to update order';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="py-6">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Orders</h3>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button onClick={loadOrders} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Orders</h1>
          <p className="text-muted-foreground">Manage customer orders</p>
        </div>
      </div>

      {orders.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Package className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No orders yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {orders.map((order) => (
            <Card key={order.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center flex-shrink-0">
                    {order.order_type === 'sewing' ? (
                      <Scissors className="h-8 w-8 text-muted-foreground" />
                    ) : (
                      <Package className="h-8 w-8 text-muted-foreground" />
                    )}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                      <h3 className="font-medium">Order #{order.id.slice(-8).toUpperCase()}</h3>
                      <Badge className={ORDER_STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-800'}>
                        {ORDER_STATUS_LABELS[order.status] || order.status}
                      </Badge>
                      <Badge variant="outline">
                        {order.order_type === 'sewing' ? 'Custom Sewing' : 'Ready-Made'}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>{order.order_items?.length || 0} items • {formatPrice(order.total_amount || 0)}</p>
                      <p>Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>

                    {/* Order Items Preview */}
                    {order.order_items && order.order_items.length > 0 && (
                      <div className="flex gap-2 mt-3">
                        {order.order_items.slice(0, 4).map((item) => (
                          <div key={item.id} className="w-12 h-12 bg-secondary rounded overflow-hidden">
                            <img
                              src={item.product?.images?.[0] || '/placeholder.svg'}
                              alt={item.product?.name || 'Product'}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                        {order.order_items.length > 4 && (
                          <div className="w-12 h-12 bg-secondary rounded flex items-center justify-center text-xs text-muted-foreground">
                            +{order.order_items.length - 4}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Sewing Details */}
                    {order.sewing_order_details && order.sewing_order_details.length > 0 && (
                      <div className="mt-3 text-sm">
                        {order.sewing_order_details.map((detail) => (
                          <div key={detail.id} className="flex items-center gap-2">
                            <Scissors className="h-4 w-4 text-primary" />
                            <span>{detail.sewing_style?.name || 'Custom Style'}</span>
                            {detail.size_option && (
                              <span className="text-muted-foreground">• Size: {detail.size_option}</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 sm:items-end">
                    <Select
                      value={order.status}
                      onValueChange={(value) => updateOrderStatus(order.id, value)}
                    >
                      <SelectTrigger className="w-[160px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ORDER_STATUSES.map((status) => (
                          <SelectItem key={status} value={status}>
                            {ORDER_STATUS_LABELS[status] || status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
