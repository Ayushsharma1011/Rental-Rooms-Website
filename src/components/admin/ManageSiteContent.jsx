
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
import RichTextEditor from '@/components/shared/RichTextEditor';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
    sanitizeRichText,
    SITE_CONTENT_ADMIN_SECTIONS,
    SITE_CONTENT_DEFAULTS,
} from '@/lib/siteContent';

const ManageSiteContent = () => {
    const { toast } = useToast();
    const { siteContent: initialContent, loading: dataLoading, refreshData } = useData();
    const [content, setContent] = useState({});
    const [saving, setSaving] = useState(false);
    const [activeSection, setActiveSection] = useState(null);

    useEffect(() => {
      setContent({ ...SITE_CONTENT_DEFAULTS, ...initialContent });
    }, [initialContent])

    const handleInputChange = (key, value) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    const handleSaveSection = async (fields) => {
        setSaving(true);
        const payload = fields.map((field) => ({
            element_key: field.key,
            content: field.type === 'richtext'
                ? sanitizeRichText(content[field.key] || '')
                : content[field.key] || '',
            content_type: field.type === 'richtext' ? 'richtext' : 'text',
        }));
        let error = null;

        const { data: existingRows, error: existingError } = await supabase
            .from('site_content')
            .select('element_key')
            .in('element_key', payload.map((item) => item.element_key));

        if (existingError) {
            error = existingError;
        } else {
            const existingKeys = new Set(existingRows.map((item) => item.element_key));

            for (const item of payload) {
                const query = existingKeys.has(item.element_key)
                    ? supabase
                        .from('site_content')
                        .update({ content: item.content, content_type: item.content_type })
                        .eq('element_key', item.element_key)
                    : supabase.from('site_content').insert([item]);

                const { error: saveError } = await query;
                if (saveError) {
                    error = saveError;
                    break;
                }
            }
        }

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
                        {SITE_CONTENT_ADMIN_SECTIONS.map(section => (
                            <div key={section.title} className="space-y-4 rounded-2xl border border-white/10 bg-white/5 p-5">
                                <div>
                                    <h3 className="text-xl font-semibold text-white">{section.title}</h3>
                                    <p className="mt-1 text-sm text-white/65">{section.description}</p>
                                </div>

                                <div className="grid gap-3 sm:grid-cols-2">
                                    {section.fields.map(field => (
                                        <div key={field.key} className="rounded-xl border border-white/10 bg-white/5 p-3">
                                            <p className="text-sm font-medium text-white">{field.label}</p>
                                            <p className="mt-1 line-clamp-2 text-xs text-white/60">
                                                {field.type === 'richtext'
                                                    ? (content[field.key] || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() || 'No content added yet.'
                                                    : content[field.key] || 'No content added yet.'}
                                            </p>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => setActiveSection(section)}
                                    disabled={saving}
                                    size="sm"
                                    className="mt-2"
                                >
                                    Edit Section
                                </Button>
                            </div>
                        ))}
                    </div>
                )}
            </CardContent>

            <Dialog open={!!activeSection} onOpenChange={(open) => !open && setActiveSection(null)}>
                <DialogContent className="max-h-[88vh] max-w-4xl overflow-hidden border-white/10 bg-[#1e1a18] p-0 text-white">
                    {activeSection ? (
                        <div className="flex max-h-[88vh] flex-col">
                            <div className="border-b border-white/10 px-6 py-5">
                                <h3 className="text-2xl font-semibold text-white">{activeSection.title}</h3>
                                <p className="mt-1 text-sm text-white/65">{activeSection.description}</p>
                            </div>

                            <div className="flex-1 overflow-y-auto px-6 py-5">
                                <div className="space-y-5">
                                    {activeSection.fields.map(field => (
                                        <div key={field.key} className="space-y-2">
                                            <Label htmlFor={field.key} className="text-base">{field.label}</Label>
                                            {field.type === 'textarea' ? (
                                                <Textarea
                                                    id={field.key}
                                                    value={content[field.key] || ''}
                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                    className="min-h-[120px] border-white/20 bg-white/10"
                                                />
                                            ) : field.type === 'richtext' ? (
                                                <RichTextEditor
                                                    value={content[field.key] || ''}
                                                    onChange={(value) => handleInputChange(field.key, value)}
                                                    placeholder="Use H1, H2, H3, paragraph, list, bold, and italic formatting here."
                                                />
                                            ) : (
                                                <Input
                                                    id={field.key}
                                                    value={content[field.key] || ''}
                                                    onChange={(e) => handleInputChange(field.key, e.target.value)}
                                                    className="border-white/20 bg-white/10"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-3 border-t border-white/10 px-6 py-4">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="border-white/15 bg-white/5 text-white hover:bg-white/10"
                                    onClick={() => setActiveSection(null)}
                                >
                                    Close
                                </Button>
                                <Button
                                    onClick={async () => {
                                        await handleSaveSection(activeSection.fields);
                                        setActiveSection(null);
                                    }}
                                    disabled={saving}
                                >
                                    {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Section
                                </Button>
                            </div>
                        </div>
                    ) : null}
                </DialogContent>
            </Dialog>
        </Card>
    );
};

export default ManageSiteContent;
