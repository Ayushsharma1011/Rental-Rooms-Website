
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/customSupabaseClient';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
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
            const adminSupabase = supabase;

            const [
                roomsRes, 
                galleryRes, 
                messagesRes, 
                contentRes,
                amenitiesRes,
                nearbySpotsRes,
                testimonialsRes,
                allTestimonialsRes
            ] = await Promise.all([
                supabase.from('rooms').select('*, room_amenities(amenities(id, name, icon_name)), room_images(id, image_url, image_alt)').order('created_at', { ascending: false }),
                supabase.from('gallery_images').select('*').order('created_at', { ascending: false }),
                supabase.from('messages').select('*').order('created_at', { ascending: false }),
                supabase.from('site_content').select('*'),
                supabase.from('amenities').select('*').order('name'),
                supabase.from('nearby_spots').select('*').order('created_at', { ascending: false }),
                supabase.from('testimonials').select('*').eq('status', 'approved').order('created_at', { ascending: false }),
                adminSupabase.from('testimonials').select('*').order('created_at', { ascending: false })
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

            if (messagesRes.error) throw messagesRes.error;
            setMessages(messagesRes.data);

            if (contentRes.error) throw contentRes.error;
            const contentMap = contentRes.data.reduce((acc, item) => {
                acc[item.element_key] = item.content;
                return acc;
            }, {});
            setSiteContent(contentMap);
            
            if (amenitiesRes.error) throw amenitiesRes.error;
            setAmenities(amenitiesRes.data);

            if (nearbySpotsRes.error) throw nearbySpotsRes.error;
            setNearbySpots(nearbySpotsRes.data);

            if (testimonialsRes.error) throw testimonialsRes.error;
            if (allTestimonialsRes.error) throw allTestimonialsRes.error;
            setTestimonials(allTestimonialsRes.data);

        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setLoading(false);
        }
    }, []);

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
