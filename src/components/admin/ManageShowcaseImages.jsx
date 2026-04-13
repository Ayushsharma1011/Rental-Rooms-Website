import React, { useRef, useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save, Trash2, Upload } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

const SHOWCASE_CATEGORY = 'showcase';

const ManageShowcaseImages = () => {
  const { galleryImages, loading, refreshData } = useData();
  const { toast } = useToast();
  const fileInputRef = useRef(null);
  const replaceInputRefs = useRef({});

  const [files, setFiles] = useState([]);
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [savingId, setSavingId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [replacingId, setReplacingId] = useState(null);
  const [draftAltTexts, setDraftAltTexts] = useState({});
  const [selectedImageIds, setSelectedImageIds] = useState([]);

  const showcaseImages = galleryImages.filter(
    (image) => String(image.category || '').toLowerCase() === SHOWCASE_CATEGORY
  );

  const handleUpload = async () => {
    if (!files.length) {
      toast({ variant: 'destructive', title: 'No file selected' });
      return;
    }

    setUploading(true);

    try {
      const uploadedRows = [];

      for (const file of files) {
        const fileName = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}_${file.name}`;
        const { error: uploadError } = await supabase.storage
          .from('gallery_images')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
        }

        const {
          data: { publicUrl },
        } = supabase.storage.from('gallery_images').getPublicUrl(fileName);

        uploadedRows.push({
          url: publicUrl,
          alt: altText || file.name,
          category: SHOWCASE_CATEGORY,
        });
      }

      const { error: insertError } = await supabase
        .from('gallery_images')
        .insert(uploadedRows);

      if (insertError) {
        throw new Error(insertError.message);
      }

      toast({
        title: 'Showcase images uploaded successfully!',
        description: `${uploadedRows.length} image(s) added to homepage showcase.`,
      });

      setFiles([]);
      setAltText('');
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
      await refreshData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: error.message,
      });
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (image) => {
    if (!window.confirm('Are you sure you want to delete this showcase image?')) {
      return;
    }

    setDeletingId(image.id);

    const fileName = image.url.split('/').pop();
    const { error: storageError } = await supabase.storage
      .from('gallery_images')
      .remove([fileName]);

    if (storageError) {
      toast({
        variant: 'destructive',
        title: 'Error deleting from storage',
        description: storageError.message,
      });
      setDeletingId(null);
      return;
    }

    const { error: dbError } = await supabase
      .from('gallery_images')
      .delete()
      .eq('id', image.id);

    if (dbError) {
      toast({
        variant: 'destructive',
        title: 'Error deleting from database',
        description: dbError.message,
      });
    } else {
      toast({ title: 'Showcase image deleted successfully!' });
      await refreshData();
    }

    setDeletingId(null);
  };

  const handleToggleSelection = (imageId, checked) => {
    setSelectedImageIds((currentState) =>
      checked
        ? [...currentState, imageId]
        : currentState.filter((id) => id !== imageId)
    );
  };

  const handleBulkDelete = async () => {
    if (!selectedImageIds.length) {
      toast({ variant: 'destructive', title: 'No images selected' });
      return;
    }

    if (!window.confirm(`Are you sure you want to delete ${selectedImageIds.length} selected showcase image(s)?`)) {
      return;
    }

    setDeletingId('bulk');

    try {
      const selectedImages = showcaseImages.filter((image) =>
        selectedImageIds.includes(image.id)
      );

      const fileNames = selectedImages
        .map((image) => image.url.split('/').pop())
        .filter(Boolean);

      if (fileNames.length) {
        const { error: storageError } = await supabase.storage
          .from('gallery_images')
          .remove(fileNames);

        if (storageError) {
          throw new Error(storageError.message);
        }
      }

      const { error: dbError } = await supabase
        .from('gallery_images')
        .delete()
        .in('id', selectedImageIds);

      if (dbError) {
        throw new Error(dbError.message);
      }

      toast({
        title: 'Showcase images deleted successfully!',
        description: `${selectedImageIds.length} image(s) removed.`,
      });
      setSelectedImageIds([]);
      await refreshData();
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Bulk delete failed',
        description: error.message,
      });
    } finally {
      setDeletingId(null);
    }
  };

  const handleSaveAlt = async (image) => {
    const nextAlt = draftAltTexts[image.id] ?? image.alt ?? '';
    setSavingId(image.id);

    const { error } = await supabase
      .from('gallery_images')
      .update({ alt: nextAlt, category: SHOWCASE_CATEGORY })
      .eq('id', image.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Failed to update image',
        description: error.message,
      });
    } else {
      toast({ title: 'Showcase image updated successfully!' });
      await refreshData();
    }

    setSavingId(null);
  };

  const handleReplaceImage = async (image, nextFile) => {
    if (!nextFile) return;

    setReplacingId(image.id);

    const newFileName = `${Date.now()}_${nextFile.name}`;
    const { error: uploadError } = await supabase.storage
      .from('gallery_images')
      .upload(newFileName, nextFile);

    if (uploadError) {
      toast({
        variant: 'destructive',
        title: 'Replacement upload failed',
        description: uploadError.message,
      });
      setReplacingId(null);
      return;
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from('gallery_images').getPublicUrl(newFileName);

    const { error: updateError } = await supabase
      .from('gallery_images')
      .update({ url: publicUrl, category: SHOWCASE_CATEGORY })
      .eq('id', image.id);

    if (updateError) {
      toast({
        variant: 'destructive',
        title: 'Failed to update showcase image',
        description: updateError.message,
      });
      setReplacingId(null);
      return;
    }

    const oldFileName = image.url.split('/').pop();
    await supabase.storage.from('gallery_images').remove([oldFileName]);

    toast({ title: 'Showcase image replaced successfully!' });
    await refreshData();
    setReplacingId(null);
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader>
        <CardTitle>Manage Homepage Showcase Images</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-8 space-y-4 rounded-lg border border-dashed border-gray-500 p-4">
          <h3 className="text-lg font-semibold">Upload New Showcase Image</h3>
          <p className="text-sm text-muted-foreground">
            Images added here appear automatically in the homepage
            &quot;Rooms &amp; Places, In Focus&quot; slider.
          </p>
          <div>
            <Label htmlFor="showcase-alt">Alt Text</Label>
            <Input
              id="showcase-alt"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image"
            />
          </div>
          <div>
            <Label htmlFor="showcase-file">Image File</Label>
            <Input
              id="showcase-file"
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files || []))}
            />
            <p className="mt-2 text-sm text-muted-foreground">
              You can select and upload more than 3 images at the same time.
            </p>
          </div>
          <Button onClick={handleUpload} disabled={uploading}>
            {uploading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Add Showcase Images
          </Button>
        </div>

        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-8">
            <div>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">Currently Shown On Homepage</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setSelectedImageIds(
                        selectedImageIds.length === showcaseImages.length
                          ? []
                          : showcaseImages.map((image) => image.id)
                      )
                    }
                    disabled={!showcaseImages.length}
                  >
                    {selectedImageIds.length === showcaseImages.length && showcaseImages.length
                      ? 'Clear Selection'
                      : 'Select All'}
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={handleBulkDelete}
                    disabled={!selectedImageIds.length || deletingId === 'bulk'}
                  >
                    {deletingId === 'bulk' ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Selected
                  </Button>
                </div>
              </div>
              {showcaseImages.length > 0 ? (
                <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                  {showcaseImages.map((image) => (
                    <div
                      key={image.id}
                      className="rounded-2xl border border-white/10 bg-white/5 p-4"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || 'Showcase image'}
                        className="mb-4 h-56 w-full rounded-xl object-cover"
                      />

                      <div className="space-y-4">
                        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2">
                          <Checkbox
                            id={`select-${image.id}`}
                            checked={selectedImageIds.includes(image.id)}
                            onCheckedChange={(checked) =>
                              handleToggleSelection(image.id, Boolean(checked))
                            }
                          />
                          <Label htmlFor={`select-${image.id}`} className="cursor-pointer">
                            Select this image for bulk delete
                          </Label>
                        </div>

                        <div>
                          <Label htmlFor={`alt-${image.id}`}>Alt Text</Label>
                          <Input
                            id={`alt-${image.id}`}
                            value={draftAltTexts[image.id] ?? image.alt ?? ''}
                            onChange={(e) =>
                              setDraftAltTexts((currentState) => ({
                                ...currentState,
                                [image.id]: e.target.value,
                              }))
                            }
                            placeholder="Describe the image"
                          />
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => handleSaveAlt(image)}
                            disabled={savingId === image.id}
                            size="sm"
                          >
                            {savingId === image.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Save className="mr-2 h-4 w-4" />
                            )}
                            Save Text
                          </Button>

                          <input
                            ref={(element) => {
                              replaceInputRefs.current[image.id] = element;
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) =>
                              handleReplaceImage(image, e.target.files?.[0] || null)
                            }
                          />

                          <Button
                            variant="outline"
                            size="sm"
                            disabled={replacingId === image.id}
                            onClick={() => replaceInputRefs.current[image.id]?.click()}
                          >
                            {replacingId === image.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Upload className="mr-2 h-4 w-4" />
                            )}
                            Replace Image
                          </Button>

                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={deletingId === image.id}
                            onClick={() => handleDelete(image)}
                          >
                            {deletingId === image.id ? (
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="mr-2 h-4 w-4" />
                            )}
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">
                  No showcase images yet. Add images above and they will appear on the homepage automatically.
                </p>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageShowcaseImages;
