# Upload Flow Troubleshooting Report

**Date:** 2026-05-16

## Context
- Screen: `app/(root)/onboarding/full-length-pics.tsx`
- Feature: Upload 2 full-length photos from gallery to Supabase Storage during onboarding.

## Timeline
1. Implemented image picker & Supabase upload logic using `expo-image-picker` + `createSupabaseClient`.
2. Encountered `Network request failed` error when uploading — caused by using `fetch(asset.uri)` to convert local `file://` URIs to blobs on React Native.
3. Replaced the fetch+blob approach with a `FormData` upload (React Native compatible) to resolve network failure.
4. After fix, encountered `new row violates row-level security policy` from Supabase Storage; bucket RLS policies missing.
5. Added Supabase Storage policies allowing authenticated users to upload & read from the `full-length-pics` bucket:
   ```sql
   CREATE POLICY "Allow authenticated uploads"
   ON storage.objects
   FOR INSERT
   TO authenticated
   WITH CHECK (bucket_id = 'full-length-pics');

   CREATE POLICY "Allow authenticated reads"
   ON storage.objects
   FOR SELECT
   TO authenticated
   USING (bucket_id = 'full-length-pics');
   ```
6. Verified Clerk JWT template includes `aud: authenticated` and `role: authenticated` (Clerk auto-adds `sub` claim).
7. Confirmed Android permission `READ_MEDIA_IMAGES` added in `app.json` for gallery access.

## Current Status
- Image selection and Supabase upload logic implemented with loading & error handling.
- Storage policies in place for authenticated uploads.
- Next manual verification: run app, select two images, ensure files appear under `full-length-pics/<userId>/` in Supabase Storage.

## Notes
- `user_profiles` table schema + RLS saved in `supabase/schema.sql` ready for onboarding completion flow.
- Supabase bucket must remain public if unauthenticated read URLs are required; uploads still require authenticated policy.
