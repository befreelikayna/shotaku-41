
import { useState, useEffect } from 'react';
import { customSupabase, GeneralContent } from '@/integrations/supabase/client';

export const useGeneralContent = (sectionKey: string) => {
  const [content, setContent] = useState<GeneralContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      setIsLoading(true);
      
      try {
        const { data, error } = await customSupabase
          .from('general_content')
          .select('*')
          .eq('section_key', sectionKey)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Safely cast the data to our expected type using explicit type assertion
          const typedData = data as any;
          const content: GeneralContent = {
            id: typedData.id || '',
            section_key: typedData.section_key || '',
            title: typedData.title || null,
            subtitle: typedData.subtitle || null,
            content: typedData.content || null,
            image_url: typedData.image_url || null,
            created_at: typedData.created_at,
            updated_at: typedData.updated_at
          };
          setContent(content);
        }
      } catch (err) {
        console.error(`Error fetching content for section "${sectionKey}":`, err);
        setError(err instanceof Error ? err : new Error(`Failed to fetch content for section "${sectionKey}"`));
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchContent();
    
    // Set up real-time subscription for content updates
    const channel = customSupabase
      .channel(`general-content-${sectionKey}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'general_content',
        filter: `section_key=eq.${sectionKey}`
      }, () => {
        fetchContent();
      })
      .subscribe();
    
    return () => {
      customSupabase.removeChannel(channel);
    };
  }, [sectionKey]);
  
  return { content, isLoading, error };
};
