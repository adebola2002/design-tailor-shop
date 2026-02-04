import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useAdminSession } from '@/contexts/AdminSessionContext';
import { supabase } from '@/integrations/supabase/client';
import { extractErrorMessage } from '@/lib/supabase-helpers';
import { Plus, Pencil, Trash2 } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  image_url: string | null;
  display_order: number | null;
  created_at: string;
}

export default function AdminCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
  });

  const { toast } = useToast();
  const { isUnlocked } = useAdminSession();

  const loadCategories = useCallback(async () => {
    try {
      setError(null);

      if (!isUnlocked) {
        setError('Admin session not unlocked. Please unlock first.');
        setIsLoading(false);
        return;
      }

      const { data, error: fetchError } = await supabase
        .from('categories')
        .select('*')
        .order('display_order', { ascending: true });

      if (fetchError) throw fetchError;
      setCategories(data || []);
    } catch (error) {
      const message = extractErrorMessage(error);
      console.error('Error loading categories:', message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [isUnlocked]);

  useEffect(() => {
    if (isUnlocked) {
      loadCategories();
    } else {
      setError('Admin session not unlocked. Please unlock first.');
      setIsLoading(false);
    }
  }, [isUnlocked, loadCategories]);

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
    });
    setEditingCategory(null);
  };

  const openEditDialog = (category: Category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug || '',
      description: category.description || '',
    });
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!isUnlocked) {
        throw new Error('Admin session not unlocked. Please unlock first.');
      }

      const categoryData = {
        name: formData.name,
        slug: formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'),
        description: formData.description || null,
      };

      if (editingCategory) {
        const { error } = await supabase
          .from('categories')
          .update(categoryData)
          .eq('id', editingCategory.id);

        if (error) throw error;
        toast({ title: 'Category updated successfully' });
      } else {
        const { error } = await supabase
          .from('categories')
          .insert(categoryData);

        if (error) throw error;
        toast({ title: 'Category created successfully' });
      }

      setDialogOpen(false);
      resetForm();
      loadCategories();
    } catch (error) {
      console.error('Error saving category:', error);
      const errorMsg = error instanceof Error ? error.message : 'Failed to save category';
      toast({ title: 'Error', description: errorMsg, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);

      if (error) throw error;
      toast({ title: 'Category deleted' });
      loadCategories();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to delete category';
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

  if (error) {
    return (
      <Card className="border-destructive bg-destructive/5">
        <CardContent className="py-6">
          <h3 className="font-semibold text-destructive mb-2">Error Loading Categories</h3>
          <p className="text-sm text-destructive/80 mb-4">{error}</p>
          <Button onClick={loadCategories} variant="outline" size="sm">
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
          <h1 className="text-3xl font-display font-bold">Categories</h1>
          <p className="text-muted-foreground">Manage product categories</p>
        </div>

        <Dialog open={dialogOpen} onOpenChange={(open) => { setDialogOpen(open); if (!open) resetForm(); }}>
          <DialogTrigger asChild>
            <Button className="gap-2">
              <Plus className="h-4 w-4" />
              Add Category
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingCategory ? 'Edit Category' : 'Add New Category'}</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Category Name</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="slug">Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                  placeholder="e.g. agbada"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Category description (optional)"
                  rows={3}
                />
              </div>

              <div className="flex gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setDialogOpen(false);
                    resetForm();
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Saving...' : 'Save Category'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {categories.length === 0 ? (
        <Card>
          <CardContent className="py-20 text-center">
            <p className="text-muted-foreground">No categories yet. Add your first category!</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {categories.map((category) => (
            <Card key={category.id} className="animate-fade-in">
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-medium text-lg">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground mt-1">{category.description}</p>
                    )}
                    {category.slug && (
                      <p className="text-xs text-muted-foreground mt-1">Slug: {category.slug}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-2">
                      Created: {new Date(category.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost" onClick={() => openEditDialog(category)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button size="sm" variant="ghost" className="text-destructive" onClick={() => handleDelete(category.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
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
