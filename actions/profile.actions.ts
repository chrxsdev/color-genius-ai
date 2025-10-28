'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';

interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
  updated_at: string | null;
}

interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

export const getProfile = async (): Promise<{ data: ProfileData | null; error: string | null }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { data: null, error: 'Not authenticated' };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (profileError) {
      return { data: null, error: profileError.message };
    }

    return {
      data: {
        id: profile.id,
        full_name: profile.full_name,
        avatar_url: profile.avatar_url,
        created_at: profile.created_at,
        updated_at: profile.updated_at,
      },
      error: null,
    };
  } catch (error) {
    return { data: null, error: 'Failed to fetch profile' };
  }
};

export const updateProfile = async (
  updates: UpdateProfileData
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return { success: false, error: 'Not authenticated' };
    }

    const dbUpdateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.full_name !== undefined) {
      dbUpdateData.full_name = updates.full_name;
    }

    if (updates.avatar_url !== undefined) {
      dbUpdateData.avatar_url = updates.avatar_url;
    }

    const { error: updateError } = await supabase.from('profiles').update(dbUpdateData).eq('id', user.id);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/profile');

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Failed to update profile' };
  }
};
