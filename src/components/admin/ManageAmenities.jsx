
import React, { useState } from 'react';
import { useData } from '@/contexts/DataContext';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, PlusCircle, Trash2, Edit, Save } from 'lucide-react';

const ManageAmenities = () => {
    const { amenities, loading, refreshData } = useData();
    const { toast } = useToast();
    const [newName, setNewName] = useState('');
    const [newIcon, setNewIcon] = useState('');
    const [isAdding, setIsAdding] = useState(false);
    const [editingAmenity, setEditingAmenity] = useState(null);

    const handleAdd = async (e) => {
        e.preventDefault();
        if (!newName) return;
        setIsAdding(true);
        const { error } = await supabase.from('amenities').insert([{ name: newName, icon_name: newIcon }]);
        if (error) {
            toast({ variant: 'destructive', title: 'Error adding amenity', description: error.message });
        } else {
            toast({ title: 'Amenity added successfully!' });
            setNewName('');
            setNewIcon('');
            await refreshData();
        }
        setIsAdding(false);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure? This will also remove the amenity from all rooms.')) return;
        const { error } = await supabase.from('amenities').delete().eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error deleting amenity', description: error.message });
        } else {
            toast({ title: 'Amenity deleted!' });
            await refreshData();
        }
    };
    
    const handleUpdate = async (e) => {
        e.preventDefault();
        if (!editingAmenity) return;
        const { error } = await supabase.from('amenities').update({ name: editingAmenity.name, icon_name: editingAmenity.icon_name }).eq('id', editingAmenity.id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error updating amenity', description: error.message });
        } else {
            toast({ title: 'Amenity updated!' });
            setEditingAmenity(null);
            await refreshData();
        }
    };

    return (
        <Card className="glassmorphic-card">
            <CardHeader><CardTitle>Manage Amenities</CardTitle></CardHeader>
            <CardContent>
                <form onSubmit={handleAdd} className="flex gap-4 mb-8 p-4 border border-dashed rounded-lg">
                    <div className="flex-grow">
                        <Label htmlFor="new-amenity">Amenity Name</Label>
                        <Input id="new-amenity" value={newName} onChange={e => setNewName(e.target.value)} placeholder="e.g. Free Parking" />
                    </div>
                     <div className="flex-grow">
                        <Label htmlFor="new-icon">Icon Name (Lucide)</Label>
                        <Input id="new-icon" value={newIcon} onChange={e => setNewIcon(e.target.value)} placeholder="e.g. Wifi, Bed" />
                    </div>
                    <Button type="submit" disabled={isAdding} className="self-end">
                        {isAdding ? <Loader2 className="animate-spin" /> : <PlusCircle className="h-4 w-4" />}
                    </Button>
                </form>

                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div> : (
                    <div className="space-y-2">
                        {amenities.map(amenity => (
                            <div key={amenity.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                                {editingAmenity?.id === amenity.id ? (
                                    <form onSubmit={handleUpdate} className="flex-grow flex items-center gap-2">
                                        <Input value={editingAmenity.name} onChange={e => setEditingAmenity({...editingAmenity, name: e.target.value})} className="bg-white/10" />
                                        <Input value={editingAmenity.icon_name || ''} onChange={e => setEditingAmenity({...editingAmenity, icon_name: e.target.value})} placeholder="Icon Name" className="bg-white/10" />
                                        <Button type="submit" size="icon"><Save className="h-4 w-4" /></Button>
                                    </form>
                                ) : (
                                    <>
                                        <p>{amenity.name} ({amenity.icon_name || 'No Icon'})</p>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="icon" onClick={() => setEditingAmenity(amenity)}><Edit className="h-4 w-4" /></Button>
                                            <Button variant="destructive" size="icon" onClick={() => handleDelete(amenity.id)}><Trash2 className="h-4 w-4" /></Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageAmenities;
