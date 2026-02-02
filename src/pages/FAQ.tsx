import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

const faqItems: FAQItem[] = [
  // Custom Tailoring FAQs
  {
    id: 'custom-1',
    category: 'Custom Tailoring',
    question: 'How do I order a custom-made garment?',
    answer: 'Ordering a custom piece is simple! Visit our Custom Sewing page or contact us directly. Our design consultants will discuss your vision, take measurements, and create your perfect bespoke garment. We offer personalized consultations to ensure every detail matches your expectations.'
  },
  {
    id: 'custom-2',
    category: 'Custom Tailoring',
    question: 'What is the turnaround time for custom orders?',
    answer: 'Custom orders typically take 4-8 weeks depending on complexity and fabric availability. Rush orders may be available upon request. We prioritize quality craftsmanship over speed, ensuring each bespoke piece meets our exacting standards.'
  },
  {
    id: 'custom-3',
    category: 'Custom Tailoring',
    question: 'Can I customize an existing design from your collection?',
    answer: 'Absolutely! We encourage customization. You can modify any design in our collection—change fabrics, adjust fits, alter silhouettes, or add personal details. Our master tailors will work with you to bring your vision to life.'
  },
  {
    id: 'custom-4',
    category: 'Custom Tailoring',
    question: 'What fabrics are available for bespoke tailoring?',
    answer: 'We offer access to premium fabrics including Italian wool, African Dutch wax, high-quality cotton blends, silk, and luxury linens. Our fabric consultants will guide you through options based on your style, climate, and occasion.'
  },

  // Products & Collections FAQs
  {
    id: 'product-1',
    category: 'Products & Collections',
    question: 'What is the difference between agbada, kaftan, and other styles?',
    answer: 'Agbada is a traditional three-piece outfit (long outer robe, inner tunic, and trousers) originating from West Africa, perfect for formal occasions. Kaftan is a flowing, luxurious garment ideal for both casual and formal wear. Each style celebrates African heritage while offering modern versatility.'
  },
  {
    id: 'product-2',
    category: 'Products & Collections',
    question: 'What are your size ranges?',
    answer: 'We offer sizes from XS to 3XL for most collections. Visit our Size Guide page for detailed measurements and fit information. For custom pieces, we tailor to any body type and size requirement.'
  },
  {
    id: 'product-3',
    category: 'Products & Collections',
    question: 'Do you offer different fits for different body types?',
    answer: 'Yes! Our ready-to-wear collections are designed with various fits in mind. For custom orders, our tailors create garments specifically fitted to your unique body proportions, ensuring perfect comfort and style.'
  },
  {
    id: 'product-4',
    category: 'Products & Collections',
    question: 'Are your collections unisex?',
    answer: 'While we have collections designed for both men and women, many of our pieces are unisex-friendly. Our custom tailoring service allows you to request any style in your preferred cut and fit, regardless of traditional gender categories.'
  },

  // Quality & Materials FAQs
  {
    id: 'quality-1',
    category: 'Quality & Materials',
    question: 'What materials do you use in your garments?',
    answer: 'We exclusively use premium, ethically-sourced fabrics. This includes high-quality cotton, silk blends, Italian wool, African Dutch wax, and luxury linens. Every material is carefully selected for durability, comfort, and aesthetic appeal.'
  },
  {
    id: 'quality-2',
    category: 'Quality & Materials',
    question: 'Are your products sustainable and eco-friendly?',
    answer: 'Sustainability is core to Dowslakers. We use eco-conscious materials, practice fair labor, and create limited-run collections to minimize waste. We\'re committed to fashion that feels good and does good for the planet and our artisans.'
  },
  {
    id: 'quality-3',
    category: 'Quality & Materials',
    question: 'How do I care for my Dowslakers garment?',
    answer: 'Each piece comes with detailed care instructions. Most of our garments are hand-wash or dry-clean recommended to preserve premium fabrics. Proper care ensures your investment pieces last for years while maintaining their beauty.'
  },
  {
    id: 'quality-4',
    category: 'Quality & Materials',
    question: 'Do you offer warranty or guarantees on quality?',
    answer: 'We stand behind our craftsmanship. All pieces include quality assurance. If there are any defects in materials or workmanship, we offer repairs or replacements. Customer satisfaction is our priority.'
  },

  // Shipping & Returns FAQs
  {
    id: 'shipping-1',
    category: 'Shipping & Returns',
    question: 'What are the shipping costs and delivery times?',
    answer: 'Shipping costs vary by location. Domestic delivery typically takes 5-7 business days. International shipping is available with extended delivery times (10-21 days depending on destination). Free shipping is available on orders over a certain amount.'
  },
  {
    id: 'shipping-2',
    category: 'Shipping & Returns',
    question: 'Do you ship internationally?',
    answer: 'Yes, we ship worldwide! We partner with reliable international couriers to ensure safe delivery of your pieces. International customers can expect delivery within 10-21 business days depending on their location.'
  },
  {
    id: 'shipping-3',
    category: 'Shipping & Returns',
    question: 'What is your return and exchange policy?',
    answer: 'We offer returns and exchanges within 30 days of purchase for unworn items in original condition. Custom-made pieces are non-returnable unless there are defects. Contact our customer service team to initiate returns or exchanges.'
  },
  {
    id: 'shipping-4',
    category: 'Shipping & Returns',
    question: 'How are items packaged for shipping?',
    answer: 'Each piece is carefully packaged in premium materials to ensure it arrives in perfect condition. We use tissue wrapping, branded packaging, and protective boxes. Tracking is provided for all shipments.'
  },

  // Account & Ordering FAQs
  {
    id: 'account-1',
    category: 'Account & Ordering',
    question: 'Do I need an account to make a purchase?',
    answer: 'You can check out as a guest, but creating an account allows you to track orders, save your wishlist, access exclusive member benefits, and receive personalized recommendations.'
  },
  {
    id: 'account-2',
    category: 'Account & Ordering',
    question: 'Can I modify my order after placing it?',
    answer: 'For ready-to-wear items, modifications are possible within 24 hours of order placement. For custom orders, modifications are available during the initial consultation phase before production begins. Contact us immediately if you need changes.'
  },
  {
    id: 'account-3',
    category: 'Account & Ordering',
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, PayPal, and secure payment gateways. For custom orders, we offer flexible payment plans to spread the cost over time.'
  },
  {
    id: 'account-4',
    category: 'Account & Ordering',
    question: 'Is my payment information secure?',
    answer: 'Absolutely. We use industry-standard SSL encryption and PCI-compliant payment processors. Your personal and financial information is completely secure with us.'
  },

  // Brand & Heritage FAQs
  {
    id: 'brand-1',
    category: 'Brand & Heritage',
    question: 'What is the story behind Dowslakers?',
    answer: 'Dowslakers was founded with a vision to bring modern African fashion to the global stage. We blend heritage tailoring techniques with contemporary design, creating pieces that celebrate African culture while embracing global style trends.'
  },
  {
    id: 'brand-2',
    category: 'Brand & Heritage',
    question: 'Where does Dowslakers source its inspiration?',
    answer: 'Our inspiration comes from African heritage, contemporary fashion trends, client individuality, and our commitment to sustainability. Each collection tells a story of cultural pride, craftsmanship, and modern elegance.'
  },
  {
    id: 'brand-3',
    category: 'Brand & Heritage',
    question: 'Who are the master tailors at Dowslakers?',
    answer: 'Our team comprises experienced artisans with decades of combined expertise in traditional African tailoring and contemporary fashion design. Each team member shares our passion for quality and cultural authenticity.'
  },
  {
    id: 'brand-4',
    category: 'Brand & Heritage',
    question: 'Can I collaborate with Dowslakers on custom collections?',
    answer: 'We welcome collaborations and custom projects! Whether for corporate events, special collections, or personalized orders, contact our team to discuss your vision and how we can work together.'
  },
];

