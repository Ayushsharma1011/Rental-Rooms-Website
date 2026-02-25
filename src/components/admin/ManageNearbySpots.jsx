import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, Edit } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const SpotForm = ({ spot, onFinished }) => {
  const [name, setName] = useState(spot?.name || '');
  const [description, setDescription] = useState(spot?.description || '');
  const [mapLink, setMapLink] = useState(spot?.map_link || '');
  const [imageFile, setImageFile] = useState(null);
  const [imageAlt, setImageAlt] = useState(spot?.image_alt || '');
  const [loading, setLoading] = useState(false);

  const { toast } = useToast();
  const { refreshData } = useData();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const spotData = {
      name,
      description,
      map_link: mapLink,
      image_alt: imageAlt,
    };

    // ✅ Upload image if new file is selected
    if (imageFile) {
      const fileName = `spots/${Date.now()}_${imageFile.name}`;

      const { error: uploadError } = await supabase.storage
        .from('gallery_images')
        .upload(fileName, imageFile);

      if (uploadError) {
        toast({
          variant: 'destructive',
          title: 'Image upload failed',
          description: uploadError.message,
        });
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from('gallery_images').getPublicUrl(fileName);

      spotData.image_url = publicUrl;
    }

    let error;
    if (spot) {
      const { error: updateError } = await supabase
        .from('nearby_spots')
        .update(spotData)
        .eq('id', spot.id);

      error = updateError;
    } else {
      const { error: insertError } = await supabase
        .from('nearby_spots')
        .insert([spotData]);

      error = insertError;
    }

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error saving spot',
        description: error.message,
      });
    } else {
      toast({
        title: `Spot ${spot ? 'updated' : 'created'} successfully!`,
      });

      await refreshData();
      onFinished();
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* ✅ NAME */}
      <div>
        <Label htmlFor="name">Name</Label>
        <Input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="bg-white text-black placeholder:text-gray-500"
        />
      </div>

      {/* ✅ DESCRIPTION */}
      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="bg-white text-black placeholder:text-gray-500"
        />
      </div>

      {/* ✅ MAP LINK */}
      <div>
        <Label htmlFor="mapLink">Google Map Link</Label>
        <Input
          id="mapLink"
          value={mapLink}
          onChange={(e) => setMapLink(e.target.value)}
          placeholder="https://maps.google.com/..."
          className="bg-white text-black placeholder:text-gray-500"
        />
        <p className="text-xs text-gray-300 mt-1">
          Paste Google Maps link so users can open location directly.
        </p>
      </div>

      {/* ✅ IMAGE */}
      <div>
        <Label htmlFor="image">Spot Image</Label>
        <Input
          id="image"
          type="file"
          onChange={handleFileChange}
          accept="image/*"
          className="bg-white text-black file:text-black"
        />
        {spot?.image_url && !imageFile && (
          <p className="text-xs text-gray-300 mt-1">
            Current image will be kept. Upload a new file to replace it.
          </p>
        )}
      </div>

      {/* ✅ IMAGE ALT */}
      <div>
        <Label htmlFor="imageAlt">Image Alt Text</Label>
        <Input
          id="imageAlt"
          value={imageAlt}
          onChange={(e) => setImageAlt(e.target.value)}
          placeholder="e.g. A beautiful mountain view"
          className="bg-white text-black placeholder:text-gray-500"
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="animate-spin" /> : 'Save Spot'}
      </Button>
    </form>
  );
};

const ManageNearbySpots = () => {
  const { nearbySpots, loading, refreshData } = useData();
  const { toast } = useToast();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedSpot, setSelectedSpot] = useState(null);

  const handleDelete = async (spot) => {
    if (!window.confirm('Are you sure you want to delete this spot?')) return;

    // ✅ Remove image from storage (if exists)
    if (spot.image_url) {
      const path = spot.image_url.split('/gallery_images/').pop();
      if (path) {
        await supabase.storage.from('gallery_images').remove([path]);
      }
    }

    const { error } = await supabase
      .from('nearby_spots')
      .delete()
      .eq('id', spot.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting spot',
        description: error.message,
      });
    } else {
      toast({ title: 'Spot deleted successfully!' });
      await refreshData();
    }
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Manage Nearby Spots</CardTitle>

        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Spot
            </Button>
          </DialogTrigger>

          <DialogContent className="bg-slate-800 border-purple-500 text-white">
            <DialogHeader>
              <DialogTitle>Add New Spot</DialogTitle>
            </DialogHeader>

            <SpotForm onFinished={() => setCreateOpen(false)} />
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="flex justify-center">
            <Loader2 className="animate-spin h-8 w-8" />
          </div>
        ) : (
          <div className="space-y-4">
            {nearbySpots.map((spot) => (
              <div
                key={spot.id}
                className="flex items-center justify-between p-4 rounded-lg bg-white/5"
              >
                <div className="flex items-center gap-4">
                  <img
                    src={spot.image_url || 'https://via.placeholder.com/100'}
                    alt={spot.name}
                    className="h-16 w-16 rounded-md object-cover"
                  />

                  <div>
                    <p className="font-bold text-lg text-secondary">
                      {spot.name}
                    </p>

                    {spot.map_link && (
                      <a
                        href={spot.map_link}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs text-blue-300 hover:underline"
                      >
                        Open Map Link
                      </a>
                    )}
                  </div>
                </div>

                <div className="flex gap-2">
                  <Dialog
                    open={isEditOpen && selectedSpot?.id === spot.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedSpot(null);
                      setEditOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedSpot(spot);
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="bg-slate-800 border-purple-500 text-white">
                      <DialogHeader>
                        <DialogTitle>Edit Spot</DialogTitle>
                      </DialogHeader>

                      <SpotForm
                        spot={selectedSpot}
                        onFinished={() => {
                          setEditOpen(false);
                          setSelectedSpot(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(spot)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ManageNearbySpots;
