import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { SEO } from "@/components/SEO";
import { Home, Search } from "lucide-react";
import { motion } from "framer-motion";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
    document.title = "404 - Page Not Found | Dowslakers";
  }, [location.pathname]);

  return (
    <Layout hideFooter>
      <SEO
        title="404 - Page Not Found"
        description="The page you're looking for doesn't exist. Explore our premium African wear collection at Dowslakers."
        keywords="404, page not found, error, dowslakers"
      />

      <div className="min-h-[calc(100vh-8rem)] flex items-center justify-center px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-md"
        >
          {/* 404 Illustration */}
          <div className="mb-8">
            <motion.div
              animate={{ y: [0, -20, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="text-9xl font-light text-foreground/30 font-display"
            >
              404
            </motion.div>
          </div>

          {/* Heading */}
          <h1 className="font-display text-4xl lg:text-5xl font-light mb-4">
            Oops!
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-2">
            This page seems to have wandered off...
          </p>
          <p className="text-sm text-muted-foreground mb-8">
            The page you're looking for doesn't exist or has been moved. Let's get you back to exploring our premium African wear collection.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/">
              <Button size="lg" className="w-full sm:w-auto gap-2">
                <Home className="h-4 w-4" />
                Back to Home
              </Button>
            </Link>
            <Link to="/shop">
              <Button size="lg" variant="outline" className="w-full sm:w-auto gap-2">
                <Search className="h-4 w-4" />
                Browse Shop
              </Button>
            </Link>
          </div>

          {/* Quick Links */}
          <div className="mt-12 pt-8 border-t">
            <p className="text-xs text-muted-foreground uppercase tracking-widest mb-4">
              Quick Links
            </p>
            <div className="grid grid-cols-2 gap-2">
              <Link to="/shop" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Shop Collection
              </Link>
              <Link to="/about" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                About Us
              </Link>
              <Link to="/custom-sewing" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Custom Sewing
              </Link>
              <Link to="/contact" className="text-sm text-foreground/70 hover:text-foreground transition-colors">
                Contact
              </Link>
            </div>
          </div>

          {/* Help Text */}
          <p className="text-xs text-muted-foreground mt-8">
            Need help? <Link to="/contact" className="text-foreground hover:underline">Contact our support team</Link>
          </p>
        </motion.div>
      </div>
    </Layout>
  );
};

export default NotFound;
