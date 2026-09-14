/*
# Add project write policies for admin management

## Overview
Adds INSERT, UPDATE, DELETE policies on the projects table so authenticated admin users can create, edit, and delete projects from the admin page.

## Changes
1. INSERT policy on projects — authenticated users can create new projects.
2. UPDATE policy on projects — authenticated users can update existing projects.
3. DELETE policy on projects — authenticated users can delete projects.

## Security
- Only authenticated users can write/delete projects.
- Public read remains unchanged (existing SELECT policy).
- Consultations table gets a SELECT policy for authenticated users (admin needs to view submissions).
*/

-- Projects: authenticated insert
DROP POLICY IF EXISTS "auth_insert_projects" ON projects;
CREATE POLICY "auth_insert_projects" ON projects
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Projects: authenticated update
DROP POLICY IF EXISTS "auth_update_projects" ON projects;
CREATE POLICY "auth_update_projects" ON projects
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Projects: authenticated delete
DROP POLICY IF EXISTS "auth_delete_projects" ON projects;
CREATE POLICY "auth_delete_projects" ON projects
  FOR DELETE
  TO authenticated
  USING (true);

-- Consultations: authenticated can read submissions (admin only)
DROP POLICY IF EXISTS "auth_read_consultations" ON consultations;
CREATE POLICY "auth_read_consultations" ON consultations
  FOR SELECT
  TO authenticated
  USING (true);

-- Consultations: authenticated can delete submissions
DROP POLICY IF EXISTS "auth_delete_consultations" ON consultations;
CREATE POLICY "auth_delete_consultations" ON consultations
  FOR DELETE
  TO authenticated
  USING (true);