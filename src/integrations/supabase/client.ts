
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bgnngzkkpeifzayrjvbz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm5nemtrcGVpZnpheXJqdmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDQ5ODcsImV4cCI6MjA1ODkyMDk4N30.5JDoF8xK3e1fLv14TUZ4tTrbE4llP_6fqtg0PY-dYlw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);
export const customSupabase = supabase; // Alias for backward compatibility

// Helper function for safe data access
export const safeDataAccess = <T,>(value: any, defaultValue: T): T => {
  return value !== undefined && value !== null ? value : defaultValue;
};

// Type definitions for database tables
export interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string | null;
  available: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url: string | null;
  order_number: number;
  active: boolean;
  category: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  name: string;
  description: string | null;
  event_date: string;
  start_time: string | null;
  end_time: string | null;
  location: string | null;
  place: string;
  category: string | null;
  image_url: string | null;
  created_at?: string;
  updated_at?: string;
  // Additional properties needed by Events.tsx
  title?: string;
  date?: string;
  time?: string | null;
  image?: string;
  past?: boolean;
  registrationLink?: string;
}

export interface ScheduleDay {
  id: string;
  day_name: string;
  date: string;
  order_number: number;
  events?: ScheduleEvent[]; // Make events available in ScheduleDay
  created_at?: string;
  updated_at?: string;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  category: string; // Changed from union type to string to match database schema
  day_id: string | null;
  order_number: number;
  created_at?: string;
  updated_at?: string;
}

export interface PageContent {
  id: string;
  page_id: string;
  content: Json;
  created_at?: string;
  updated_at?: string;
}

export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

// Function to handle file uploads
export const uploadFileToSupabase = async (file: File, bucketName: string, path: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);
    
    return urlData.publicUrl;
  } catch (error) {
    console.error('File upload error:', error);
    return null;
  }
};
