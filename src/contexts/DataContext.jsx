
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/lib/customSupabaseClient';
import { SITE_CONTENT_DEFAULTS } from '@/lib/siteContent';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');
    const [rooms, setRooms] = useState([]);
    const [galleryImages, setGalleryImages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [siteContent, setSiteContent] = useState({});
    const [amenities, setAmenities] = useState([]);
    const [nearbySpots, setNearbySpots] = useState([]);
    const [testimonials, setTestimonials] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const [
                roomsRes, 
                galleryRes, 
                contentRes,
                amenitiesRes,
                nearbySpotsRes,
                testimonialsRes,
                adminMessagesRes,
                adminTestimonialsRes
            ] = await Promise.all([
                supabase.from('rooms').select('*, room_amenities(amenities(id, name, icon_name)), room_images(id, image_url, image_alt)').order('created_at', { ascending: false }),
                supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
                supabase.from('site_content').select('*'),
                supabase.from('amenities').select('*').order('name'),
                supabase.from('nearby_spots').select('*').order('created_at', { ascending: false }),
                supabase.from('testimonials').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
                isAdminRoute
                    ? supabase.from('messages').select('*').order('created_at', { ascending: false })
                    : Promise.resolve({ data: [], error: null }),
                isAdminRoute
                    ? supabase.from('testimonials').select('*').order('created_at', { ascending: false })
                    : Promise.resolve({ data: null, error: null })
            ]);

            if (roomsRes.error) throw roomsRes.error;
            const roomsData = roomsRes.data.map(room => ({
                ...room,
                amenities: room.room_amenities.map(ra => ra.amenities),
                images: room.room_images
            }));
            setRooms(roomsData);

            if (galleryRes.error) throw galleryRes.error;
            setGalleryImages(galleryRes.data);

            if (adminMessagesRes.error) throw adminMessagesRes.error;
            setMessages(adminMessagesRes.data || []);

            if (contentRes.error) throw contentRes.error;
            const contentMap = contentRes.data.reduce((acc, item) => {
                acc[item.element_key] = item.content;
                return acc;
            }, {});
            setSiteContent({ ...SITE_CONTENT_DEFAULTS, ...contentMap });
            
            if (amenitiesRes.error) throw amenitiesRes.error;
            setAmenities(amenitiesRes.data);

            if (nearbySpotsRes.error) throw nearbySpotsRes.error;
            setNearbySpots(nearbySpotsRes.data);

            if (testimonialsRes.error) throw testimonialsRes.error;
            if (adminTestimonialsRes.error) throw adminTestimonialsRes.error;
            setTestimonials(adminTestimonialsRes.data || testimonialsRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, [isAdminRoute]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const value = {
        rooms,
        galleryImages,
        messages,
        siteContent,
        amenities,
        nearbySpots,
        testimonials,
        loading,
        refreshData: fetchData,
    };

    return (
        <DataContext.Provider value={value}>
            {children}
        </DataContext.Provider>
    );
};
