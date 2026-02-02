import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { motion } from 'framer-motion';

export default function About() {
  return (
    <Layout>
      <SEO
        title="About Us - Dowslakers Premium African Fashion"
        description="Discover Dowslakers - redefining modern African luxury fashion with bespoke tailoring, premium fabrics, and exceptional craftsmanship. Meet our CEO and learn about our vision for global African fashion excellence."
        keywords="about Dowslakers, African fashion brand, custom tailoring, bespoke agbada, kaftan designer, premium African wear, Nigerian fashion, luxury tailoring, handcrafted clothing, African luxury brand"
        canonical="https://dowslakers.com/about"
      />
      {/* Hero */}
      <section className="relative h-[60vh] min-h-[400px] bg-black overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920"
          alt="About Dowslakers"
          className="absolute inset-0 w-full h-full object-cover opacity-60"
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
              Our Story
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="font-display text-4xl lg:text-6xl font-light tracking-wide"
            >
              About Dowslakers
            </motion.h1>
          </div>
        </motion.div>
      </section>

      {/* Content */}
      <section className="py-20 lg:py-32">
        <div className="section-container max-w-4xl">
          {/* Who We Are */}
          <ScrollAnimationWrapper variant="slide-up">
            <div className="mb-20">
              <h2 className="font-display text-3xl lg:text-4xl font-light mb-8">
                Who We Are
              </h2>
              <div className="prose prose-invert max-w-none text-muted-foreground leading-relaxed space-y-6">
                <p>
                  From bespoke kaftans and agbadas to ready-to-wear collections, every piece blends African heritage with modern style. With premium fabrics and exceptional craftsmanship, we don't just create outfits—we create experiences.
                </p>
                <p>
                  At the heart of Dowslakers is a commitment to excellence. We source premium fabrics, pay attention to every detail, and ensure that each piece resonates with the spirit of sophistication our clients deserve. Whether for special occasions, everyday elegance, or standout moments, Dowslakers offers more than fashion—we deliver an experience of style elevated.
                </p>
              </div>
            </div>
          </ScrollAnimationWrapper>

          {/* Vision, Mission, Commitment */}
          <ScrollAnimationWrapper variant="slide-up" delay={0.1}>
            <div className="grid lg:grid-cols-3 gap-12 mb-20">
              {[
                {
                  title: 'Our Vision',
                  description: 'To set the global standard for modern African fashion—celebrated for our creativity, craftsmanship, and cultural relevance.'
                },
                {
                  title: 'Our Mission',
                  description: 'To empower individuality through bold design, ethical production, and intentional storytelling. We aim to inspire self-expression while uplifting African artistry on the global stage.'
                },
                {
                  title: 'Our Commitment',
                  description: 'At Dowslakers, sustainability is woven into every stitch. We prioritize eco-conscious materials, fair labor practices, and limited-run collections to minimize waste and maximize quality.'
                }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <h3 className="font-display text-xl mb-4">{item.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {item.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollAnimationWrapper>

          {/* Bespoke Tailoring Services */}
          <ScrollAnimationWrapper variant="slide-up" delay={0.2}>
            <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
              <div>
                <h2 className="font-display text-3xl lg:text-4xl font-light mb-6">
                  Bespoke Tailoring Services
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  At Dowslakers, we specialize in crafting custom-made garments tailored to fit your personality, purpose, and silhouette. Whether it's for weddings, corporate events, or everyday elegance—our expert artisans ensure a perfect blend of comfort and style.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  We turn your ideas into luxurious outfits, using premium fabrics and cutting-edge techniques while honoring timeless craftsmanship.
                </p>
                <a
                  href="/custom-sewing"
                  className="inline-block px-8 py-3 border border-foreground text-sm tracking-[0.15em] uppercase hover:bg-foreground hover:text-background transition-colors"
                >
                  Book a Custom Order
                </a>
              </div>
              <motion.div 
                className="aspect-[4/5] bg-secondary overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src="https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800"
                  alt="Custom Tailoring"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </ScrollAnimationWrapper>

          <ScrollAnimationWrapper variant="slide-up" delay={0.1}>
            <div className="grid lg:grid-cols-3 gap-12 text-center">
              {[
                { number: '10+', label: 'Years of Excellence' },
                { number: '5000+', label: 'Satisfied Clients' },
                { number: '50+', label: 'Master Artisans' },
              ].map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="font-display text-5xl mb-4">{stat.number}</p>
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </ScrollAnimationWrapper>
        </div>
      </section>

      {/* CEO Section */}
      <section className="py-20 lg:py-32">
        <div className="section-container max-w-5xl">
          <ScrollAnimationWrapper variant="fade">
            <h2 className="font-display text-3xl lg:text-4xl font-light text-center mb-16">
              Meet the CEO
            </h2>
          </ScrollAnimationWrapper>
          
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <ScrollAnimationWrapper variant="slide-left">
              <motion.div 
                className="aspect-[3/4] bg-secondary overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              >
                <div className="w-full h-full bg-secondary/50 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <p className="text-sm">CEO Photo</p>
                    <p className="text-xs text-muted-foreground/50 mt-2">Michael Agbosu Photo Coming Soon</p>
                  </div>
                </div>
              </motion.div>
            </ScrollAnimationWrapper>

            <ScrollAnimationWrapper variant="slide-right" delay={0.1}>
              <div>
                <h3 className="font-display text-2xl lg:text-3xl mb-2">
                  Michael Agbosu
                </h3>
                <p className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-6">
                  Founder & Chief Executive Officer
                </p>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Leading Dowslakers with passion, vision, and a commitment to redefining modern African luxury fashion. Michael's vision for Dowslakers is to blend heritage tailoring with contemporary elegance, creating timeless pieces for the modern man.
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  His relentless focus on craftsmanship and customer experience drives the brand's success across every collection, ensuring that each garment carries the soul of authentic African fashion.
                </p>
              </div>
            </ScrollAnimationWrapper>
          </div>
        </div>
      </section>
    </Layout>
  );
}
