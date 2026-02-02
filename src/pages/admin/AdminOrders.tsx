import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { api } from '@/services/api';
import { formatPrice } from '@/lib/supabase-helpers';
import { Eye, Package, CreditCard } from 'lucide-react';

interface OrderItem {
  product_id: string;
  quantity: number;
  size?: string;
  price: number;
}

interface ShippingAddress {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone?: string;
  [key: string]: string | undefined;
}

interface Order {
  id: string;
  user_id: string;
  items: OrderItem[];
  total_amount: number;
  status: string;
  payment_ref: string;
  shipping_address: ShippingAddress | null;
  created_at: string;
  updated_at: string;
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  // Mock admin token for unlocked sessions
  const mockToken = 'admin-token-mock';

  const loadOrders = useCallback(async () => {
    try {
      setError(null);
      console.log('Loading orders, admin unlocked:', isUnlocked);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const data = await api.getOrders(mockToken);
      setOrders(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error loading orders:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked, mockToken]);

  useEffect(() => {
    if (isUnlocked) {
      loadOrders();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadOrders]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'shipped':
        return 'bg-blue-100 text-blue-800';
      case 'delivered':
        return 'bg-purple-100 text-purple-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
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
                <div className="flex items-start justify-between">
                  <div className="flex gap-4">
                    <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                      <Package className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium">Order #{order.id.slice(-8)}</h3>
                        <Badge className={getStatusColor(order.status)}>
                          {order.status}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground space-y-1">
                        <p>{order.items?.length || 0} items • {formatPrice(order.total_amount)}</p>
                        <p>Payment: {order.payment_ref || 'N/A'}</p>
                        <p>Ordered: {new Date(order.created_at).toLocaleDateString()}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-4 w-4" />
                    </Button>
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
