import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { api } from '@/services/api';
import { Plus, Pencil, Trash2, ImagePlus, X, Scissors } from 'lucide-react';

interface SewingStyle {
  id: string;
  name: string;
  description: string | null;
  images: string[];
  videos: string[];
  created_at: string;
  updated_at: string;
}

export default function AdminSewingStyles() {
  const [styles, setStyles] = useState<SewingStyle[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingStyle, setEditingStyle] = useState<SewingStyle | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    images: [] as string[],
    videos: [] as string[],
  });
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  // Mock admin token for unlocked sessions
  const mockToken = 'admin-token-mock';

  const loadData = useCallback(async () => {
    try {
      setError(null);
      console.log('Loading sewing styles, admin unlocked:', isUnlocked);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const data = await api.getSewingStyles();
      setStyles(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.error('Error loading sewing styles:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      loadData();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadData]);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      images: [],
      videos: [],
    });
    setImageFiles([]);
    setVideoFiles([]);
    setEditingStyle(null);
  };

  const openEditDialog = (style: SewingStyle) => {
    setEditingStyle(style);
    setFormData({
      name: style.name,
      description: style.description || '',
      images: style.images || [],
      videos: style.videos || [],
    });
    setDialogOpen(true);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setImageFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setVideoFiles(prev => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const removeImage = (index: number) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      videos: prev.videos.filter((_, i) => i !== index)
    }));
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
  };

  const removeNewVideo = (index: number) => {
    setVideoFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const currentToken = mockToken;
      if (!currentToken) {
        throw new Error('You are not authenticated. Please log in again.');
      }

      // Upload new images and videos
      const uploadedImages: string[] = [];
      const uploadedVideos: string[] = [];

      for (const file of imageFiles) {
        try {
          const uploadResponse = await api.uploadFile(currentToken, file);
          if (uploadResponse.file?.url) {
            uploadedImages.push(uploadResponse.file.url);
          }
        } catch (uploadError) {
          const msg = uploadError instanceof Error ? uploadError.message : 'Image upload failed';
          console.error('Image upload failed:', msg);
          throw new Error(`Image upload failed: ${msg}`);
        }
      }

      for (const file of videoFiles) {
        try {
          const uploadResponse = await api.uploadFile(currentToken, file);
          if (uploadResponse.file?.url) {
            uploadedVideos.push(uploadResponse.file.url);
          }
        } catch (uploadError) {
          const msg = uploadError instanceof Error ? uploadError.message : 'Video upload failed';
          console.error('Video upload failed:', msg);
          throw new Error(`Video upload failed: ${msg}`);
        }
      }

      const allImages = [...formData.images, ...uploadedImages];
      const allVideos = [...formData.videos, ...uploadedVideos];

      const styleData = {
        name: formData.name,
        description: formData.description || null,
        images: allImages,
        videos: allVideos,
      };

      if (editingStyle) {
        await api.updateSewingStyle(currentToken, editingStyle.id, styleData);
        toast({ title: 'Sewing style updated successfully' });
      } else {
        await api.createSewingStyle(currentToken, styleData);
        toast({ title: 'Sewing style created successfully' });
      }

      setDialogOpen(false);
      resetForm();
      loadData();
    } catch (error) {
      console.error('Error saving sewing style:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to save sewing style';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this sewing style?')) return;

    try {
      const currentToken = mockToken;
      if (!currentToken) throw new Error('Not authenticated');

      await api.deleteSewingStyle(currentToken, id);
      toast({ title: 'Sewing style deleted' });
      loadData();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete sewing style';
      toast({ title: 'Error', description: msg, variant: 'destructive' });
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-display font-bold">Sewing Styles</h1>
          <p className="text-muted-foreground">Manage custom sewing styles</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Style
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingStyle ? 'Edit Sewing Style' : 'Add New Sewing Style'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <Label htmlFor="name">Style Name</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                    required
                  />
                </div>

                <div className="col-span-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                    rows={3}
                  />
                </div>

                <div className="col-span-2">
                  <Label>Images</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {formData.images.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                        <img src={url} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {imageFiles.map((file, i) => (
                      <div key={`new-${i}`} className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                        <img src={URL.createObjectURL(file)} alt="" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <ImagePlus className="h-6 w-6 text-muted-foreground" />
                      <input type="file" accept="image/*" multiple onChange={handleImageUpload} className="hidden" />
                    </label>
                  </div>
                </div>

                <div className="col-span-2">
                  <Label>Videos</Label>
                  <div className="flex flex-wrap gap-3 mt-2">
                    {formData.videos.map((url, i) => (
                      <div key={i} className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                        <video src={url} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeVideo(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    {videoFiles.map((file, i) => (
                      <div key={`new-video-${i}`} className="relative w-20 h-20 bg-secondary rounded-lg overflow-hidden">
                        <video src={URL.createObjectURL(file)} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewVideo(i)}
                          className="absolute top-1 right-1 w-5 h-5 bg-destructive text-white rounded-full flex items-center justify-center"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </div>
                    ))}
                    <label className="w-20 h-20 border-2 border-dashed rounded-lg flex items-center justify-center cursor-pointer hover:border-primary transition-colors">
                      <Plus className="h-6 w-6 text-muted-foreground" />
                      <input type="file" accept="video/*" multiple onChange={handleVideoUpload} className="hidden" />
                    </label>
                  </div>
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : editingStyle ? 'Update' : 'Create'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {styles.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <Scissors className="h-12 w-12 mx-auto text-muted-foreground/50 mb-4" />
            <p className="text-muted-foreground">No sewing styles yet. Add your first style!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {styles.map((style) => (
            <Card key={style.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex gap-4">
                  <div className="w-20 h-24 bg-secondary rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={style.images?.[0] || '/placeholder.svg'}
                      alt={style.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-medium">{style.name}</h3>
                        <p className="text-sm text-muted-foreground">{style.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" onClick={() => openEditDialog(style)}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(style.id)}>
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex gap-4 mt-2 text-sm">
                      <span className="text-muted-foreground">{style.images?.length || 0} images, {style.videos?.length || 0} videos</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
