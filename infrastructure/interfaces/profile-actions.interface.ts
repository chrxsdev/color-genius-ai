export interface ProfileData {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
  email: string;
  created_at: string;
  updated_at: string | null;
}

export interface UpdateProfileData {
  full_name?: string;
  avatar_url?: string;
}

export interface GetProfileResponse {
  data: ProfileData | null;
  error: string | null;
}

export interface UpdateProfileResponse {
  success: boolean;
  error: string | null;
}

export interface UploadAvatarResponse {
  success: boolean;
  message: string | null;
  data?: { avatarUrl: string };
}
