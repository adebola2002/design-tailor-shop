import { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Volume2, VolumeX } from 'lucide-react';
import { motion } from 'framer-motion';
import { supabase } from '@/integrations/supabase/client';

export function HeroSection() {
  const [isMuted, setIsMuted] = useState(true);
  const [videoUrl, setVideoUrl] = useState('/web video .mp4');
  const [heroTitle, setHeroTitle] = useState('DOWSLAKERS');
  const [heroSubtitle, setHeroSubtitle] = useState('Fashion Experience 2026');
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    // Load settings from database
    async function loadSettings() {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('key, value')
          .in('key', ['hero_video_url', 'hero_title', 'hero_subtitle']);

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
          
          if (row.key === 'hero_video_url' && stringValue) setVideoUrl(stringValue);
          if (row.key === 'hero_title' && stringValue) setHeroTitle(stringValue);
          if (row.key === 'hero_subtitle' && stringValue) setHeroSubtitle(stringValue);
        });
      } catch (error) {
        console.error('Error loading hero settings:', error);
      }
    }

    loadSettings();
  }, []);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden">
      {/* Background Video */}
      <video
        ref={videoRef}
        autoPlay
        muted={isMuted}
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
      </video>
      
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/40" />
      
      {/* Sound Control Button */}
      <motion.button
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        onClick={toggleMute}
        className="absolute bottom-8 left-8 z-10 flex items-center gap-2 text-white/80 hover:text-white transition-colors"
      >
        {isMuted ? (
          <VolumeX className="h-5 w-5" strokeWidth={1.5} />
        ) : (
          <Volume2 className="h-5 w-5" strokeWidth={1.5} />
        )}
        <span className="text-xs tracking-[0.15em] uppercase">
          {isMuted ? 'Unmute' : 'Mute'}
        </span>
      </motion.button>
      
      {/* Content - LV Style Bottom Center */}
      <div className="absolute inset-0 flex flex-col items-center justify-end pb-20 lg:pb-28 px-4 text-center text-white">
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
          className="text-xs tracking-[0.2em] uppercase text-white/80 mb-3"
        >
          {heroSubtitle}
        </motion.p>
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="font-display text-3xl sm:text-4xl lg:text-5xl font-light tracking-wide mb-8"
        >
          {heroTitle}
        </motion.h1>
        
        {/* Simple Text Links - LV Style */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="flex items-center gap-8"
        >
          <Link 
            to="/shop"
            className="text-sm tracking-wide text-white hover:opacity-60 transition-opacity border-b border-white/50 pb-0.5"
          >
            Shop Collection
          </Link>
          <Link 
            to="/custom-sewing"
            className="text-sm tracking-wide text-white hover:opacity-60 transition-opacity border-b border-white/50 pb-0.5"
          >
            Sew Your Style
          </Link>
        </motion.div>
      </div>
    </section>
  );
}