import { supabase } from '../lib/supabase';
import { Experience } from '../components/ExperienceCard';

export interface SupabaseExperience {
  id: string;
  title: string;
  description: string;
  full_description?: string;
  duration: string;
  price: string;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  schedule?: string;
  requirements?: string;
  category: string;
  image: string;
  accessibility?: string;
  rating?: number;
  review_count?: number;
  category_name?: string;
  group_size?: string;
  includes?: string[];
  itinerary?: { time: string; activity: string }[];
  status: 'active' | 'inactive' | 'draft';
  created_by?: string;
  created_at: string;
  updated_at: string;
}

// Convert Supabase experience to frontend Experience type
const mapSupabaseExperience = (dbExperience: SupabaseExperience): Experience => ({
  id: dbExperience.id,
  title: dbExperience.title,
  description: dbExperience.description,
  fullDescription: dbExperience.full_description,
  duration: dbExperience.duration,
  price: dbExperience.price,
  location: dbExperience.location,
  country: dbExperience.country,
  state: dbExperience.state,
  city: dbExperience.city,
  schedule: dbExperience.schedule,
  requirements: dbExperience.requirements,
  category: dbExperience.category,
  image: dbExperience.image,
  accessibility: dbExperience.accessibility,
  rating: dbExperience.rating,
  reviewCount: dbExperience.review_count,
  categoryName: dbExperience.category_name,
  groupSize: dbExperience.group_size,
  includes: dbExperience.includes,
  itinerary: dbExperience.itinerary,
});

// Get all active experiences
export const getExperiences = async (): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mapSupabaseExperience) || [];
  } catch (error) {
    console.error('Error fetching experiences:', error);
    throw error;
  }
};

// Get experience by ID
export const getExperienceById = async (id: string): Promise<Experience | null> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('id', id)
      .eq('status', 'active')
      .single();

    if (error) throw error;

    return data ? mapSupabaseExperience(data) : null;
  } catch (error) {
    console.error('Error fetching experience:', error);
    return null;
  }
};

// Get experiences by category
export const getExperiencesByCategory = async (category: string): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('category', category)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mapSupabaseExperience) || [];
  } catch (error) {
    console.error('Error fetching experiences by category:', error);
    throw error;
  }
};

// Get experiences by state/region
export const getExperiencesByState = async (state: string): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('state', state)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mapSupabaseExperience) || [];
  } catch (error) {
    console.error('Error fetching experiences by state:', error);
    throw error;
  }
};

// Get experiences by city
export const getExperiencesByCity = async (city: string): Promise<Experience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .eq('city', city)
      .eq('status', 'active')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data?.map(mapSupabaseExperience) || [];
  } catch (error) {
    console.error('Error fetching experiences by city:', error);
    throw error;
  }
};

// Admin functions
export const getAllExperiences = async (): Promise<SupabaseExperience[]> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    return data || [];
  } catch (error) {
    console.error('Error fetching all experiences:', error);
    throw error;
  }
};

export const createExperience = async (experience: Partial<SupabaseExperience>): Promise<SupabaseExperience> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .insert([{
        title: experience.title,
        description: experience.description,
        full_description: experience.full_description,
        duration: experience.duration,
        price: experience.price,
        location: experience.location,
        schedule: experience.schedule,
        requirements: experience.requirements,
        category: experience.category,
        image: experience.image,
        accessibility: experience.accessibility,
        rating: experience.rating || 0,
        review_count: experience.review_count || 0,
        category_name: experience.category_name,
        group_size: experience.group_size,
        includes: experience.includes,
        itinerary: experience.itinerary,
        status: experience.status || 'draft',
      }])
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error creating experience:', error);
    throw error;
  }
};

export const updateExperience = async (id: string, updates: Partial<SupabaseExperience>): Promise<SupabaseExperience> => {
  try {
    const { data, error } = await supabase
      .from('experiences')
      .update({
        ...updates,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    return data;
  } catch (error) {
    console.error('Error updating experience:', error);
    throw error;
  }
};

export const deleteExperience = async (id: string): Promise<void> => {
  try {
    const { error } = await supabase
      .from('experiences')
      .delete()
      .eq('id', id);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting experience:', error);
    throw error;
  }
};