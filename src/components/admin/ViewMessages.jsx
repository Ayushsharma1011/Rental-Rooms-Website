import React from 'react';
import { useData } from '@/contexts/DataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2, CheckCircle } from 'lucide-react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const ViewMessages = () => {
    const { messages, loading, refreshData } = useData();
    const { toast } = useToast();

    const handleDelete = async (messageId) => {
        if (!window.confirm('Are you sure you want to delete this message?')) return;
        const { error } = await supabase.from('messages').delete().eq('id', messageId);
        if (error) {
            toast({ variant: 'destructive', title: 'Error deleting message', description: error.message });
        } else {
            toast({ title: 'Message deleted successfully!' });
            await refreshData();
        }
    };
    
    const handleApprove = async (messageId) => {
        const { error } = await supabase.from('messages').update({ status: 'Approved' }).eq('id', messageId);
        if (error) {
            toast({ variant: 'destructive', title: 'Error approving message', description: error.message });
        } else {
            toast({ title: 'Message approved!', description: 'Next step would be sending a WhatsApp notification.' });
            await refreshData();
        }
    };

    return (
        <Card className="glassmorphic-card">
            <CardHeader><CardTitle>Contact Messages</CardTitle></CardHeader>
            <CardContent>
                {loading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div> : (
                    <div className="space-y-4">
                        {messages.length > 0 ? messages.map(msg => (
                            <div key={msg.id} className={cn("p-4 rounded-lg bg-white/5 transition-all", msg.status === 'Approved' && 'border-l-4 border-green-500')}>
                                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                                    <div className="min-w-0">
                                        <p className="break-words font-bold text-secondary">{msg.name} <span className="font-normal text-gray-400">&lt;{msg.email}&gt;</span></p>
                                        <p className="text-xs text-gray-500">{new Date(msg.created_at).toLocaleString()} - <span className={cn('font-semibold', msg.status === 'Approved' ? 'text-green-400' : 'text-yellow-400')}>{msg.status}</span></p>
                                    </div>
                                    <div className="flex justify-end gap-2">
                                        {msg.status !== 'Approved' && (
                                             <Button variant="outline" size="icon" onClick={() => handleApprove(msg.id)}><CheckCircle className="h-4 w-4 text-green-400" /></Button>
                                        )}
                                        <Button variant="destructive" size="icon" onClick={() => handleDelete(msg.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </div>
                                </div>
                                <p className="mt-2 break-words text-gray-200">{msg.message}</p>
                                {msg.phone && <p className="mt-1 break-words text-sm text-gray-400">Phone: {msg.phone}</p>}
                            </div>
                        )) : <p className="text-center text-gray-400">No messages yet.</p>}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ViewMessages;
