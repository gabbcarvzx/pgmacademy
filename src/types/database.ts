export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      tenants: {
        Row: {
          id: string;
          name: string;
          tenant_type: "personal" | "school" | "partner";
          status: "active" | "blocked";
          created_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          tenant_type?: "personal" | "school" | "partner";
          status?: "active" | "blocked";
          created_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          tenant_type?: "personal" | "school" | "partner";
          status?: "active" | "blocked";
          created_by?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      profiles: {
        Row: {
          id: string;
          tenant_id: string;
          full_name: string | null;
          email: string | null;
          role: "student" | "mentor" | "admin";
          access_status: "free" | "paid" | "blocked" | "refunded";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          tenant_id: string;
          full_name?: string | null;
          email?: string | null;
          role?: "student" | "mentor" | "admin";
          access_status?: "free" | "paid" | "blocked" | "refunded";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string;
          full_name?: string | null;
          email?: string | null;
          role?: "student" | "mentor" | "admin";
          access_status?: "free" | "paid" | "blocked" | "refunded";
          updated_at?: string;
        };
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          provider: "asaas";
          status: "pending" | "paid" | "overdue" | "blocked" | "refunded";
          access_model: "one_time";
          price_cents: number;
          currency: "BRL";
          provider_customer_id: string | null;
          provider_payment_id: string | null;
          paid_at: string | null;
          expires_at: string | null;
          metadata: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          provider?: "asaas";
          status?: "pending" | "paid" | "overdue" | "blocked" | "refunded";
          access_model?: "one_time";
          price_cents?: number;
          currency?: "BRL";
          provider_customer_id?: string | null;
          provider_payment_id?: string | null;
          paid_at?: string | null;
          expires_at?: string | null;
          metadata?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: "pending" | "paid" | "overdue" | "blocked" | "refunded";
          provider_customer_id?: string | null;
          provider_payment_id?: string | null;
          paid_at?: string | null;
          expires_at?: string | null;
          metadata?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      eligibility_assessments: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          status: "eligible" | "partial" | "ineligible";
          readiness_score: number;
          birth_date: string;
          school_year: "first" | "second" | "other";
          has_state_school_enrollment: boolean;
          has_active_siepe_enrollment: boolean;
          is_excluded_school: boolean;
          attendance_percent: number;
          portuguese_average: number;
          math_average: number;
          humanities_average: number;
          has_partial_progression: boolean;
          was_previously_selected: boolean;
          result_details: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          status: "eligible" | "partial" | "ineligible";
          readiness_score: number;
          birth_date: string;
          school_year: "first" | "second" | "other";
          has_state_school_enrollment: boolean;
          has_active_siepe_enrollment: boolean;
          is_excluded_school: boolean;
          attendance_percent: number;
          portuguese_average: number;
          math_average: number;
          humanities_average: number;
          has_partial_progression: boolean;
          was_previously_selected: boolean;
          result_details?: Json;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
      audit_logs: {
        Row: {
          id: string;
          tenant_id: string | null;
          actor_user_id: string | null;
          event_type: string;
          entity_type: string | null;
          entity_id: string | null;
          payload: Json;
          ip_hash: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          actor_user_id?: string | null;
          event_type: string;
          entity_type?: string | null;
          entity_id?: string | null;
          payload?: Json;
          ip_hash?: string | null;
          created_at?: string;
        };
        Update: Record<string, never>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      current_tenant_id: {
        Args: Record<string, never>;
        Returns: string | null;
      };
      current_user_role: {
        Args: Record<string, never>;
        Returns: "student" | "mentor" | "admin" | null;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
