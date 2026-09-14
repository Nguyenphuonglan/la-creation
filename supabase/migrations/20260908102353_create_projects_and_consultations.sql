/*
# Create projects and consultations tables

## Overview
Creates the core data tables for the La Creatión portfolio website:
- `projects` stores portfolio projects displayed on the homepage and projects page.
- `consultations` stores consultation form submissions from the homepage.

## New Tables

### projects
- `id` (uuid, primary key)
- `title` (text, not null) — project name
- `slug` (text, unique, not null) — URL-friendly identifier for detail pages
- `category` (text, not null) — project type (e.g. "Residential", "Commercial", "Hospitality", "Interior", "Landscape")
- `scale` (text, not null) — project scale/size description
- `location` (text) — project location
- `description` (text) — project description
- `image_url` (text, not null) — main project image URL
- `gallery_urls` (text[]) — additional images
- `is_highlighted` (boolean, default false) — whether to show in highlighted section
- `is_featured` (boolean, default false) — whether to show on homepage featured cards
- `published_at` (timestamptz, default now()) — date for ordering newest to oldest
- `created_at` (timestamptz, default now())

### consultations
- `id` (uuid, primary key)
- `name` (text, not null) — customer name
- `email` (text, not null) — customer email
- `phone` (text, not null) — customer phone number
- `message` (text) — optional message
- `created_at` (timestamptz, default now())

## Security
- RLS enabled on both tables.
- Projects: public read (anon + authenticated), no public writes (admin managed).
- Consultations: public insert (anyone can submit), no public read (admin only).
*/

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  category text NOT NULL,
  scale text NOT NULL,
  location text,
  description text,
  image_url text NOT NULL,
  gallery_urls text[] DEFAULT '{}',
  is_highlighted boolean NOT NULL DEFAULT false,
  is_featured boolean NOT NULL DEFAULT false,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS consultations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  message text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE consultations ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "public_read_projects" ON projects;
CREATE POLICY "public_read_projects" ON projects FOR SELECT
  TO anon, authenticated USING (true);

DROP POLICY IF EXISTS "public_insert_consultations" ON consultations;
CREATE POLICY "public_insert_consultations" ON consultations FOR INSERT
  TO anon, authenticated WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_projects_published_at ON projects (published_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_category ON projects (category);
CREATE INDEX IF NOT EXISTS idx_projects_is_featured ON projects (is_featured);
CREATE INDEX IF NOT EXISTS idx_projects_is_highlighted ON projects (is_highlighted);
