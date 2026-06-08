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
      student_onboarding: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          idioma: "english" | "spanish";
          ano_escolar: "first" | "second" | "third";
          tempo_disponivel: "15m" | "30m" | "1h" | "2h_plus";
          ja_participou_pgm: boolean;
          objetivo_principal:
            | "improve_english"
            | "improve_spanish"
            | "pass_exam"
            | "improve_writing"
            | "improve_interview";
          onboarding_completed: boolean;
          plan_version: string;
          plan: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          idioma: "english" | "spanish";
          ano_escolar: "first" | "second" | "third";
          tempo_disponivel: "15m" | "30m" | "1h" | "2h_plus";
          ja_participou_pgm?: boolean;
          objetivo_principal:
            | "improve_english"
            | "improve_spanish"
            | "pass_exam"
            | "improve_writing"
            | "improve_interview";
          onboarding_completed?: boolean;
          plan_version?: string;
          plan?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          idioma?: "english" | "spanish";
          ano_escolar?: "first" | "second" | "third";
          tempo_disponivel?: "15m" | "30m" | "1h" | "2h_plus";
          ja_participou_pgm?: boolean;
          objetivo_principal?:
            | "improve_english"
            | "improve_spanish"
            | "pass_exam"
            | "improve_writing"
            | "improve_interview";
          onboarding_completed?: boolean;
          plan_version?: string;
          plan?: Json;
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
      payment_events: {
        Row: {
          id: string;
          tenant_id: string | null;
          subscription_id: string | null;
          provider: "asaas";
          event_id: string;
          event_type: string;
          provider_payment_id: string | null;
          processing_status: "received" | "processed" | "ignored" | "failed";
          payload: Json;
          error_message: string | null;
          processed_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          subscription_id?: string | null;
          provider?: "asaas";
          event_id: string;
          event_type: string;
          provider_payment_id?: string | null;
          processing_status?: "received" | "processed" | "ignored" | "failed";
          payload?: Json;
          error_message?: string | null;
          processed_at?: string | null;
          created_at?: string;
        };
        Update: {
          processing_status?: "received" | "processed" | "ignored" | "failed";
          error_message?: string | null;
          processed_at?: string | null;
        };
        Relationships: [];
      };
      editorial_versions: {
        Row: {
          id: string;
          code: string;
          title: string;
          edital_year: number;
          status: "draft" | "active" | "deprecated";
          source_reference: string;
          official_source_url: string | null;
          summary: string | null;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          edital_year: number;
          status?: "draft" | "active" | "deprecated";
          source_reference: string;
          official_source_url?: string | null;
          summary?: string | null;
          published_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          title?: string;
          edital_year?: number;
          status?: "draft" | "active" | "deprecated";
          source_reference?: string;
          official_source_url?: string | null;
          summary?: string | null;
          published_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      editorial_competencies: {
        Row: {
          id: string;
          code: string;
          title: string;
          description: string;
          category_slug: string;
          subcategory_slug: string;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          title: string;
          description?: string;
          category_slug: string;
          subcategory_slug: string;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          title?: string;
          description?: string;
          category_slug?: string;
          subcategory_slug?: string;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_blueprints: {
        Row: {
          id: string;
          code: string;
          editorial_version_id: string;
          title: string;
          simulation_type: "objective" | "subjective" | "psychosocial";
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_items: number;
          duration_minutes: number | null;
          distribution: Json;
          minimum_competency_codes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          code: string;
          editorial_version_id: string;
          title: string;
          simulation_type: "objective" | "subjective" | "psychosocial";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_items: number;
          duration_minutes?: number | null;
          distribution?: Json;
          minimum_competency_codes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          code?: string;
          editorial_version_id?: string;
          title?: string;
          simulation_type?: "objective" | "subjective" | "psychosocial";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_items?: number;
          duration_minutes?: number | null;
          distribution?: Json;
          minimum_competency_codes?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      academy_blueprints: {
        Row: {
          id: string;
          editorial_version_id: string;
          module_id: string;
          module_order: number;
          title: string;
          objectives: Json;
          competency_codes: string[];
          contents: Json;
          activities: Json;
          related_simulation_codes: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_version_id: string;
          module_id: string;
          module_order: number;
          title: string;
          objectives?: Json;
          competency_codes?: string[];
          contents?: Json;
          activities?: Json;
          related_simulation_codes?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_version_id?: string;
          module_id?: string;
          module_order?: number;
          title?: string;
          objectives?: Json;
          competency_codes?: string[];
          contents?: Json;
          activities?: Json;
          related_simulation_codes?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      question_banks: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          tenant_id: string | null;
          title: string;
          description: string | null;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          tenant_id?: string | null;
          title: string;
          description?: string | null;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          tenant_id?: string | null;
          title?: string;
          description?: string | null;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      question_categories: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          tenant_id: string | null;
          parent_id: string | null;
          name: string;
          slug: string;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          tenant_id?: string | null;
          parent_id?: string | null;
          name: string;
          slug: string;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          tenant_id?: string | null;
          parent_id?: string | null;
          name?: string;
          slug?: string;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      questions: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          primary_competency_id: string | null;
          editorial_difficulty_level: number | null;
          tenant_id: string | null;
          bank_id: string;
          category_id: string | null;
          title: string | null;
          type: "objective" | "subjective" | "psychosocial";
          difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          statement: string;
          explanation: string | null;
          source_reference: string | null;
          tags: string[];
          is_active: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          bank_id: string;
          category_id?: string | null;
          title?: string | null;
          type: "objective" | "subjective" | "psychosocial";
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          statement: string;
          explanation?: string | null;
          source_reference?: string | null;
          tags?: string[];
          is_active?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          bank_id?: string;
          category_id?: string | null;
          title?: string | null;
          type?: "objective" | "subjective" | "psychosocial";
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          statement?: string;
          explanation?: string | null;
          source_reference?: string | null;
          tags?: string[];
          is_active?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      question_options: {
        Row: {
          id: string;
          tenant_id: string | null;
          question_id: string;
          option_label: string;
          option_text: string;
          is_correct: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          question_id: string;
          option_label: string;
          option_text: string;
          is_correct?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string | null;
          question_id?: string;
          option_label?: string;
          option_text?: string;
          is_correct?: boolean;
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_templates: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          blueprint_id: string | null;
          tenant_id: string | null;
          title: string;
          description: string | null;
          type: "quick" | "full";
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_questions: number;
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          blueprint_id?: string | null;
          tenant_id?: string | null;
          title: string;
          description?: string | null;
          type?: "quick" | "full";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_questions: number;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          blueprint_id?: string | null;
          tenant_id?: string | null;
          title?: string;
          description?: string | null;
          type?: "quick" | "full";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          total_questions?: number;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_attempts: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          template_id: string | null;
          started_at: string;
          completed_at: string | null;
          score: number | null;
          percentage: number | null;
          status: "started" | "completed" | "abandoned";
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          template_id?: string | null;
          started_at?: string;
          completed_at?: string | null;
          score?: number | null;
          percentage?: number | null;
          status?: "started" | "completed" | "abandoned";
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          template_id?: string | null;
          completed_at?: string | null;
          score?: number | null;
          percentage?: number | null;
          status?: "started" | "completed" | "abandoned";
          updated_at?: string;
        };
        Relationships: [];
      };
      simulation_answers: {
        Row: {
          id: string;
          tenant_id: string;
          attempt_id: string;
          question_id: string;
          selected_option_id: string | null;
          is_correct: boolean | null;
          points: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          attempt_id: string;
          question_id: string;
          selected_option_id?: string | null;
          is_correct?: boolean | null;
          points?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          selected_option_id?: string | null;
          is_correct?: boolean | null;
          points?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      study_materials: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          primary_competency_id: string | null;
          editorial_difficulty_level: number | null;
          tenant_id: string | null;
          category_id: string | null;
          title: string;
          slug: string;
          content_md: string;
          difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          estimated_time: number;
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          material_structure: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category_id?: string | null;
          title: string;
          slug: string;
          content_md?: string;
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          estimated_time?: number;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          material_structure?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category_id?: string | null;
          title?: string;
          slug?: string;
          content_md?: string;
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          estimated_time?: number;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          material_structure?: Json;
          updated_at?: string;
        };
        Relationships: [];
      };
      flashcards: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          primary_competency_id: string | null;
          editorial_difficulty_level: number | null;
          tenant_id: string | null;
          category_id: string | null;
          front_content: string;
          back_content: string;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          difficulty: "beginner" | "intermediate" | "advanced" | "mixed";
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category_id?: string | null;
          front_content: string;
          back_content: string;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category_id?: string | null;
          front_content?: string;
          back_content?: string;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          difficulty?: "beginner" | "intermediate" | "advanced" | "mixed";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_paths: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          academy_blueprint_id: string | null;
          tenant_id: string | null;
          title: string;
          description: string | null;
          slug: string | null;
          language:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          academy_blueprint_id?: string | null;
          tenant_id?: string | null;
          title: string;
          description?: string | null;
          slug?: string | null;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          academy_blueprint_id?: string | null;
          tenant_id?: string | null;
          title?: string;
          description?: string | null;
          slug?: string | null;
          language?:
            | "english"
            | "spanish"
            | "portuguese"
            | "mixed"
            | "psychosocial";
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      learning_path_items: {
        Row: {
          id: string;
          tenant_id: string | null;
          path_id: string;
          item_type:
            | "question"
            | "study_material"
            | "flashcard"
            | "simulation_template"
            | "psychosocial_question";
          item_id: string;
          sort_order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id?: string | null;
          path_id: string;
          item_type:
            | "question"
            | "study_material"
            | "flashcard"
            | "simulation_template"
            | "psychosocial_question";
          item_id: string;
          sort_order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string | null;
          path_id?: string;
          item_type?:
            | "question"
            | "study_material"
            | "flashcard"
            | "simulation_template"
            | "psychosocial_question";
          item_id?: string;
          sort_order?: number;
          updated_at?: string;
        };
        Relationships: [];
      };
      user_learning_progress: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          path_id: string | null;
          item_type:
            | "study_material"
            | "flashcard"
            | "question"
            | "psychosocial_question"
            | "simulation_template";
          item_id: string;
          completed: boolean;
          completed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          path_id?: string | null;
          item_type:
            | "study_material"
            | "flashcard"
            | "question"
            | "psychosocial_question"
            | "simulation_template";
          item_id: string;
          completed?: boolean;
          completed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string;
          user_id?: string;
          path_id?: string | null;
          item_type?:
            | "study_material"
            | "flashcard"
            | "question"
            | "psychosocial_question"
            | "simulation_template";
          item_id?: string;
          completed?: boolean;
          completed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      psychosocial_questions: {
        Row: {
          id: string;
          editorial_id: string | null;
          editorial_version_id: string | null;
          primary_competency_id: string | null;
          editorial_difficulty_level: number | null;
          tenant_id: string | null;
          category: string;
          question: string;
          ideal_answer_guidelines: string | null;
          common_mistakes: string | null;
          is_premium: boolean;
          is_active: boolean;
          source_reference: string | null;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category: string;
          question: string;
          ideal_answer_guidelines?: string | null;
          common_mistakes?: string | null;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          editorial_id?: string | null;
          editorial_version_id?: string | null;
          primary_competency_id?: string | null;
          editorial_difficulty_level?: number | null;
          tenant_id?: string | null;
          category?: string;
          question?: string;
          ideal_answer_guidelines?: string | null;
          common_mistakes?: string | null;
          is_premium?: boolean;
          is_active?: boolean;
          source_reference?: string | null;
          tags?: string[];
          updated_at?: string;
        };
        Relationships: [];
      };
      subjective_attempts: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          question_id: string;
          answer_text: string;
          status: "pending" | "reviewed" | "returned";
          score: number | null;
          max_score: number;
          feedback: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          question_id: string;
          answer_text: string;
          status?: "pending" | "reviewed" | "returned";
          score?: number | null;
          max_score?: number;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string;
          user_id?: string;
          question_id?: string;
          answer_text?: string;
          status?: "pending" | "reviewed" | "returned";
          score?: number | null;
          max_score?: number;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          updated_at?: string;
        };
        Relationships: [];
      };
      psychosocial_attempts: {
        Row: {
          id: string;
          tenant_id: string;
          user_id: string;
          psychosocial_question_id: string;
          answer_text: string;
          status: "pending" | "reviewed" | "returned";
          score: number | null;
          max_score: number;
          feedback: string | null;
          reviewed_by: string | null;
          reviewed_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          tenant_id: string;
          user_id: string;
          psychosocial_question_id: string;
          answer_text: string;
          status?: "pending" | "reviewed" | "returned";
          score?: number | null;
          max_score?: number;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          tenant_id?: string;
          user_id?: string;
          psychosocial_question_id?: string;
          answer_text?: string;
          status?: "pending" | "reviewed" | "returned";
          score?: number | null;
          max_score?: number;
          feedback?: string | null;
          reviewed_by?: string | null;
          reviewed_at?: string | null;
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
      has_paid_access: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
