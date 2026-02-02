import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Package, Scissors, ClipboardList, Users, TrendingUp, DollarSign, Video, Upload } from 'lucide-react';
import { formatPrice } from '@/lib/supabase-helpers';
import { useToast } from '@/hooks/use-toast';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

interface DashboardStats {
  totalProducts: number;
  totalStyles: number;
  totalOrders: number;
  totalUsers: number;
  pendingOrders: number;
  totalRevenue: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    totalProducts: 0,
    totalStyles: 0,
    totalOrders: 0,
    totalUsers: 0,
    pendingOrders: 0,
    totalRevenue: 0,
  });
  const [recentOrders, setRecentOrders] = useState<{ id: string; status: string; total_amount: number }[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  const { toast } = useToast();
  const [newAdminPassword, setNewAdminPassword] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  async function loadStats() {
    try {
      const token = localStorage.getItem('token');
      const [productsResponse, stylesResponse, ordersResponse, usersResponse] = await Promise.all([
        fetch(`${API_URL}/products`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/sewing-styles`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      const products = await productsResponse.json();
      const styles = await stylesResponse.json();
      const orders = await ordersResponse.json();
      const users = await usersResponse.json();

      const pendingCount = orders?.filter((o: { status: string }) => o.status === 'pending').length || 0;
      const revenue = orders?.reduce((sum: number, o: { total_amount?: number }) => sum + (o.total_amount || 0), 0) || 0;

      setStats({
        totalProducts: products?.length || 0,
        totalStyles: styles?.length || 0,
        totalOrders: orders?.length || 0,
        totalUsers: users?.length || 0,
        pendingOrders: pendingCount,
        totalRevenue: revenue,
      });

      setRecentOrders((orders || []).slice(0, 5));
    } catch (error) {
      console.error('Error loading stats:', error);
    } finally {
      setIsLoading(false);
    }
  }

  const statCards = [
    { title: 'Total Products', value: stats.totalProducts, icon: Package, color: 'bg-blue-500' },
    { title: 'Sewing Styles', value: stats.totalStyles, icon: Scissors, color: 'bg-purple-500' },
    { title: 'Total Orders', value: stats.totalOrders, icon: ClipboardList, color: 'bg-green-500' },
    { title: 'Pending Orders', value: stats.pendingOrders, icon: TrendingUp, color: 'bg-orange-500' },
    { title: 'Total Users', value: stats.totalUsers, icon: Users, color: 'bg-pink-500' },
    { title: 'Total Revenue', value: formatPrice(stats.totalRevenue), icon: DollarSign, color: 'bg-emerald-500' },
  ];

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-display font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome to your admin dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {statCards.map((stat, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{stat.title}</CardTitle>
              <div className={`p-2 rounded-lg ${stat.color}`}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>


      {/* Admin Unlock Password Settings (local) */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">Admin Unlock Password</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">The universal local unlock password is <strong>dowslakers12</strong>. Administrators can set a custom local password which will be stored in the browser's localStorage for this device.</p>
          <div className="flex gap-2">
            <Input
              placeholder="New local admin password"
              value={newAdminPassword}
              onChange={(e) => setNewAdminPassword(e.target.value)}
            />
            <Button onClick={async () => {
              if (!newAdminPassword) { toast({ title: 'Missing', description: 'Enter a password', variant: 'destructive' }); return; }
              setIsSavingPassword(true);
              try {
                localStorage.setItem('admin_unlock_password', newAdminPassword);
                toast({ title: 'Saved', description: 'Local admin password updated for this device.' });
                setNewAdminPassword('');
              } finally {
                setIsSavingPassword(false);
              }
            }} disabled={isSavingPassword}>{isSavingPassword ? 'Saving...' : 'Save'}</Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Orders */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Orders</CardTitle>
        </CardHeader>
        <CardContent>
          {recentOrders.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No orders yet</p>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-secondary/50 rounded-lg">
                  <div>
                    <p className="font-medium">#{order.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-sm text-muted-foreground">
                      {order.order_type === 'sewing' ? 'Custom Sewing' : 'Ready-Made'} • {new Date(order.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium">{order.total_amount ? formatPrice(order.total_amount) : 'TBD'}</p>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
