import React, { useRef, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Trash2, Upload } from 'lucide-react';

const WHY_CHOOSE_CATEGORY = 'why-choose-us';

const ManageWhyChooseImage = () => {
  const { galleryImages, loading, refreshData } = useData();
  const { toast } = useToast();
  const fileInputRef = useRef(null);

  const [file, setFile] = useState(null);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const currentImage =
    galleryImages.find(
      (image) => String(image.category || '').toLowerCase() === WHY_CHOOSE_CATEGORY
    ) || null;

  const handleSaveImage = async () => {
    if (!file && !currentImage) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }

    setUploading(true);

    try {
      let publicUrl = currentImage?.url || '';

      if (file) {
        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery_images')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(uploadError.message);
        }

        const {
          data: { publicUrl: nextPublicUrl },
        } = supabase.storage.from('gallery_images').getPublicUrl(fileName);

        publicUrl = nextPublicUrl;
      }

      const payload = {
        url: publicUrl,
        alt: altText || currentImage?.alt || 'Why Choose Us image',
        category: WHY_CHOOSE_CATEGORY,
      };

      const { error } = currentImage
        ? await supabase.from('gallery_images').update(payload).eq('id', currentImage.id)
        : await supabase.from('gallery_images').insert([payload]);

      if (error) {
        throw new Error(error.message);
      }

      if (file && currentImage?.url) {
        const oldFileName = currentImage.url.split('/').pop();
        await supabase.storage.from('gallery_images').remove([oldFileName]);
      }

      toast({ title: 'Why Choose Us image updated successfully!' });
      setFile(null);
      setAltText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await refreshData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Image update failed',
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSaveText = async () => {
    if (!currentImage) return;

    setSaving(true);

    const { error } = await supabase
      .from('gallery_images')
      .update({
        alt: altText || currentImage.alt || 'Why Choose Us image',
        category: WHY_CHOOSE_CATEGORY,
      })
      .eq('id', currentImage.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to save text',
        description: error.message,
      });
    } else {
      toast({ title: 'Image text updated successfully!' });
      setAltText('');
      await refreshData();
    }

    setSaving(false);
  };

  const handleDelete = async () => {
    if (!currentImage) return;
    if (!window.confirm('Are you sure you want to remove the Why Choose Us image?')) return;

    setDeleting(true);

    const fileName = currentImage.url.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('gallery_images')
      .remove([fileName]);

    if (storageError) {
      toast({
        variant: 'destructive',
        title: 'Error deleting from storage',
        description: storageError.message,
      });
      setDeleting(false);
      return;
    }

    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', currentImage.id);

    if (dbError) {
      toast({
        variant: 'destructive',
        title: 'Error deleting image data',
        description: dbError.message,
      });
    } else {
      toast({ title: 'Why Choose Us image removed successfully!' });
      await refreshData();
    }

    setDeleting(false);
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle>Manage Why Choose Us Image</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4 rounded-lg border border-dashed border-gray-500 p-4">
              <h3 className="text-lg font-semibold">Change Homepage Image</h3>
              <p className="text-sm text-muted-foreground">
                This image appears in the homepage Why Choose Us section.
              </p>

              <div>
                <Label htmlFor="why-choose-alt">Image Caption / Alt Text</Label>
                <Input
                  id="why-choose-alt"
                  value={altText}
                  onChange={(e) => setAltText(e.target.value)}
                  placeholder={currentImage?.alt || 'Describe this image'}
                />
              </div>

              <div>
                <Label htmlFor="why-choose-file">Image File</Label>
                <Input
                  id="why-choose-file"
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                />
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={handleSaveImage} disabled={uploading}>
                  {uploading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Upload className="mr-2 h-4 w-4" />
                  )}
                  {currentImage ? 'Replace Image' : 'Upload Image'}
                </Button>

                {currentImage ? (
                  <Button onClick={handleSaveText} disabled={saving} variant="outline">
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    Save Text
                  </Button>
                ) : null}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              {currentImage ? (
                <>
                  <img
                    src={currentImage.url}
                    alt={currentImage.alt || 'Why Choose Us image'}
                    className="mb-4 h-72 w-full rounded-xl object-cover"
                  />
                  <p className="mb-4 text-sm text-white/70">
                    Current text: {currentImage.alt || 'No caption added'}
                  </p>
                  <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                    {deleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Remove Image
                  </Button>
                </>
              ) : (
                <div className="flex h-72 items-center justify-center rounded-xl border border-dashed border-white/20 text-center text-sm text-white/60">
                  No custom image uploaded yet. The homepage will use the default image until you add one.
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageWhyChooseImage;
