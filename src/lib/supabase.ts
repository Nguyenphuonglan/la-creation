import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Project = {
  id: string;
  title: string;
  slug: string;
  category: string;
  scale: string;
  location: string | null;
  description: string | null;
  image_url: string;
  gallery_urls: string[];
  is_highlighted: boolean;
  is_featured: boolean;
  published_at: string;
  created_at: string;
};

export type Consultation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  message: string | null;
  created_at: string;
};
