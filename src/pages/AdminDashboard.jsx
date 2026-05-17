
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
            <div className="container mx-auto px-4 py-16">
                 <motion.div 
                    initial={{opacity: 0, y: -20}} 
                    animate={{opacity: 1, y: 0}} 
                    transition={{duration: 0.5}}
                    className="flex flex-wrap justify-between items-center mb-10 gap-4 surface-card px-6 sm:px-8 py-6 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl"
                 >
                    <div>
                        <p className="text-xs uppercase tracking-[0.35em] text-white/60">Admin Console</p>
                        <h1 className="text-4xl sm:text-5xl font-bold font-display text-white mt-3">Dashboard</h1>
                        <p className="text-base sm:text-lg text-white/70">Welcome, {user?.email || 'Admin'}!</p>
                    </div>
                    <Button onClick={handleLogout} variant="destructive" disabled={loadingLogout}>
                        {loadingLogout ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />} 
                        Logout
                    </Button>
                </motion.div>

                <Tabs defaultValue="rooms" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 md:grid-cols-10 bg-white/5 border border-white/10 rounded-2xl h-auto flex-wrap p-2 backdrop-blur-xl">
                        <TabsTrigger value="rooms"><BedDouble className="mr-2 h-4 w-4" />Rooms</TabsTrigger>
                        <TabsTrigger value="amenities"><Sparkles className="mr-2 h-4 w-4" />Amenities</TabsTrigger>
                        <TabsTrigger value="showcase"><Image className="mr-2 h-4 w-4" />Homepage Showcase</TabsTrigger>
                        <TabsTrigger value="whyChoose"><Image className="mr-2 h-4 w-4" />Why Choose</TabsTrigger>
                        <TabsTrigger value="journey"><Image className="mr-2 h-4 w-4" />Journey Images</TabsTrigger>
                        <TabsTrigger value="gallery"><Image className="mr-2 h-4 w-4" />Gallery Images</TabsTrigger>
                        <TabsTrigger value="nearbySpots"><MapPin className="mr-2 h-4 w-4" />Nearby Spots</TabsTrigger>
                        <TabsTrigger value="testimonials"><Star className="mr-2 h-4 w-4" />Testimonials</TabsTrigger>
                        <TabsTrigger value="messages"><MessageSquare className="mr-2 h-4 w-4" />Messages</TabsTrigger>
                        <TabsTrigger value="content"><Edit className="mr-2 h-4 w-4" />Site Content</TabsTrigger>
                    </TabsList>
                    <TabsContent value="rooms" className="mt-6">
                        <ManageRooms />
                    </TabsContent>
                    <TabsContent value="amenities" className="mt-6">
                        <ManageAmenities />
                    </TabsContent>
                    <TabsContent value="showcase" className="mt-6">
                        <ManageShowcaseImages />
                    </TabsContent>
                    <TabsContent value="whyChoose" className="mt-6">
                        <ManageWhyChooseImage />
                    </TabsContent>
                    <TabsContent value="journey" className="mt-6">
                        <ManageJourneyImages />
                    </TabsContent>
                    <TabsContent value="gallery" className="mt-6">
                        <ManageGallery />
                    </TabsContent>
                    <TabsContent value="nearbySpots" className="mt-6">
                        <ManageNearbySpots />
                    </TabsContent>
                    <TabsContent value="testimonials" className="mt-6">
                        <ManageTestimonials />
                    </TabsContent>
                    <TabsContent value="messages" className="mt-6">
                        <ViewMessages />
                    </TabsContent>
                    <TabsContent value="content" className="mt-6">
                        <ManageSiteContent />
                    </TabsContent>
                </Tabs>
            </div>
        </PageTransition>
    );
};

export default AdminDashboard;
