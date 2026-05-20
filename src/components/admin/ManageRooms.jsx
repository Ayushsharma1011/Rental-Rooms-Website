import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2, PlusCircle, Trash2, Edit, UploadCloud, X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const RoomForm = ({ room, onFinished }) => {
  const { amenities: allAmenities, refreshData } = useData();

  const [name, setName] = useState(room?.name || '');
  const [price, setPrice] = useState(room?.price || '');
  const [description, setDescription] = useState(room?.description || '');
  const [availability, setAvailability] = useState(
    room?.availability || 'Available'
  );

  // ✅ VARCHAR / TEXT CAPACITY SUPPORT
  const [capacity, setCapacity] = useState(room?.capacity || '');

  const [imageFiles, setImageFiles] = useState([]);
  const [existingImages, setExistingImages] = useState(room?.images || []);

  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = (e) => {
    if (e.target.files) {
      setImageFiles((prev) => [...prev, ...Array.from(e.target.files)]);
    }
  };

  const removeExistingImage = async (imageId, imageUrl) => {
    if (!window.confirm('Are you sure you want to delete this image?')) return;

    const { error: dbError } = await supabase
      .from('room_images')
      .delete()
      .eq('id', imageId);

    if (dbError) {
      toast({
        variant: 'destructive',
        title: 'Error deleting image from DB',
        description: dbError.message,
      });
      return;
    }

    const path = imageUrl.split('/room_images/').pop();
    await supabase.storage.from('room_images').remove([path]);

    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
    toast({ title: 'Image deleted.' });
  };

  const [selectedAmenities, setSelectedAmenities] = useState(
    room?.amenities?.map((a) => a.id) || []
  );

  const handleAmenityChange = (amenityId) => {
    setSelectedAmenities((prev) =>
      prev.includes(amenityId)
        ? prev.filter((id) => id !== amenityId)
        : [...prev, amenityId]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const roomData = {
      name,
      price,
      description,
      availability,
      capacity, // ✅ varchar capacity saved directly
    };

    // ✅ UPSERT ROOM
    let roomId = room?.id;

    if (room) {
      const { error } = await supabase.from('rooms').update(roomData).eq('id', room.id);
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error updating room',
          description: error.message,
        });
        setLoading(false);
        return;
      }
    } else {
      const { data, error } = await supabase
        .from('rooms')
        .insert([roomData])
        .select()
        .single();

      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error creating room',
          description: error.message,
        });
        setLoading(false);
        return;
      }

      roomId = data.id;
    }

    // ✅ UPLOAD NEW IMAGES
    let uploadedPaths = [];

    if (imageFiles.length > 0) {
      const uploadResults = await Promise.all(
        imageFiles.map((file) => {
          const fileName = `public/${Date.now()}_${file.name}`;
          return supabase.storage.from('room_images').upload(fileName, file);
        })
      );

      const newImageRecords = [];

      for (const result of uploadResults) {
        if (result.error) {
          toast({
            variant: 'destructive',
            title: 'Image upload failed',
            description: result.error.message,
          });
          continue;
        }

        uploadedPaths.push(result.data.path);

        const {
          data: { publicUrl },
        } = supabase.storage.from('room_images').getPublicUrl(result.data.path);

        newImageRecords.push({
          room_id: roomId,
          image_url: publicUrl,
          image_alt: name,
        });
      }

      if (newImageRecords.length > 0) {
        const { error } = await supabase.from('room_images').insert(newImageRecords);
        if (error) {
          toast({
            variant: 'destructive',
            title: 'Error saving image records',
            description: error.message,
          });
        }
      }
    }

    // ✅ SET MAIN IMAGE IF EMPTY
    if (!room?.image_url && existingImages.length === 0 && uploadedPaths.length > 0) {
      const {
        data: { publicUrl },
      } = supabase.storage.from('room_images').getPublicUrl(uploadedPaths[0]);

      await supabase.from('rooms').update({ image_url: publicUrl }).eq('id', roomId);
    }

    // ✅ AMENITIES SAVE
    await supabase.from('room_amenities').delete().eq('room_id', roomId);

    if (selectedAmenities.length > 0) {
      const amenitiesToInsert = selectedAmenities.map((amenityId) => ({
        room_id: roomId,
        amenity_id: amenityId,
      }));

      await supabase.from('room_amenities').insert(amenitiesToInsert);
    }

    toast({ title: `Room ${room ? 'updated' : 'created'} successfully!` });
    await refreshData();
    onFinished();
    setLoading(false);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 max-h-[80vh] overflow-y-auto p-1 pr-4"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ NAME */}
        <div>
          <Label>Room No.</Label>
          <Input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Mountain View Suite"
            required
            className="bg-white text-black placeholder:text-gray-500"
          />
        </div>

        {/* ✅ PRICE */}
        <div>
          <Label>Rent per month (₹)</Label>
          <Input
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            type="number"
            placeholder="e.g. 7000"
            required
            className="bg-white text-black placeholder:text-gray-500"
          />
        </div>
      </div>

      {/* ✅ DESCRIPTION */}
      <div>
        <Label>Description</Label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Room description"
          className="bg-white text-black placeholder:text-gray-500"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* ✅ CAPACITY (TEXT NOW ✅) */}
        <div>
          <Label>Capacity</Label>
          <Input
            value={capacity}
            onChange={(e) => setCapacity(e.target.value)}
            type="text"
            placeholder="e.g. 2 Adults / 4 People / 2-3 Guests"
            className="bg-white text-black placeholder:text-gray-500"
          />
        </div>

        {/* ✅ AVAILABILITY */}
        <div>
          <Label>Availability</Label>
          <Select onValueChange={setAvailability} defaultValue={availability}>
            <SelectTrigger className="bg-white text-black">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Booked">Booked</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ✅ IMAGES */}
      <div>
        <Label>Room Images</Label>

        <div className="p-4 border-2 border-dashed rounded-lg text-center">
          <Input
            id="image-upload"
            type="file"
            onChange={handleFileChange}
            accept="image/*"
            multiple
            className="hidden"
          />

          <Label
            htmlFor="image-upload"
            className="cursor-pointer text-primary hover:underline flex flex-col items-center gap-2"
          >
            <UploadCloud className="h-8 w-8" />
            Click to upload images
          </Label>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-4">
          {existingImages.map((img) => (
            <div key={img.id} className="relative group">
              <img
                src={img.image_url}
                alt={img.image_alt}
                className="h-24 w-full object-cover rounded-md"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() => removeExistingImage(img.id, img.image_url)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}

          {imageFiles.map((file, i) => (
            <div key={i} className="relative group">
              <img
                src={URL.createObjectURL(file)}
                alt={file.name}
                className="h-24 w-full object-cover rounded-md"
              />
              <Button
                type="button"
                size="icon"
                variant="destructive"
                className="absolute top-1 right-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                onClick={() =>
                  setImageFiles((files) => files.filter((_, idx) => idx !== i))
                }
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ AMENITIES */}
      <div className="space-y-2">
        <Label>Amenities</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-4 border rounded-md max-h-48 overflow-y-auto bg-white text-black">
          {allAmenities.map((amenity) => (
            <div key={amenity.id} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.id}`}
                checked={selectedAmenities.includes(amenity.id)}
                onCheckedChange={() => handleAmenityChange(amenity.id)}
              />
              <label
                htmlFor={`amenity-${amenity.id}`}
                className="text-sm font-medium leading-none"
              >
                {amenity.name}
              </label>
            </div>
          ))}
        </div>
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? <Loader2 className="animate-spin" /> : 'Save Room'}
      </Button>
    </form>
  );
};

const ManageRooms = () => {
  const { rooms, loading, refreshData } = useData();
  const { toast } = useToast();
  const [isCreateOpen, setCreateOpen] = useState(false);
  const [isEditOpen, setEditOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  const handleDelete = async (room) => {
    if (!window.confirm('Are you sure? This action is irreversible.')) return;

    if (room.images && room.images.length > 0) {
      const paths = room.images
        .map((img) => img.image_url.split('/room_images/').pop())
        .filter(Boolean);

      await supabase.storage.from('room_images').remove(paths);
    }

    const { error } = await supabase.from('rooms').delete().eq('id', room.id);

    if (error) {
      toast({
        variant: 'destructive',
        title: 'Error deleting room',
        description: error.message,
      });
    } else {
      toast({ title: 'Room deleted successfully!' });
      await refreshData();
    }
  };

  return (
    <Card className="glassmorphic-card">
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Manage Rooms</CardTitle>

        <Dialog open={isCreateOpen} onOpenChange={setCreateOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <PlusCircle className="mr-2 h-4 w-4" /> Add New Room
            </Button>
          </DialogTrigger>

          <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto border-purple-500 bg-slate-800 text-white sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Room</DialogTitle>
            </DialogHeader>

            <RoomForm onFinished={() => setCreateOpen(false)} />
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
            {rooms.map((room) => (
              <div
                key={room.id}
                className="flex flex-col gap-4 rounded-lg bg-white/5 p-3 sm:flex-row sm:items-center sm:justify-between sm:p-4"
              >
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                  <img
                    src={room.image_url || 'https://via.placeholder.com/100'}
                    alt={room.name}
                    className="h-16 w-16 shrink-0 rounded-md object-cover"
                  />

                  <div className="min-w-0">
                    <p className="truncate text-base font-bold text-secondary sm:text-lg">
                      {room.name}
                    </p>

                    <p className="text-sm text-gray-300">
                      ₹{room.price}/month -{' '}
                      <span
                        className={
                          room.availability === 'Available'
                            ? 'text-green-400'
                            : 'text-red-400'
                        }
                      >
                        {room.availability}
                      </span>
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">
                  <Dialog
                    open={isEditOpen && selectedRoom?.id === room.id}
                    onOpenChange={(open) => {
                      if (!open) setSelectedRoom(null);
                      setEditOpen(open);
                    }}
                  >
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => {
                          setSelectedRoom(room);
                          setEditOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>

                    <DialogContent className="max-h-[90vh] w-[95vw] overflow-y-auto border-purple-500 bg-slate-800 text-white sm:max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Edit Room</DialogTitle>
                      </DialogHeader>

                      <RoomForm
                        room={selectedRoom}
                        onFinished={() => {
                          setEditOpen(false);
                          setSelectedRoom(null);
                        }}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => handleDelete(room)}
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

export default ManageRooms;
