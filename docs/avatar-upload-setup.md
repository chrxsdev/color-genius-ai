# Avatar Upload Setup Guide

## Supabase Storage Configuration

To enable avatar uploads, you need to create a storage bucket in Supabase:

### 1. Create Storage Bucket

1. Go to your Supabase Dashboard
2. Navigate to **Storage** in the left sidebar
3. Click **New Bucket**
4. Set the following:
   - **Name**: `avatars`
   - **Public**: ✅ Enable (avatars should be publicly accessible)
   - **File size limit**: 5MB (optional but recommended)
   - **Allowed MIME types**: `image/jpeg, image/png` (optional but recommended)

### 2. Set Storage Policies

Create the following RLS policies for the `avatars` bucket:

#### Policy 1: Allow authenticated users to upload their own avatar
```sql
-- Allow INSERT for authenticated users (uploading to their own folder)
CREATE POLICY "Users can upload their own avatar"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'avatars' 
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 2: Allow users to update their own avatar
```sql
-- Allow UPDATE for authenticated users
CREATE POLICY "Users can update their own avatar"
ON storage.objects FOR UPDATE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
)
WITH CHECK (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 3: Allow users to delete their own avatar
```sql
-- Allow DELETE for authenticated users
CREATE POLICY "Users can delete their own avatar"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'avatars'
  AND (storage.foldername(name))[1] = auth.uid()::text
);
```

#### Policy 4: Allow public read access
```sql
-- Allow SELECT for everyone (public read)
CREATE POLICY "Avatar images are publicly accessible"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

### Alternative: Simpler Policies (Recommended for Development)

If you're having issues with the policies above, you can use these simpler policies:

```sql
-- Allow authenticated users full access to avatars bucket
CREATE POLICY "Authenticated users can manage avatars"
ON storage.objects
TO authenticated
USING (bucket_id = 'avatars')
WITH CHECK (bucket_id = 'avatars');

-- Allow public read access
CREATE POLICY "Public read access to avatars"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'avatars');
```

**Note:** The simpler policies allow any authenticated user to manage any avatar. Use the folder-based policies (above) for production.

### 3. Verify Setup

After creating the bucket and policies:
1. Test uploading an avatar through the profile page
2. Check that the avatar displays correctly
3. Verify that the `avatar_url` field in the `profiles` table is updated

## How It Works

1. **User selects image**: Click the add icon on the avatar
2. **Validation**: Image is validated (JPG/PNG, max 5MB)
3. **Automatic upload**: Image uploads to Supabase Storage immediately
4. **Database update**: `avatar_url` field is updated with the public URL
5. **UI refresh**: Page refreshes to show the new avatar

## Features

- ✅ Automatic upload on file selection
- ✅ Client-side validation (JPG, PNG, max 5MB)
- ✅ Old avatar deletion on new upload
- ✅ Loading state during upload
- ✅ Error handling with user feedback
- ✅ Unique filename generation
- ✅ Public URL generation
