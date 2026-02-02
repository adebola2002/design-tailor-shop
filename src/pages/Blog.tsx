import { Link } from 'react-router-dom';
import { Layout } from '@/components/layout/Layout';
import { SEO } from '@/components/SEO';
import { ScrollAnimationWrapper } from '@/components/ScrollAnimationWrapper';
import { motion } from 'framer-motion';
import { Calendar, Tag, ArrowRight } from 'lucide-react';

const blogPosts = [
  {
    id: 1,
    title: 'The Art of Agbada: A Journey Through Nigerian Royal Fashion',
    excerpt: 'Explore the rich history and cultural significance of the Agbada, a garment that has defined Nigerian elegance for centuries.',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800',
    date: 'January 15, 2026',
    category: 'Heritage',
    readTime: '8 min read',
  },
  {
    id: 2,
    title: 'Modern Kaftan Styling: From Traditional to Contemporary',
    excerpt: 'Discover how the classic Kaftan has evolved to meet modern fashion sensibilities while maintaining its timeless appeal.',
    image: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800',
    date: 'January 10, 2026',
    category: 'Style Guide',
    readTime: '6 min read',
  },
  {
    id: 3,
    title: 'Behind the Seams: Our Master Tailors',
    excerpt: 'Meet the skilled artisans who bring your garments to life, each with decades of experience in traditional Nigerian tailoring.',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
    date: 'January 5, 2026',
    category: 'Craftsmanship',
    readTime: '5 min read',
  },
  {
    id: 4,
    title: 'Choosing the Right Fabric for Your Occasion',
    excerpt: 'A comprehensive guide to selecting fabrics that complement both the occasion and your personal style.',
    image: 'https://images.unsplash.com/photo-1558171813-4c088753af8f?w=800',
    date: 'December 28, 2025',
    category: 'Guide',
    readTime: '7 min read',
  },
  {
    id: 5,
    title: 'Seasonal Trends: Winter Elegance',
    excerpt: 'Explore the best color palettes and fabric choices for the winter season while maintaining comfort and style.',
    image: 'https://images.unsplash.com/photo-1485612169814-c5fb8d85cf12?w=800',
    date: 'December 20, 2025',
    category: 'Trends',
    readTime: '6 min read',
  },
  {
    id: 6,
    title: 'Caring for Your Premium Pieces',
    excerpt: 'Essential tips for maintaining and preserving your Dowslakers collection to ensure lasting elegance.',
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800',
    date: 'December 15, 2025',
    category: 'Care Guide',
    readTime: '4 min read',
  },
];

export default function Blog() {
  return (
    <Layout>
      <SEO
        title="Blog - African Fashion Tips & Style Guides | Dowslakers"
        description="Read Dowslakers blog for African fashion tips, styling guides, trend insights, and behind-the-scenes stories. Expert advice on wearing agbada, kaftan, and custom garments."
        keywords="fashion blog, African fashion tips, style guides, agbada styling, kaftan fashion, fashion trends, luxury wear tips, tailoring guide, African style"
        canonical="https://dowslakers.com/blog"
      />
      {/* Hero */}
      <ScrollAnimationWrapper variant="fade">
        <section className="pt-32 pb-16 bg-secondary/30">
          <div className="section-container text-center">
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-xs tracking-[0.2em] uppercase text-muted-foreground mb-4"
            >
              Insights & Stories
            </motion.p>
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-display text-4xl lg:text-5xl font-light"
            >
              The Journal
            </motion.h1>
          </div>
        </section>
      </ScrollAnimationWrapper>

      {/* Featured Post */}
      <section className="py-16">
        <ScrollAnimationWrapper variant="slide-up">
          <div className="section-container">
            <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">
              <motion.div 
                className="aspect-[4/3] overflow-hidden rounded-lg"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.6 }}
              >
                <img 
                  src={blogPosts[0].image}
                  alt={blogPosts[0].title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
                />
              </motion.div>
              <div className="lg:pl-8">
                <div className="flex items-center gap-3 mb-4">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs tracking-[0.15em] uppercase text-muted-foreground">
                    {blogPosts[0].category}
                  </p>
                  <span className="text-xs text-muted-foreground">•</span>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <p className="text-xs text-muted-foreground">
                    {blogPosts[0].date}
                  </p>
                </div>
                <h2 className="font-display text-2xl lg:text-3xl font-light mb-4 leading-tight">
                  {blogPosts[0].title}
                </h2>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  {blogPosts[0].excerpt}
                </p>
                <div className="flex items-center justify-between">
                  <Link 
                    to={`/blog/${blogPosts[0].id}`}
                    className="flex items-center gap-2 text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
                  >
                    Read Article
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                  <span className="text-xs text-muted-foreground">{blogPosts[0].readTime}</span>
                </div>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </section>

      {/* Posts Grid */}
      <section className="py-20 bg-secondary/30">
        <div className="section-container">
          <ScrollAnimationWrapper variant="fade" duration={0.4}>
            <h2 className="font-display text-2xl lg:text-3xl font-light mb-12">
              Latest Articles
            </h2>
          </ScrollAnimationWrapper>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogPosts.slice(1).map((post, index) => (
              <ScrollAnimationWrapper 
                key={post.id}
                variant="slide-up"
                delay={index * 0.05}
              >
                <article className="group h-full flex flex-col">
                  <motion.div 
                    className="aspect-[4/3] overflow-hidden mb-6 rounded-lg"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  >
                    <img 
                      src={post.image}
                      alt={post.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  </motion.div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex items-center gap-2 mb-3">
                      <Tag className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs tracking-[0.1em] uppercase text-muted-foreground">
                        {post.category}
                      </p>
                      <span className="text-xs text-muted-foreground">•</span>
                      <p className="text-xs text-muted-foreground">
                        {post.readTime}
                      </p>
                    </div>
                    <h3 className="font-display text-lg font-light mb-3 line-clamp-2 leading-tight">
                      {post.title}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2 flex-1">
                      {post.excerpt}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <Link 
                        to={`/blog/${post.id}`}
                        className="flex items-center gap-2 text-sm tracking-wide border-b border-foreground pb-0.5 hover:opacity-60 transition-opacity"
                      >
                        Read More
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                      <span className="text-xs text-muted-foreground">
                        {post.date}
                      </span>
                    </div>
                  </div>
                </article>
              </ScrollAnimationWrapper>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20">
        <ScrollAnimationWrapper variant="slide-up">
          <div className="section-container max-w-2xl">
            <div className="text-center">
              <h2 className="font-display text-3xl font-light mb-4">
                Stay Updated
              </h2>
              <p className="text-muted-foreground mb-8">
                Subscribe to our journal for exclusive insights, styling tips, and new collection announcements.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 px-6 py-3 bg-secondary/50 border border-border rounded-lg focus:outline-none focus:border-foreground transition-colors"
                />
                <button className="px-8 py-3 bg-foreground text-background font-light tracking-wider text-sm hover:opacity-80 transition-opacity rounded-lg">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
        </ScrollAnimationWrapper>
      </section>
    </Layout>
  );
}
