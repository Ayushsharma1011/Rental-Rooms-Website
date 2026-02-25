import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Trash2, Upload } from 'lucide-react';

const ManageGallery = () => {
    const { galleryImages, loading, refreshData } = useData();
    const { toast } = useToast();
    const [uploading, setUploading] = useState(false);
    const [file, setFile] = useState(null);
    const [altText, setAltText] = useState('');
    const [category, setCategory] = useState('nature');

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    };

    const handleUpload = async () => {
        if (!file) {
            toast({ variant: 'destructive', title: 'No file selected' });
            return;
        }
        setUploading(true);

        const fileName = `${Date.now()}_${file.name}`;
        const { error: uploadError } = await supabase.storage.from('gallery_images').upload(fileName, file);

        if (uploadError) {
            toast({ variant: 'destructive', title: 'Upload failed', description: uploadError.message });
            setUploading(false);
            return;
        }

        const { data: { publicUrl } } = supabase.storage.from('gallery_images').getPublicUrl(fileName);

        const { error: insertError } = await supabase.from('gallery_images').insert([{ url: publicUrl, alt: altText, category }]);

        if (insertError) {
            toast({ variant: 'destructive', title: 'Failed to save image data', description: insertError.message });
        } else {
            toast({ title: 'Image uploaded successfully!' });
            await refreshData();
            setFile(null);
            setAltText('');
        }
        setUploading(false);
    };

    const handleDelete = async (image) => {
        if (!window.confirm('Are you sure you want to delete this image?')) return;
        
        const fileName = image.url.split('/').pop();
        const { error: storageError } = await supabase.storage.from('gallery_images').remove([fileName]);
        if (storageError) {
            toast({ variant: 'destructive', title: 'Error deleting from storage', description: storageError.message });
            return;
        }

        const { error: dbError } = await supabase.from('gallery_images').delete().eq('id', image.id);
        if (dbError) {
            toast({ variant: 'destructive', title: 'Error deleting from database', description: dbError.message });
        } else {
            toast({ title: 'Image deleted successfully!' });
            await refreshData();
        }
    };

    return (
        <Card className="glassmorphic-card">
            <CardHeader><CardTitle>Manage Gallery</CardTitle></CardHeader>
            <CardContent>
                <div className="p-4 border border-dashed border-gray-500 rounded-lg mb-8 space-y-4">
                    <h3 className="text-lg font-semibold">Upload New Image</h3>
                    <div><Label htmlFor="alt">Alt Text</Label><Input id="alt" value={altText} onChange={e => setAltText(e.target.value)} placeholder="Descriptive text for the image" /></div>
                    <div><Label htmlFor="category">Category</Label><Input id="category" value={category} onChange={e => setCategory(e.target.value)} placeholder="e.g., interior, exterior, nature" /></div>
                    <div><Label htmlFor="file">Image File</Label><Input id="file" type="file" onChange={handleFileChange} accept="image/*" /></div>
                    <Button onClick={handleUpload} disabled={uploading}>
                        {uploading ? <Loader2 className="animate-spin mr-2" /> : <Upload className="mr-2 h-4 w-4" />}
                        Upload Image
                    </Button>
                </div>

                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div> : (
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {galleryImages.map(image => (
                            <div key={image.id} className="relative group">
                                <img src={image.url} alt={image.alt} className="w-full h-40 object-cover rounded-lg" />
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <Button variant="destructive" size="icon" onClick={() => handleDelete(image)}><Trash2 className="h-4 w-4" /></Button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageGallery;