'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import {
  GetProfileResponse,
  UpdateProfileData,
  UpdateProfileResponse,
  UploadAvatarResponse,
} from '@/infrastructure/interfaces/profile-actions.interface';

export const getProfile = async (): Promise<GetProfileResponse> => {
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

export const updateProfile = async (userId: string, updates: UpdateProfileData): Promise<UpdateProfileResponse> => {
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

export const uploadAvatar = async (userId: string, formData: FormData): Promise<UploadAvatarResponse> => {
  try {
    const supabase = await createClient();

    const file = formData.get('avatar') as File;

    if (!file) {
      return { success: false, message: 'No file provided' };
    }

    // Generate unique filename with user ID folder
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;

    // Upload new avatar
    const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
      cacheControl: '3600',
    });

    if (uploadError) {
      return { success: false, message: `Upload failed: ${uploadError.message}` };
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
      return { success: false, message: `Profile update failed: ${updateError.message}` };
    }

    revalidatePath('/profile');

    return { success: true, data: { avatarUrl: publicUrl }, message: null };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Failed to upload avatar';
    return { success: false, message: errorMessage };
  }
};
