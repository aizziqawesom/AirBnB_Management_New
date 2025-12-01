import { createClient } from '@/lib/supabase/server';
import { getCurrentOrganization } from '@/lib/utils/organization';
import type { Property } from '@/lib/types/property';

export async function getProperties(): Promise<Property[]> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    throw new Error('No organization found');
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('organization_id', organization.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching properties:', error);
    throw error;
  }

  return data as Property[];
}

export async function getProperty(id: string): Promise<Property | null> {
  const supabase = await createClient();
  const organization = await getCurrentOrganization(supabase);

  if (!organization) {
    return null;
  }

  const { data, error } = await supabase
    .from('properties')
    .select('*')
    .eq('id', id)
    .eq('organization_id', organization.id)
    .single();

  if (error || !data) {
    return null;
  }

  return data as Property;
}
