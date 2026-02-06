import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

export function CustomSewingSection() {
  const [title, setTitle] = useState('Your Vision, Our Craft');
  const [description, setDescription] = useState(
    'Experience the art of bespoke tailoring. Every piece is meticulously crafted to your exact specifications, ensuring a perfect fit and unparalleled elegance.'
  );
  const [videoUrl, setVideoUrl] = useState('https://videos.pexels.com/video-files/6699116/6699116-uhd_2560_1440_25fps.mp4');

  useEffect(() => {
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['craft_section_title', 'craft_section_description', 'craft_section_video_url']);

        data?.forEach(row => {
          let value = row.value;
          // Parse JSON string values - handle both JSON-encoded strings and plain strings
          if (typeof value === 'string') {
            // Try to parse as JSON first (handles "\"value\"" format)
            try {
              const parsed = JSON.parse(value);
              value = typeof parsed === 'string' ? parsed : value;
            } catch {
              // Not JSON, use as-is but strip any remaining quotes
              value = value.replace(/^"|"$/g, '');
            }
          }
          const stringValue = String(value || '');
          
          if (row.key === 'craft_section_title' && stringValue) setTitle(stringValue);
          if (row.key === 'craft_section_description' && stringValue) setDescription(stringValue);
          if (row.key === 'craft_section_video_url' && stringValue) setVideoUrl(stringValue);
        });
      } catch (error) {
        console.error('Error loading craft section settings:', error);
      }
    }

    loadSettings();
  }, []);

  // Parse title for line break
  const titleParts = title.split(',');

  return (
    <section className="relative min-h-screen bg-black overflow-hidden">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-60"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center">
        <div className="section-container py-20">
          <div className="max-w-2xl">
            <p className="text-label text-white/60 mb-6 animate-fade-in">
              Made to Measure
            </p>
            <h2 className="text-editorial text-white text-4xl lg:text-6xl mb-8 animate-fade-in-up delay-100">
              {titleParts.length > 1 ? (
                <>
                  {titleParts[0]},<br />{titleParts.slice(1).join(',')}
                </>
              ) : (
                title
              )}
            </h2>
            <p className="text-white/70 text-lg mb-12 leading-relaxed animate-fade-in-up delay-200">
              {description}
            </p>
            
            <div className="space-y-8 mb-12 animate-fade-in-up delay-300">
              <div className="flex items-start gap-4">
                <div className="w-8 h-px bg-white/30 mt-3" />
                <div>
                  <h4 className="text-white text-sm tracking-[0.1em] uppercase mb-2">
                    Personal Consultation
                  </h4>
                  <p className="text-white/60 text-sm">
                    Share your vision with our master tailors
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-px bg-white/30 mt-3" />
                <div>
                  <h4 className="text-white text-sm tracking-[0.1em] uppercase mb-2">
                    Premium Materials
                  </h4>
                  <p className="text-white/60 text-sm">
                    Select from the finest fabrics and embellishments
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-8 h-px bg-white/30 mt-3" />
                <div>
                  <h4 className="text-white text-sm tracking-[0.1em] uppercase mb-2">
                    Perfect Fit Guarantee
                  </h4>
                  <p className="text-white/60 text-sm">
                    Tailored precisely to your measurements
                  </p>
                </div>
              </div>
            </div>

            <Link 
              to="/custom-sewing"
              className="inline-flex items-center gap-3 text-white text-xs tracking-[0.2em] uppercase hover:opacity-70 transition-opacity animate-fade-in-up delay-400"
            >
              Begin Your Journey
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}