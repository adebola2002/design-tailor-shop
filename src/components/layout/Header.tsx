import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, Search, ShoppingBag, User, Heart, Home, Info, Scissors, Store, Ruler, Phone, BookOpen } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useCart } from '@/contexts/CartContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { cn } from '@/lib/utils';
import { SearchOverlay } from './SearchOverlay';
import logoIcon from '@/assets/logo-icon.png';
import logoText from '@/assets/logo-text.png';

const menuItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'About Dowslakers', href: '/about', icon: Info },
  { name: 'Sew Your Signature Look', href: '/custom-sewing', icon: Scissors },
  { name: 'Shop Collection', href: '/shop', icon: Store },
  { name: 'Size Guide', href: '/size-guide', icon: Ruler },
  { name: 'Contact Us', href: '/contact', icon: Phone },
  { name: 'Blog', href: '/blog', icon: BookOpen },
];

const collections = [
  { name: 'Agbada', href: '/collection/agbada' },
  { name: 'Kaftan', href: '/collection/kaftan' },
  { name: 'Urban', href: '/collection/urban' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const { user, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const { totalItems: wishlistItems } = useWishlist();
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMenuOpen]);

  const headerBg = isHome && !isScrolled 
    ? 'bg-transparent' 
    : 'bg-background/95 backdrop-blur-sm border-b border-border/50';
  
  const textColor = isHome && !isScrolled ? 'text-white' : 'text-foreground';
  const logoFilter = isHome && !isScrolled ? 'brightness-0 invert' : '';

  return (
    <>
      <header className={cn(
        'fixed top-0 w-full z-50 transition-all duration-500',
        headerBg
      )}>
        <nav className="section-container flex items-center justify-between h-16 lg:h-20">
          {/* Left - Menu Toggle */}
          <div className="flex items-center gap-4 w-1/3">
            <button 
              onClick={() => setIsMenuOpen(true)}
              className={cn(
                'flex items-center gap-2 hover:opacity-60 transition-opacity',
                textColor
              )}
            >
              <Menu className="h-5 w-5" strokeWidth={1.5} />
              <span className="hidden lg:inline text-xs tracking-[0.15em] uppercase">Menu</span>
            </button>

            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn('hidden lg:flex items-center gap-2 hover:opacity-60 transition-opacity', textColor)}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
              <span className="text-xs tracking-[0.15em] uppercase">Search</span>
            </button>
          </div>

          {/* Center - Logo */}
          <Link 
            to="/" 
            className="flex-shrink-0 text-center"
          >
            <img 
              src={logoIcon} 
              alt="Dowslakers" 
              className={cn('h-8 lg:h-10', logoFilter)}
            />
          </Link>

          {/* Right - Icons */}
          <div className="flex items-center justify-end gap-3 lg:gap-5 w-1/3">
            <button 
              onClick={() => setIsSearchOpen(true)}
              className={cn('lg:hidden hover:opacity-60 transition-opacity', textColor)}
            >
              <Search className="h-5 w-5" strokeWidth={1.5} />
            </button>
            
            <Link 
              to="/wishlist"
              className={cn('relative hover:opacity-60 transition-opacity hidden sm:block', textColor)}
            >
              <Heart className="h-5 w-5" strokeWidth={1.5} />
              {wishlistItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center">
                  {wishlistItems}
                </span>
              )}
            </Link>
            
            <button 
              onClick={() => navigate(user ? '/orders' : '/auth')}
              className={cn('hover:opacity-60 transition-opacity', textColor)}
            >
              <User className="h-5 w-5" strokeWidth={1.5} />
            </button>
            
            <Link 
              to="/cart" 
              className={cn('relative hover:opacity-60 transition-opacity', textColor)}
            >
              <ShoppingBag className="h-5 w-5" strokeWidth={1.5} />
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-foreground text-background text-[10px] w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>
          </div>
        </nav>
      </header>

      {/* Search Overlay */}
      <SearchOverlay isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />

      {/* Slide-out Menu Overlay */}
      <div 
        className={cn(
          'fixed inset-0 bg-black/60 z-[100] transition-opacity duration-500',
          isMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Slide-out Menu Panel */}
      <div 
        className={cn(
          'fixed top-0 left-0 h-full w-full sm:w-[380px] bg-background z-[101] transition-transform duration-500 ease-out flex flex-col overflow-hidden',
          isMenuOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        {/* Menu Header with Logo */}
        <div className="flex items-center justify-between p-6 border-b">
          <img 
            src={logoIcon} 
            alt="Dowslakers" 
            className="h-8"
          />
          <button 
            onClick={() => setIsMenuOpen(false)}
            className="p-2 hover:opacity-60 transition-opacity"
          >
            <X className="h-5 w-5" strokeWidth={1.5} />
          </button>
        </div>

        {/* Menu Content - Scrollable */}
        <nav className="flex-1 overflow-y-auto p-6 pb-8">
          <ul className="space-y-0.5">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 py-3 px-4 text-sm hover:bg-secondary/50 rounded-lg transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-4 w-4" strokeWidth={1.5} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}

            {/* Collections Section */}
            <li className="pt-4 mt-4 border-t">
              <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground mb-2 px-4 font-light">
                Collections
              </p>
              <ul className="space-y-0.5">
                {collections.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="block py-2 px-8 text-sm hover:bg-secondary/50 rounded-lg transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </li>

            {/* Wishlist Link */}
            <li className="pt-4 mt-4 border-t">
              <Link
                to="/wishlist"
                className="flex items-center gap-3 py-3 px-4 text-sm hover:bg-secondary/50 rounded-lg transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <Heart className="h-4 w-4" strokeWidth={1.5} />
                <span>Wishlist</span>
                {wishlistItems > 0 && (
                  <span className="ml-auto text-xs bg-foreground text-background px-2 py-1 rounded-full">
                    {wishlistItems}
                  </span>
                )}
              </Link>
            </li>

            {/* Admin Link */}
            {isAdmin && (
              <li className="pt-4 mt-4 border-t">
                <Link
                  to="/admin/unlock"
                  className="block py-3 px-4 text-sm text-primary hover:bg-secondary/50 rounded-lg transition-colors font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Admin Dashboard
                </Link>
              </li>
            )}
          </ul>
        </nav>

        {/* Menu Footer */}
        <div className="p-6 border-t bg-secondary/20">
          <Link
            to={user ? '/orders' : '/auth'}
            className="block text-center text-sm tracking-widest font-light py-3 px-4 border border-foreground hover:bg-foreground hover:text-background transition-colors rounded-lg"
            onClick={() => setIsMenuOpen(false)}
          >
            {user ? 'MY ACCOUNT' : 'SIGN IN / REGISTER'}
          </Link>
        </div>
      </div>
    </>
  );
}
