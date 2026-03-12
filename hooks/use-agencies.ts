import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Agency } from '../lib/types';

async function fetchAgencies(): Promise<Agency[]> {
  const { data, error } = await supabase
    .from('Agency')
    .select('*')
    .eq('isActive', true)
    .gt('confidenceScore', 0)
    .order('confidenceScore', { ascending: false });

  if (error) throw error;
  return (data as Agency[]) ?? [];
}

export function useAgencies() {
  return useQuery({
    queryKey: ['agencies'],
    queryFn: fetchAgencies,
    staleTime: 1000 * 60 * 5,
  });
}

export function useAgency(id: string) {
  return useQuery({
    queryKey: ['agency', id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('Agency')
        .select('*')
        .eq('id', id)
        .single();
      if (error) throw error;
      return data as Agency;
    },
    enabled: !!id,
  });
}
