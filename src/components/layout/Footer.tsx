import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, Instagram, Facebook, MessageCircle } from 'lucide-react';

const footerLinks = {
  shop: [
    { name: 'All Products', href: '/shop' },
    { name: 'Agbada Collection', href: '/collection/agbada' },
    { name: 'Kaftan Collection', href: '/collection/kaftan' },
    { name: 'Urban Wears', href: '/collection/urban-wears' },
  ],
  services: [
    { name: 'Made to Measure', href: '/custom-sewing' },
    { name: 'Size Guide', href: '/size-guide' },
    { name: 'FAQ', href: '/faq' },
    { name: 'Track Order', href: '/orders' },
  ],
  company: [
    { name: 'About Us', href: '/about' },
    { name: 'Contact', href: '/contact' },
    { name: 'Shipping', href: '/shipping' },
    { name: 'Returns', href: '/returns' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-background border-t">
      {/* Main Footer */}
      <div className="section-container py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8">
          {/* Brand */}
          <div className="lg:col-span-2 space-y-6">
            <Link to="/" className="brand-logo text-lg">
              DOWSLAKERS
            </Link>
            <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
              Celebrating the art of Nigerian fashion. From traditional 
              craftsmanship to contemporary elegance, we redefine luxury 
              for the modern world.
            </p>
            <div className="space-y-3 text-sm">
              <a 
                href="mailto:dowslakers@gmail.com" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="h-4 w-4" />
                dowslakers@gmail.com
              </a>
              <a 
                href="tel:+2348130006078" 
                className="flex items-center gap-3 text-muted-foreground hover:text-foreground transition-colors"
              >
                <Phone className="h-4 w-4" />
                +234 813 000 6078
              </a>
              <div className="flex items-start gap-3 text-muted-foreground">
                <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
                <span>Lagos, Nigeria</span>
              </div>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-label mb-6">Shop</h4>
            <ul className="space-y-3">
              {footerLinks.shop.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-label mb-6">Services</h4>
            <ul className="space-y-3">
              {footerLinks.services.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-label mb-6">Company</h4>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href}
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Social & Legal */}
      <div className="border-t">
        <div className="section-container py-8 flex flex-col lg:flex-row items-center justify-between gap-6">
          {/* Social Icons */}
          <div className="flex items-center gap-6">
            <a 
              href="https://instagram.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Instagram className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a 
              href="https://facebook.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <Facebook className="h-5 w-5" strokeWidth={1.5} />
            </a>
            <a 
              href="https://wa.me/+2348130006078" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={1.5} />
            </a>
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Dowslakers. All rights reserved.
          </p>

          {/* Legal Links */}
          <div className="flex items-center gap-6 text-xs text-muted-foreground">
            <Link to="/privacy" className="hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
