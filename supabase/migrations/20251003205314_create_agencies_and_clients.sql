/*
  # Local Domination Platform - Core Schema

  ## Overview
  This migration creates the foundational tables for the Local Domination Platform,
  an agency-focused website builder and SEO management system for local service businesses.

  ## New Tables

  ### 1. agencies
  Stores agency account information and settings
  - `id` (uuid, primary key) - Unique agency identifier
  - `email` (text, unique) - Agency primary email
  - `company_name` (text) - Agency business name
  - `logo_url` (text, nullable) - Agency branding logo
  - `subscription_status` (text) - Subscription state (active, trial, cancelled)
  - `created_at` (timestamptz) - Account creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 2. clients
  Stores client business information managed by agencies
  - `id` (uuid, primary key) - Unique client identifier
  - `agency_id` (uuid, foreign key) - Reference to owning agency
  - `business_name` (text) - Client business name
  - `service_type` (text) - Type of service (plumbing, HVAC, etc.)
  - `location` (text) - Primary business location
  - `phone` (text, nullable) - Business phone number
  - `email` (text, nullable) - Business email
  - `website_url` (text, nullable) - Current or new website URL
  - `status` (text) - Project status (active, completed, paused)
  - `created_at` (timestamptz) - Client creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 3. projects
  Tracks progress through the 6-phase blueprint for each client
  - `id` (uuid, primary key) - Unique project identifier
  - `client_id` (uuid, foreign key) - Reference to client
  - `agency_id` (uuid, foreign key) - Reference to agency
  - `current_phase` (integer) - Current blueprint phase (1-6)
  - `phase_1_progress` (integer) - Phase 1 completion percentage
  - `phase_2_progress` (integer) - Phase 2 completion percentage
  - `phase_3_progress` (integer) - Phase 3 completion percentage
  - `phase_4_progress` (integer) - Phase 4 completion percentage
  - `phase_5_progress` (integer) - Phase 5 completion percentage
  - `phase_6_progress` (integer) - Phase 6 completion percentage
  - `started_at` (timestamptz) - Project start date
  - `completed_at` (timestamptz, nullable) - Project completion date
  - `created_at` (timestamptz) - Record creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ### 4. tasks
  Individual checklist items within each phase
  - `id` (uuid, primary key) - Unique task identifier
  - `project_id` (uuid, foreign key) - Reference to project
  - `phase` (integer) - Which phase this task belongs to (1-6)
  - `title` (text) - Task name/description
  - `description` (text, nullable) - Detailed task instructions
  - `completed` (boolean) - Task completion status
  - `completed_at` (timestamptz, nullable) - Completion timestamp
  - `assigned_to` (text, nullable) - Team member assigned
  - `order_index` (integer) - Display order within phase
  - `created_at` (timestamptz) - Task creation timestamp
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on all tables
  - Agencies can only access their own data
  - All operations require authentication
  - Cascade deletes to maintain referential integrity
*/

CREATE TABLE IF NOT EXISTS agencies (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  company_name text NOT NULL,
  logo_url text,
  subscription_status text DEFAULT 'trial',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own data"
  ON agencies FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Agencies can update own data"
  ON agencies FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Anyone can create agency"
  ON agencies FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE TABLE IF NOT EXISTS clients (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  business_name text NOT NULL,
  service_type text NOT NULL,
  location text NOT NULL,
  phone text,
  email text,
  website_url text,
  status text DEFAULT 'active',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE clients ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own clients"
  ON clients FOR SELECT
  TO authenticated
  USING (agency_id = auth.uid());

CREATE POLICY "Agencies can create clients"
  ON clients FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can update own clients"
  ON clients FOR UPDATE
  TO authenticated
  USING (agency_id = auth.uid())
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can delete own clients"
  ON clients FOR DELETE
  TO authenticated
  USING (agency_id = auth.uid());

CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id uuid NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  agency_id uuid NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  current_phase integer DEFAULT 1,
  phase_1_progress integer DEFAULT 0,
  phase_2_progress integer DEFAULT 0,
  phase_3_progress integer DEFAULT 0,
  phase_4_progress integer DEFAULT 0,
  phase_5_progress integer DEFAULT 0,
  phase_6_progress integer DEFAULT 0,
  started_at timestamptz DEFAULT now(),
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view own projects"
  ON projects FOR SELECT
  TO authenticated
  USING (agency_id = auth.uid());

CREATE POLICY "Agencies can create projects"
  ON projects FOR INSERT
  TO authenticated
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can update own projects"
  ON projects FOR UPDATE
  TO authenticated
  USING (agency_id = auth.uid())
  WITH CHECK (agency_id = auth.uid());

CREATE POLICY "Agencies can delete own projects"
  ON projects FOR DELETE
  TO authenticated
  USING (agency_id = auth.uid());

CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase integer NOT NULL,
  title text NOT NULL,
  description text,
  completed boolean DEFAULT false,
  completed_at timestamptz,
  assigned_to text,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Agencies can view tasks for own projects"
  ON tasks FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.agency_id = auth.uid()
    )
  );

CREATE POLICY "Agencies can create tasks for own projects"
  ON tasks FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.agency_id = auth.uid()
    )
  );

CREATE POLICY "Agencies can update tasks for own projects"
  ON tasks FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.agency_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.agency_id = auth.uid()
    )
  );

CREATE POLICY "Agencies can delete tasks for own projects"
  ON tasks FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = tasks.project_id
      AND projects.agency_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_clients_agency ON clients(agency_id);
CREATE INDEX IF NOT EXISTS idx_projects_client ON projects(client_id);
CREATE INDEX IF NOT EXISTS idx_projects_agency ON projects(agency_id);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
