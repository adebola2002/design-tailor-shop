import { HeroSection } from '@/components/home/HeroSection';
import { CollectionSection } from '@/components/home/CollectionSection';
import { CustomSewingSection } from '@/components/home/CustomSewingSection';
import { FeaturedSection } from '@/components/home/FeaturedSection';
import { NewsletterSection } from '@/components/home/NewsletterSection';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';

const Index = () => {
  return (
    <Layout>
      <SEO
        title="Dowslakers - Premium African Fashion & Custom Tailoring"
        description="Discover Dowslakers - leading African fashion brand offering bespoke kaftans, agbadas, and custom-made garments. Premium fabrics, exceptional craftsmanship, global luxury fashion."
        keywords="African fashion, premium African wear, agbada designer, kaftan collection, custom tailoring, Nigerian fashion brand, bespoke garments, luxury African clothing, handcrafted fashion"
        canonical="https://dowslakers.com/"
      />
      <HeroSection />
      <CollectionSection />
      <FeaturedSection />
      <CustomSewingSection />
      <NewsletterSection />
    </Layout>
  );
};

export default Index;
