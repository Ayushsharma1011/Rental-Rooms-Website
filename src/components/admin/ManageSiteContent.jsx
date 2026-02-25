
import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/customSupabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Save } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { useData } from '@/contexts/DataContext';

const ManageSiteContent = () => {
    const { toast } = useToast();
    const { siteContent: initialContent, loading: dataLoading, refreshData } = useData();
    const [content, setContent] = useState({});
    const [saving, setSaving] = useState(false);

    useEffect(() => {
      setContent(initialContent);
    }, [initialContent])

    const contentFields = [
        { key: 'hero_title', label: 'Homepage Hero Title', type: 'text' },
        { key: 'hero_subtitle', label: 'Homepage Hero Subtitle', type: 'textarea' },
        { key: 'about_page_content', label: 'About Page Content', type: 'textarea' },
        { key: 'privacy_policy_content', label: 'Privacy Policy Content', type: 'textarea' },
        { key: 'terms_and_conditions_content', label: 'Terms & Conditions Content', type: 'textarea' },
    ];

    const handleInputChange = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSave = async (key) => {
        setSaving(true);
        const { error } = await supabase
            .from('site_content')
            .update({ content: content[key] })
            .eq('element_key', key);

        if (error) {
            toast({ variant: 'destructive', title: 'Error saving content', description: error.message });
        } else {
            toast({ title: 'Content updated successfully!' });
            await refreshData();
        }
        setSaving(false);
    };

    return (
        <Card className="glassmorphic-card">
            <CardHeader>
                <CardTitle>Manage Site Content</CardTitle>
            </CardHeader>
            <CardContent>
                {dataLoading ? <div className="flex justify-center"><Loader2 className="animate-spin h-8 w-8" /></div> : (
                    <div className="space-y-6">
                        {contentFields.map(field => (
                            <div key={field.key} className="space-y-2 p-4 bg-white/5 rounded-lg">
                                <Label htmlFor={field.key} className="text-lg">{field.label}</Label>
                                {field.type === 'textarea' ? (
                                    <Textarea
                                        id={field.key}
                                        value={content[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        className="bg-white/10 border-white/20 min-h-[150px]"
                                    />
                                ) : (
                                    <Input
                                        id={field.key}
                                        value={content[field.key] || ''}
                                        onChange={(e) => handleInputChange(field.key, e.target.value)}
                                        className="bg-white/10 border-white/20"
                                    />
                                )}
                                <Button onClick={() => handleSave(field.key)} disabled={saving} size="sm" className="mt-2">
                                    {saving ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                                    Save
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
};

export default ManageSiteContent;
