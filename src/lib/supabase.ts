import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      agencies: {
        Row: {
          id: string;
          email: string;
          company_name: string;
          logo_url: string | null;
          subscription_status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          company_name: string;
          logo_url?: string | null;
          subscription_status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          company_name?: string;
          logo_url?: string | null;
          subscription_status?: string;
          updated_at?: string;
        };
      };
      clients: {
        Row: {
          id: string;
          agency_id: string;
          business_name: string;
          service_type: string;
          location: string;
          phone: string | null;
          email: string | null;
          website_url: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          agency_id: string;
          business_name: string;
          service_type: string;
          location: string;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          agency_id?: string;
          business_name?: string;
          service_type?: string;
          location?: string;
          phone?: string | null;
          email?: string | null;
          website_url?: string | null;
          status?: string;
          updated_at?: string;
        };
      };
      projects: {
        Row: {
          id: string;
          client_id: string;
          agency_id: string;
          current_phase: number;
          phase_1_progress: number;
          phase_2_progress: number;
          phase_3_progress: number;
          phase_4_progress: number;
          phase_5_progress: number;
          phase_6_progress: number;
          started_at: string;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
      tasks: {
        Row: {
          id: string;
          project_id: string;
          phase: number;
          title: string;
          description: string | null;
          completed: boolean;
          completed_at: string | null;
          assigned_to: string | null;
          order_index: number;
          created_at: string;
          updated_at: string;
        };
      };
      competitors: {
        Row: {
          id: string;
          client_id: string;
          agency_id: string;
          business_name: string;
          website_url: string;
          review_count: number;
          average_rating: number | null;
          strengths: string | null;
          weaknesses: string | null;
          ranking_position: number | null;
          analyzed_at: string;
          created_at: string;
        };
      };
      keywords: {
        Row: {
          id: string;
          client_id: string;
          agency_id: string;
          keyword: string;
          search_volume: number | null;
          difficulty: string;
          commercial_intent: string;
          keyword_type: string;
          target_page: string | null;
          current_ranking: number | null;
          priority: number;
          created_at: string;
          updated_at: string;
        };
      };
      content_library: {
        Row: {
          id: string;
          client_id: string;
          agency_id: string;
          title: string;
          content_type: string;
          content_body: string;
          meta_title: string | null;
          meta_description: string | null;
          target_keywords: string[] | null;
          status: string;
          word_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
      };
    };
  };
};
