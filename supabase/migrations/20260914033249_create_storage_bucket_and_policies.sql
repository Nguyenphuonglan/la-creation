/*
# Create Storage bucket for project images

## Overview
Creates a public Storage bucket "projects" for uploading project images (main images + gallery images).

## Changes
1. Storage bucket "projects" (public) — stores all project images uploaded from the admin page.
2. Storage policies:
   - Public read: anyone can view images (anon + authenticated).
   - Authenticated upload/update/delete: only logged-in admin users can manage images.

## Security
- Bucket is public so website visitors can view images.
- Only authenticated users can upload, update, or delete files.
- This pairs with the admin page which requires Supabase auth login.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('projects', 'projects', true)
ON CONFLICT (id) DO NOTHING;

-- Public read access for project images
DROP POLICY IF EXISTS "public_read_project_images" ON storage.objects;
CREATE POLICY "public_read_project_images" ON storage.objects
  FOR SELECT
  TO anon, authenticated
  USING (bucket_id = 'projects');

-- Authenticated can upload project images
DROP POLICY IF EXISTS "auth_upload_project_images" ON storage.objects;
CREATE POLICY "auth_upload_project_images" ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'projects');

-- Authenticated can update project images
DROP POLICY IF EXISTS "auth_update_project_images" ON storage.objects;
CREATE POLICY "auth_update_project_images" ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'projects')
  WITH CHECK (bucket_id = 'projects');

-- Authenticated can delete project images
DROP POLICY IF EXISTS "auth_delete_project_images" ON storage.objects;
CREATE POLICY "auth_delete_project_images" ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'projects');