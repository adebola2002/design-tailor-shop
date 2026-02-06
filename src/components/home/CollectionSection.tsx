import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import agbadaHero from '@/assets/agbada-hero.jpg';
import kaftanHero from '@/assets/kaftan-hero.jpg';
import urbanHero from '@/assets/urban-hero.jpg';

const collections = [
  {
    name: 'Kaftan',
    subtitle: 'Timeless Elegance',
    description: 'Where tradition meets refinement',
    image: kaftanHero,
    href: '/collection/kaftan',
  },
  {
    name: 'Agbada',
    subtitle: 'Royal Collection',
    description: 'A celebration of heritage and prestige',
    image: agbadaHero,
    href: '/collection/agbada',
  },
  {
    name: 'Urban',
    subtitle: 'Contemporary Line',
    description: 'Modern sophistication for the discerning',
    image: urbanHero,
    href: '/collection/urban-wears',
  },
];

export function CollectionSection() {
  return (
    <section className="py-20 lg:py-32 bg-background">
      {/* Section Header */}
      <div className="container-narrow text-center mb-16 lg:mb-24">
        <p className="text-label text-muted-foreground mb-4 animate-fade-in">
          The Collections
        </p>
        <h2 className="text-editorial text-3xl lg:text-5xl mb-6 animate-fade-in-up delay-100">
          Signature Styles
        </h2>
        <div className="divider-luxury" />
      </div>

      {/* Collection Grid - Editorial Layout */}
      <div className="section-container">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-1">
          {collections.map((collection, index) => (
            <Link
              key={collection.name}
              to={collection.href}
              className="group relative img-zoom aspect-[3/4] animate-fade-in-up"
              style={{ animationDelay: `${(index + 2) * 100}ms` }}
            >
              <img
                src={collection.image}
                alt={collection.name}
                className="w-full h-full object-cover"
              />
              
              {/* Overlay */}
              <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
              
              {/* Content */}
              <div className="absolute inset-0 flex flex-col items-center justify-end p-8 lg:p-12 text-white">
                <p className="text-label text-white/70 mb-2">
                  {collection.subtitle}
                </p>
                <h3 className="font-display text-2xl lg:text-3xl font-light mb-3">
                  {collection.name}
                </h3>
                <p className="text-sm text-white/80 mb-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  {collection.description}
                </p>
                <span className="flex items-center gap-2 text-xs tracking-[0.15em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  Discover <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
