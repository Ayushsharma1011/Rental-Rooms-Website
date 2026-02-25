
import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ManageTestimonials = () => {
    const { testimonials, loading, refreshData } = useData();
    const { toast } = useToast();

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this testimonial?')) return;
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error deleting testimonial', description: error.message });
        } else {
            toast({ title: 'Testimonial deleted successfully!' });
            await refreshData();
        }
    };
    
    const handleApprove = async (id) => {
        const { error } = await supabase.from('testimonials').update({ status: 'approved' }).eq('id', id);
        if (error) {
            toast({ variant: 'destructive', title: 'Error approving testimonial', description: error.message });
        } else {
            toast({ title: 'Testimonial approved!' });
            await refreshData();
        }
    };

    return (
        <Card className="glassmorphic-card">
            <CardHeader><CardTitle>Manage Testimonials</CardTitle></CardHeader>
            <CardContent>
                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div> : (
                    <div className="space-y-4">
                        {testimonials.length > 0 ? testimonials.map(item => (
                            <div key={item.id} className={cn(
                                "p-4 rounded-lg bg-white/5 transition-all border-l-4",
                                item.status === 'approved' && 'border-green-500',
                                item.status === 'pending' && 'border-yellow-500'
                            )}>
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-bold text-secondary">{item.name}</p>
                                        <p className="text-xs text-gray-500">{new Date(item.created_at).toLocaleString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <span className={cn(
                                            'text-xs font-semibold px-2 py-1 rounded-full',
                                            item.status === 'approved' ? 'bg-green-500/20 text-green-300' : 'bg-yellow-500/20 text-yellow-300'
                                        )}>
                                            {item.status}
                                        </span>
                                        {item.status === 'pending' && (
                                             <Button variant="outline" size="icon" onClick={() => handleApprove(item.id)}><CheckCircle className="h-4 w-4 text-green-400" /></Button>
                                        )}
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(item.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <p className="mt-2 text-gray-200">{item.text}</p>
                            </div>
                        )) : <p className="text-center text-gray-400">No testimonials submitted yet.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageTestimonials;
