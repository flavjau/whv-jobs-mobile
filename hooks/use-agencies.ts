import { useQuery } from '@tanstack/react-query';
import { supabase } from '../lib/supabase';
import { Agency } from '../lib/types';

type AgencyFilters = {
  state?: string;
  category?: string;
  is88Days?: boolean;
  search?: string;
};

async function fetchAgencies(filters: AgencyFilters): Promise<Agency[]> {
  let query = supabase
    .from('Agency')
    .select('*')
    .eq('isActive', true)
    .gt('confidenceScore', 0)
    .order('confidenceScore', { ascending: false });

  if (filters.state) {
    query = query.eq('state', filters.state);
  }
  if (filters.category) {
    query = query.eq('category', filters.category);
  }
  if (filters.is88Days) {
    query = query.eq('is88DaysEligible', true);
  }
  if (filters.search) {
    query = query.ilike('name', `%${filters.search}%`);
  }

  const { data, error } = await query;
  if (error) throw error;
  return (data as Agency[]) ?? [];
}

export function useAgencies(filters: AgencyFilters = {}) {
  return useQuery({
    queryKey: ['agencies', filters],
    queryFn: () => fetchAgencies(filters),
    staleTime: 1000 * 60 * 5, // 5 minutes
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
