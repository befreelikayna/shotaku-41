
// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://bgnngzkkpeifzayrjvbz.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJnbm5nemtrcGVpZnpheXJqdmJ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDMzNDQ5ODcsImV4cCI6MjA1ODkyMDk4N30.5JDoF8xK3e1fLv14TUZ4tTrbE4llP_6fqtg0PY-dYlw";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Enable realtime for all tables we use in admin panel
const channel = supabase.channel('admin-panel-changes')
  // Realtime for slider images
  .on('postgres_changes', { 
    event: '*', 
    schema: 'public', 
    table: 'slider_images' 
  }, (payload) => {
    console.log('Change received on slider_images!', payload);
  })
  // Add more tables here when they're created in Supabase
  .subscribe();

// Export the channel for potential cleanup
export const realtimeChannel = channel;
