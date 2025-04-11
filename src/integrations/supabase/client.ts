
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bgnngzkkpeifzayrjvbz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm5nemtrcGVpZnpheXJqdmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDQ5ODcsImV4cCI6MjA1ODkyMDk4N30.5JDoF8xK3e1fLv14TUZ4tTrbE4llP_6fqtg0PY-dYlw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

// Export customSupabase as an alias for backward compatibility
export const customSupabase = supabase;

// Utility function for safely accessing data
export const safeDataAccess = <T>(value: any, defaultValue: T): T => {
  return value !== undefined && value !== null ? value : defaultValue;
};

// Common types for use throughout the application
export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Partner {
  id: string;
  name: string;
  logo_url: string;
  website_url?: string | null;
  category?: string | null;
  order_number: number;
  active: boolean;
}

export interface Ticket {
  id: string;
  name: string;
  price: number;
  description: string | null;
  available: boolean;
}

export interface PageContent {
  id: string;
  page_id: string;
  content: Json;
  created_at: string;
  updated_at: string;
}

export interface Event {
  id: string;
  name: string;
  description?: string;
  event_date: string;
  start_time?: string;
  end_time?: string;
  place: string;
  location?: string;
  category?: string;
  image_url?: string;
  // Add these properties to support Events.tsx
  title?: string;
  date?: string;
  time?: string;
  image?: string;
  registrationLink?: string;
  past?: boolean;
}

export interface ScheduleEvent {
  id: string;
  title: string;
  description: string | null;
  start_time: string;
  end_time: string;
  location: string | null;
  category: string;
  order_number: number;
}

export interface ScheduleDay {
  id: string;
  date: string;
  day_name: string;
  events: ScheduleEvent[];
}

// Function to upload files to Supabase storage
export const uploadFileToSupabase = async (file: File, bucket: string = "partners", path: string = ""): Promise<string> => {
  try {
    console.log('Uploading file to Supabase:', { file, bucket, path });
    
    const filePath = path ? path : `${Math.random().toString(36).substring(2)}_${file.name}`;
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      throw error;
    }
    
    // Get the public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);
    
    return publicUrl;
  } catch (error) {
    console.error('Error in uploadFileToSupabase:', error);
    return '';
  }
};