const categories = ['All', 'Custom Tailoring', 'Products & Collections', 'Quality & Materials', 'Shipping & Returns', 'Account & Ordering', 'Brand & Heritage'];

export default function FAQ() {
  const [activeCategory, setActiveCategory] = useState('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filteredFAQs = activeCategory === 'All' 
    ? faqItems 
    : faqItems.filter(item => item.category === activeCategory);

  return (
    <Layout>
      <SEO
        title="FAQ - Frequently Asked Questions"
        description="Find answers to common questions about Dowslakers custom tailoring, products, shipping, returns, and our premium African fashion brand. Expert guidance on bespoke garments and collections."
        keywords="FAQ, frequently asked questions, custom tailoring FAQ, African fashion questions, Dowslakers help, product information, agbada FAQ, kaftan sizing, custom sewing questions"
        canonical="https://dowslakers.com/faq"
      />

      {/* Hero */}
      <section className="relative h-[50vh] min-h-[350px] bg-black overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1552664730-d307ca884978?w=1920"
          alt="Help & Support"
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        />
        <motion.div 
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          <div className="text-center text-white">
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-xs tracking-[0.2em] uppercase text-white/80 mb-4"
            >
              Help & Support
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl lg:text-5xl font-light tracking-wide"
            >
              Frequently Asked Questions
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="section-container max-w-4xl">
          {/* Category Filter */}
          <ScrollAnimationWrapper variant="fade">
            <div className="mb-16">
              <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-8 text-center">
                Filter by Category
              </p>
              <div className="flex flex-wrap gap-3 justify-center">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setActiveCategory(category)}
                    className={`px-6 py-2 text-sm tracking-[0.1em] uppercase transition-all ${
                      activeCategory === category
                        ? 'bg-foreground text-background'
                        : 'border border-foreground/30 text-foreground hover:border-foreground'
                    }`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* FAQ Items */}
          <div className="space-y-4">
            {filteredFAQs.map((item, index) => (
              <ScrollAnimationWrapper 
                key={item.id} 
                variant="slide-up" 
                delay={index * 0.05}
              >
                <motion.div
                  className="border border-foreground/20 hover:border-foreground/40 transition-colors"
                >
                  <button
                    onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-secondary/20 transition-colors"
                  >
                    <h3 className="text-left font-medium text-sm lg:text-base">
                      {item.question}
                    </h3>
                    <motion.div
                      animate={{ rotate: expandedId === item.id ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <ChevronDown className="h-5 w-5 flex-shrink-0 ml-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence>
                    {expandedId === item.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 py-4 bg-secondary/30 border-t border-foreground/20 text-muted-foreground text-sm leading-relaxed">
                          {item.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </ScrollAnimationWrapper>
            ))}
          </div>

          {/* Contact Section */}
          <ScrollAnimationWrapper variant="slide-up" delay={0.2}>
            <div className="mt-20 pt-16 border-t border-foreground/20 text-center">
              <h3 className="font-display text-2xl mb-4">Still have questions?</h3>
              <p className="text-muted-foreground mb-8 max-w-2xl mx-auto">
                Our customer service team is here to help. Reach out to us through our contact form or email, and we'll get back to you within 24 hours.
              </p>
              <a
                href="/contact"
                className="inline-block px-8 py-3 border border-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
              >
                Contact Us
              </a>
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>
    </Layout>
  );
}
