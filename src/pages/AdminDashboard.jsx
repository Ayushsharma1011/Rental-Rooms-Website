
import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import PageTransition from '@/components/shared/PageTransition';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Image, MessageSquare, BedDouble, LogOut, Loader2, Edit, MapPin, Sparkles, Star } from 'lucide-react';
import { useAuth } from '@/contexts/SupabaseAuthContext';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ManageRooms from '@/components/admin/ManageRooms';
import ManageGallery from '@/components/admin/ManageGallery';
import ManageShowcaseImages from '@/components/admin/ManageShowcaseImages';
import ViewMessages from '@/components/admin/ViewMessages';
import ManageSiteContent from '@/components/admin/ManageSiteContent';
import ManageNearbySpots from '@/components/admin/ManageNearbySpots';
import ManageAmenities from '@/components/admin/ManageAmenities';
import ManageTestimonials from '@/components/admin/ManageTestimonials';
import ManageJourneyImages from '@/components/admin/ManageJourneyImages';
import ManageWhyChooseImage from '@/components/admin/ManageWhyChooseImage';

const adminTabs = [
    { value: 'rooms', label: 'Rooms', icon: BedDouble, component: ManageRooms },
    { value: 'amenities', label: 'Amenities', icon: Sparkles, component: ManageAmenities },
    { value: 'showcase', label: 'Homepage Showcase', icon: Image, component: ManageShowcaseImages },
    { value: 'whyChoose', label: 'Why Choose', icon: Image, component: ManageWhyChooseImage },
    { value: 'journey', label: 'Journey Images', icon: Image, component: ManageJourneyImages },
    { value: 'gallery', label: 'Gallery Images', icon: Image, component: ManageGallery },
    { value: 'nearbySpots', label: 'Nearby Spots', icon: MapPin, component: ManageNearbySpots },
    { value: 'testimonials', label: 'Testimonials', icon: Star, component: ManageTestimonials },
    { value: 'messages', label: 'Messages', icon: MessageSquare, component: ViewMessages },
    { value: 'content', label: 'Site Content', icon: Edit, component: ManageSiteContent },
];

const AdminDashboard = () => {
    const { toast } = useToast();
    const { signOut, user } = useAuth();
    const [loadingLogout, setLoadingLogout] = useState(false);

    const handleLogout = async () => {
        setLoadingLogout(true);
        const { error } = await signOut();
        if (error) {
            toast({
                variant: 'destructive',
                title: 'Logout Failed',
                description: 'There was a problem signing you out. Please try again.',
            });
            setLoadingLogout(false);
        } else {
             toast({
                title: 'Logged Out Successfully',
                description: 'You have been successfully logged out.',
            });
        }
    };

    return (
        <PageTransition>
            <Helmet>
                <title>Admin Dashboard | Cozy Way</title>
                <meta
                    name="description"
                    content="Admin dashboard for managing Cozy Way, a best homestay in Dharamshala."
                />
                <meta
                    name="keywords"
                    content="best homestay in dharamshala, rooms in dharamshala, homestay in dharamshala, stay in dharamshala, dharamshala homestay, dharamshala rooms, cozy way dharamshala, dharmashala homestay, rooms in dharmashala"
                />
            </Helmet>
            <div className="container mx-auto px-3 py-6 sm:px-4 sm:py-10 lg:py-16">
                 <motion.div 
                    initial={{opacity: 0, y: -20}} 
                    animate={{opacity: 1, y: 0}} 
                    transition={{duration: 0.5}}
                    className="mb-5 flex flex-col items-stretch gap-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-5 backdrop-blur-xl sm:mb-8 sm:flex-row sm:items-center sm:justify-between sm:rounded-3xl sm:px-8 sm:py-6"
                 >
                    <div className="min-w-0">
                        <p className="text-[10px] uppercase tracking-[0.28em] text-white/60 sm:text-xs sm:tracking-[0.35em]">Admin Console</p>
                        <h1 className="mt-2 text-3xl font-bold text-white sm:mt-3 sm:text-5xl font-display">Dashboard</h1>
                        <p className="mt-1 truncate text-sm text-white/70 sm:text-lg">Welcome, {user?.email || 'Admin'}!</p>
                    </div>
                    <Button
                        onClick={handleLogout}
                        variant="destructive"
                        disabled={loadingLogout}
                        className="h-11 w-full rounded-xl sm:w-auto"
                    >
                        {loadingLogout ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />} 
                        Logout
                    </Button>
                </motion.div>

                <Tabs defaultValue="rooms" className="w-full">
                    <div className="-mx-3 overflow-x-auto px-3 pb-2 sm:mx-0 sm:overflow-visible sm:px-0">
                        <TabsList className="admin-tabs-scroll !flex h-auto min-w-max justify-start gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-xl sm:!grid sm:min-w-0 sm:w-full sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-10">
                            {adminTabs.map(({ value, label, icon: Icon }) => (
                                <TabsTrigger
                                    key={value}
                                    value={value}
                                    className="h-11 min-w-[8.75rem] gap-2 rounded-xl px-3 text-xs text-white/75 data-[state=active]:bg-white data-[state=active]:text-[#1f1b16] sm:min-w-0 sm:text-sm"
                                >
                                    <Icon className="h-4 w-4 shrink-0" />
                                    <span className="truncate">{label}</span>
                                </TabsTrigger>
                            ))}
                        </TabsList>
                    </div>
                    {adminTabs.map(({ value, component: Component }) => (
                        <TabsContent key={value} value={value} className="mt-4 sm:mt-6">
                            <Component />
                        </TabsContent>
                    ))}
                </Tabs>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
