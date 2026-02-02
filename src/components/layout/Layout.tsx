import { useLocation } from 'react-router-dom';
import { Header } from './Header';
import { Footer } from './Footer';
import { WhatsAppButton } from '@/components/ui/whatsapp-button';

interface LayoutProps {
  children: React.ReactNode;
  hideFooter?: boolean;
}

export function Layout({ children, hideFooter = false }: LayoutProps) {
  const location = useLocation();
  const isHome = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className={`flex-1 ${!isHome ? 'pt-16 lg:pt-20' : ''}`}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      <WhatsAppButton />
    </div>
  );
}
