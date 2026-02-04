import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { supabase } from '@/integrations/supabase/client';
import { extractErrorMessage, uploadSiteAsset } from '@/lib/supabase-helpers';
import { Video, Type, Save, Upload, Loader2, Image as ImageIcon, FileText } from 'lucide-react';

interface SiteSettings {
  hero_video_url: string;
  hero_title: string;
  hero_subtitle: string;
  craft_section_title: string;
  craft_section_description: string;
  craft_section_video_url: string;
}

export default function AdminSiteContent() {
  const [settings, setSettings] = useState<SiteSettings>({
    hero_video_url: '/web video .mp4',
    hero_title: 'DOWSLAKERS',
    hero_subtitle: 'Fashion Experience 2026',
    craft_section_title: 'Your Vision, Our Craft',
    craft_section_description: 'Experience the art of bespoke tailoring. Every piece is meticulously crafted to your exact specifications, ensuring a perfect fit and unparalleled elegance.',
    craft_section_video_url: '',
  });
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingHero, setIsUploadingHero] = useState(false);
  const [isUploadingCraft, setIsUploadingCraft] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  const loadSettings = useCallback(async () => {
    try {
      setError(null);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('site_settings')
        .select('key, value');

      if (fetchError) throw fetchError;

      const loadedSettings: Partial<SiteSettings> = {};
      data?.forEach(row => {
        const key = row.key as keyof SiteSettings;
        // Remove quotes from JSON string values
        let value = row.value;
        if (typeof value === 'string') {
          value = value.replace(/^"|"$/g, '');
        }
        loadedSettings[key] = value as string;
      });

      setSettings(prev => ({ ...prev, ...loadedSettings }));
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error loading site settings:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      loadSettings();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadSettings]);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      // Save each setting
      for (const [key, value] of Object.entries(settings)) {
        const { data: existing } = await supabase
          .from('site_settings')
          .select('id')
          .eq('key', key)
          .maybeSingle();

        if (existing) {
          const { error } = await supabase
            .from('site_settings')
            .update({ value: JSON.stringify(value), updated_at: new Date().toISOString() })
            .eq('key', key);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from('site_settings')
            .insert({ key, value: JSON.stringify(value) });
          if (error) throw error;
        }
      }

      toast({ title: 'Settings saved successfully!' });
    } catch (error) {
      const message = extractErrorMessage(error);
      toast({ title: 'Error', description: message, variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>, field: 'hero_video_url' | 'craft_section_video_url') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const setUploading = field === 'hero_video_url' ? setIsUploadingHero : setIsUploadingCraft;
    setUploading(true);

    try {
      const url = await uploadSiteAsset(file, field === 'hero_video_url' ? 'hero' : 'craft');
      setSettings(prev => ({ ...prev, [field]: url }));
      toast({ title: 'Video uploaded successfully!' });
    } catch (error) {
      const message = extractErrorMessage(error);
      toast({ title: 'Upload failed', description: message, variant: 'destructive' });
    } finally {
      setUploading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="py-6">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Settings</h3>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button onClick={loadSettings} variant="outline" size="sm">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Site Content</h1>
          <p className="text-muted-foreground">Manage homepage content and media</p>
        </div>
        <Button onClick={handleSave} disabled={isSaving} className="gap-2">
          {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          Save Changes
        </Button>
      </div>

      <div className="grid gap-6">
        {/* Hero Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Video className="h-5 w-5" />
              Hero Section
            </CardTitle>
            <CardDescription>
              Configure the main hero section on the homepage
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="hero_title">Hero Title</Label>
                <Input
                  id="hero_title"
                  value={settings.hero_title}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_title: e.target.value }))}
                  placeholder="DOWSLAKERS"
                />
              </div>
              <div>
                <Label htmlFor="hero_subtitle">Hero Subtitle</Label>
                <Input
                  id="hero_subtitle"
                  value={settings.hero_subtitle}
                  onChange={(e) => setSettings(prev => ({ ...prev, hero_subtitle: e.target.value }))}
                  placeholder="Fashion Experience 2026"
                />
              </div>
            </div>

            <div>
              <Label>Hero Background Video</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={settings.hero_video_url}
                    onChange={(e) => setSettings(prev => ({ ...prev, hero_video_url: e.target.value }))}
                    placeholder="Video URL or upload a new video"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" className="gap-2" disabled={isUploadingHero} asChild>
                    <span>
                      {isUploadingHero ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoUpload(e, 'hero_video_url')}
                  />
                </label>
              </div>
              {settings.hero_video_url && (
                <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                  <video
                    src={settings.hero_video_url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Craft Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              "Your Vision, Our Craft" Section
            </CardTitle>
            <CardDescription>
              Configure the custom sewing showcase section
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="craft_title">Section Title</Label>
              <Input
                id="craft_title"
                value={settings.craft_section_title}
                onChange={(e) => setSettings(prev => ({ ...prev, craft_section_title: e.target.value }))}
                placeholder="Your Vision, Our Craft"
              />
            </div>

            <div>
              <Label htmlFor="craft_description">Section Description</Label>
              <Textarea
                id="craft_description"
                value={settings.craft_section_description}
                onChange={(e) => setSettings(prev => ({ ...prev, craft_section_description: e.target.value }))}
                placeholder="Experience the art of bespoke tailoring..."
                rows={3}
              />
            </div>

            <div>
              <Label>Background Video (Optional)</Label>
              <div className="mt-2 flex items-center gap-4">
                <div className="flex-1">
                  <Input
                    value={settings.craft_section_video_url}
                    onChange={(e) => setSettings(prev => ({ ...prev, craft_section_video_url: e.target.value }))}
                    placeholder="Video URL or upload a new video"
                  />
                </div>
                <label className="cursor-pointer">
                  <Button type="button" variant="outline" className="gap-2" disabled={isUploadingCraft} asChild>
                    <span>
                      {isUploadingCraft ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
                      Upload
                    </span>
                  </Button>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) => handleVideoUpload(e, 'craft_section_video_url')}
                  />
                </label>
              </div>
              {settings.craft_section_video_url && (
                <div className="mt-4 rounded-lg overflow-hidden bg-black aspect-video max-w-md">
                  <video
                    src={settings.craft_section_video_url}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    autoPlay
                    playsInline
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}