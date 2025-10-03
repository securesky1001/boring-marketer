/*
  # Competitor Analysis and Keyword Research Tables

  ## Overview
  This migration adds tables for competitor analysis and keyword research features.

  ## New Tables

  ### 1. competitors
  Stores competitor information for client analysis
  - `id` (uuid, primary key) - Unique competitor identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `agency_id` (uuid, foreign key) - Reference to agency
  - `business_name` (text) - Competitor business name
  - `website_url` (text) - Competitor website URL
  - `review_count` (integer) - Number of reviews
  - `average_rating` (numeric) - Average review rating
  - `strengths` (text, nullable) - Identified strengths
  - `weaknesses` (text, nullable) - Identified weaknesses
  - `ranking_position` (integer, nullable) - Search ranking position
  - `analyzed_at` (timestamptz) - Analysis timestamp
  - `created_at` (timestamptz) - Record creation timestamp

  ### 2. keywords
  Stores keyword research results and tracking
  - `id` (uuid, primary key) - Unique keyword identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `agency_id` (uuid, foreign key) - Reference to agency
  - `keyword` (text) - The keyword phrase
  - `search_volume` (integer, nullable) - Monthly search volume
  - `difficulty` (text) - Ranking difficulty (easy, medium, hard)
  - `commercial_intent` (text) - Intent level (low, medium, high)
  - `keyword_type` (text) - Type (emergency, service, location, etc.)
  - `target_page` (text, nullable) - Which page should target this keyword
  - `current_ranking` (integer, nullable) - Current ranking position
  - `priority` (integer) - Priority score 1-10
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. content_library
  Stores generated content for pages and blog posts
  - `id` (uuid, primary key) - Unique content identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `agency_id` (uuid, foreign key) - Reference to agency
  - `title` (text) - Content title
  - `content_type` (text) - Type (service_page, location_page, blog_post, faq)
  - `content_body` (text) - The actual content
  - `meta_title` (text, nullable) - SEO meta title
  - `meta_description` (text, nullable) - SEO meta description
  - `target_keywords` (text[], nullable) - Array of target keywords
  - `status` (text) - Status (draft, review, approved, published)
  - `word_count` (integer) - Content word count
  - `published_at` (timestamptz, nullable) - Publication timestamp
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Agencies can only access their own data
  - All operations require authentication
*/

CREATE TABLE IF NOT EXISTS competitors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  website_url text NOT NULL,
  review_count integer DEFAULT 0,
  average_rating numeric(3,2),
  strengths text,
  weaknesses text,
  ranking_position integer,
  analyzed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE competitors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own competitors"
  ON competitors FOR SELECT
  TO authenticated
  USING (agency_id = auth.uid());

CREATE POLICY "Agencies can create competitors"
  ON competitors FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can update own competitors"
  ON competitors FOR UPDATE
  TO authenticated
  USING (agency_id = auth.uid())
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can delete own competitors"
  ON competitors FOR DELETE
  TO authenticated
  USING (agency_id = auth.uid());

CREATE TABLE IF NOT EXISTS keywords (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  keyword text NOT NULL,
  search_volume integer,
  difficulty text DEFAULT 'medium',
  commercial_intent text DEFAULT 'medium',
  keyword_type text DEFAULT 'service',
  target_page text,
  current_ranking integer,
  priority integer DEFAULT 5,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE keywords ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own keywords"
  ON keywords FOR SELECT
  TO authenticated
  USING (agency_id = auth.uid());

CREATE POLICY "Agencies can create keywords"
  ON keywords FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can update own keywords"
  ON keywords FOR UPDATE
  TO authenticated
  USING (agency_id = auth.uid())
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can delete own keywords"
  ON keywords FOR DELETE
  TO authenticated
  USING (agency_id = auth.uid());

CREATE TABLE IF NOT EXISTS content_library (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  title text NOT NULL,
  content_type text NOT NULL,
  content_body text NOT NULL,
  meta_title text,
  meta_description text,
  target_keywords text[],
  status text DEFAULT 'draft',
  word_count integer DEFAULT 0,
  published_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE content_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own content"
  ON content_library FOR SELECT
  TO authenticated
  USING (agency_id = auth.uid());

CREATE POLICY "Agencies can create content"
  ON content_library FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can update own content"
  ON content_library FOR UPDATE
  TO authenticated
  USING (agency_id = auth.uid())
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can delete own content"
  ON content_library FOR DELETE
  TO authenticated
  USING (agency_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_competitors_client ON competitors(client_id);
CREATE INDEX IF NOT EXISTS idx_competitors_agency ON competitors(agency_id);
CREATE INDEX IF NOT EXISTS idx_keywords_client ON keywords(client_id);
CREATE INDEX IF NOT EXISTS idx_keywords_agency ON keywords(agency_id);
CREATE INDEX IF NOT EXISTS idx_content_client ON content_library(client_id);
CREATE INDEX IF NOT EXISTS idx_content_agency ON content_library(agency_id);
CREATE INDEX IF NOT EXISTS idx_content_status ON content_library(status);
