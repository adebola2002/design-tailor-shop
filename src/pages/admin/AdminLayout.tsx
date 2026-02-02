import { useState, useEffect } from 'react';
import { useNavigate, Link, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { Button } from '@/components/ui/button';
import { 
  LayoutDashboard, 
  Package, 
  Scissors, 
  ClipboardList, 
  Users, 
  LogOut, 
  Menu, 
  X,
  ChevronRight 
} from 'lucide-react';

const ADMIN_NAV = [
  { path: '/admin', icon: LayoutDashboard, label: 'Dashboard', exact: true },
  { path: '/admin/categories', icon: Package, label: 'Categories' },
  { path: '/admin/products', icon: Package, label: 'Products' },
  { path: '/admin/sewing-styles', icon: Scissors, label: 'Sewing Styles' },
  { path: '/admin/orders', icon: ClipboardList, label: 'Orders' },
  { path: '/admin/users', icon: Users, label: 'Users' },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { signOut } = useAuth();
  const { isUnlocked } = useAdminSession();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isUnlocked) {
      navigate('/admin/unlock');
    }
  }, [isUnlocked, navigate]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActiveRoute = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-secondary/30">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b z-40 flex items-center justify-between px-4">
        <button onClick={() => setSidebarOpen(true)} className="p-2">
          <Menu className="h-6 w-6" />
        </button>
        <Link to="/" className="font-display text-xl font-bold">
          DOWSLAKER<span className="text-sm align-super">s</span>
        </Link>
        <div className="w-10" />
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`fixed top-0 left-0 h-full w-64 bg-background border-r z-50 transform transition-transform duration-300 lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8">
            <Link to="/" className="font-display text-xl font-bold">
              DOWSLAKER<span className="text-sm align-super">s</span>
            </Link>
            <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Admin Badge */}
          <div className="px-3 py-2 bg-primary/10 rounded-lg mb-6">
            <p className="text-sm font-medium">Admin Panel</p>
            <p className="text-xs text-muted-foreground">Administrator</p>
          </div>

          {/* Navigation */}
          <nav className="space-y-1">
            {ADMIN_NAV.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                  isActiveRoute(item.path, item.exact)
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
                {isActiveRoute(item.path, item.exact) && (
                  <ChevronRight className="h-4 w-4 ml-auto" />
                )}
              </Link>
            ))}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-muted-foreground hover:text-destructive"
            onClick={handleSignOut}
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 min-h-screen pt-16 lg:pt-0">
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
