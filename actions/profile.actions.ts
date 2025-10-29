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
  userId: string,
  updates: UpdateProfileData
): Promise<{ success: boolean; error: string | null }> => {
  try {
    const supabase = await createClient();

    const dbUpdateData: any = {
      updated_at: new Date().toISOString(),
    };

    if (updates.full_name !== undefined) {
      dbUpdateData.full_name = updates.full_name;
    }

    if (updates.avatar_url !== undefined) {
      dbUpdateData.avatar_url = updates.avatar_url;
    }

    const { error: updateError } = await supabase.from('profiles').update(dbUpdateData).eq('id', userId);

    if (updateError) {
      return { success: false, error: updateError.message };
    }

    revalidatePath('/profile');

    return { success: true, error: null };
  } catch (error) {
    return { success: false, error: 'Failed to update profile' };
  }
};

export const uploadAvatar = async (
  userId: string,
  formData: FormData
): Promise<{ success: boolean; avatarUrl?: string; error: string | null }> => {
  try {
    const supabase = await createClient();

    const file = formData.get('avatar') as File;

    if (!file) {
      return { success: false, error: 'No file provided' };
    }

    // Generate unique filename with user ID folder
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Delete old avatar if exists
    const { data: profile } = await supabase.from('profiles').select('avatar_url').eq('id', userId).single();

    if (profile?.avatar_url) {
      try {
        // Extract file path from URL
        const urlParts = profile.avatar_url.split('/storage/v1/object/public/avatars/');
        if (urlParts.length > 1) {
          const oldFilePath = urlParts[1];
          await supabase.storage.from('avatars').remove([oldFilePath]);
        }
      } catch (e) {
        // Ignore errors when deleting old avatar
        console.error('Failed to delete old avatar:', e);
      }
    }

    // Upload new avatar
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
      upsert: true,
    });

    if (uploadError) {
      return { success: false, error: `Upload failed: ${uploadError.message}` };
    }

    // Get public URL
    const {
      data: { publicUrl },
    } = supabase.storage.from('avatars').getPublicUrl(filePath);

    // Update profile with new avatar URL
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        avatar_url: publicUrl,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (updateError) {
      return { success: false, error: `Profile update failed: ${updateError.message}` };
    }

    revalidatePath('/profile');

    return { success: true, avatarUrl: publicUrl, error: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
    return { success: false, error: errorMessage };
  }
};
