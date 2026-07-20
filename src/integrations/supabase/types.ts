export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string
          description: string | null
          id: string
          name: string
          slug: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          name: string
          slug: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          name?: string
          slug?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          ai_generated: boolean | null
          author_id: string | null
          author_name: string | null
          category_id: string | null
          content_html: string | null
          content_markdown: string | null
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          keywords: string[] | null
          meta_description: string | null
          meta_title: string | null
          published_at: string | null
          scheduled_for: string | null
          slug: string
          status: string
          title: string
          updated_at: string
          view_count: number | null
        }
        Insert: {
          ai_generated?: boolean | null
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_html?: string | null
          content_markdown?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          slug: string
          status?: string
          title: string
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          ai_generated?: boolean | null
          author_id?: string | null
          author_name?: string | null
          category_id?: string | null
          content_html?: string | null
          content_markdown?: string | null
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          keywords?: string[] | null
          meta_description?: string | null
          meta_title?: string | null
          published_at?: string | null
          scheduled_for?: string | null
          slug?: string
          status?: string
          title?: string
          updated_at?: string
          view_count?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "blog_posts_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
        ]
      }
      client_files: {
        Row: {
          client_id: string
          created_at: string
          file_name: string
          file_path: string
          file_size: number | null
          file_type: string | null
          id: string
          uploaded_by: string | null
        }
        Insert: {
          client_id: string
          created_at?: string
          file_name: string
          file_path: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Update: {
          client_id?: string
          created_at?: string
          file_name?: string
          file_path?: string
          file_size?: number | null
          file_type?: string | null
          id?: string
          uploaded_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "client_files_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
        ]
      }
      clients: {
        Row: {
          address: string | null
          budget: string | null
          city: string | null
          created_at: string
          email: string | null
          google_drive_folder_id: string | null
          google_drive_folder_url: string | null
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          notes: string | null
          phone: string | null
          postal_code: string | null
          project_description: string | null
          quote_request_id: string | null
          status: string
          surface: string | null
          updated_at: string
        }
        Insert: {
          address?: string | null
          budget?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          project_description?: string | null
          quote_request_id?: string | null
          status?: string
          surface?: string | null
          updated_at?: string
        }
        Update: {
          address?: string | null
          budget?: string | null
          city?: string | null
          created_at?: string
          email?: string | null
          google_drive_folder_id?: string | null
          google_drive_folder_url?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          notes?: string | null
          phone?: string | null
          postal_code?: string | null
          project_description?: string | null
          quote_request_id?: string | null
          status?: string
          surface?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "clients_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      houzz_project_images: {
        Row: {
          caption: string | null
          created_at: string
          id: string
          image_order: number | null
          image_url: string
          project_id: string | null
        }
        Insert: {
          caption?: string | null
          created_at?: string
          id?: string
          image_order?: number | null
          image_url: string
          project_id?: string | null
        }
        Update: {
          caption?: string | null
          created_at?: string
          id?: string
          image_order?: number | null
          image_url?: string
          project_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "houzz_project_images_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "houzz_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      houzz_projects: {
        Row: {
          category: string | null
          created_at: string
          description: string | null
          houzz_id: string | null
          houzz_url: string | null
          id: string
          image_count: number | null
          location: string | null
          slug: string
          tags: string[] | null
          title: string
          updated_at: string
          year: string | null
        }
        Insert: {
          category?: string | null
          created_at?: string
          description?: string | null
          houzz_id?: string | null
          houzz_url?: string | null
          id?: string
          image_count?: number | null
          location?: string | null
          slug: string
          tags?: string[] | null
          title: string
          updated_at?: string
          year?: string | null
        }
        Update: {
          category?: string | null
          created_at?: string
          description?: string | null
          houzz_id?: string | null
          houzz_url?: string | null
          id?: string
          image_count?: number | null
          location?: string | null
          slug?: string
          tags?: string[] | null
          title?: string
          updated_at?: string
          year?: string | null
        }
        Relationships: []
      }
      houzz_testimonials: {
        Row: {
          created_at: string
          date: string | null
          has_photos: boolean | null
          hidden: boolean
          houzz_user_url: string | null
          id: string
          name: string
          photo_urls: string[] | null
          project_type: string | null
          rating: number
          role: string | null
          text: string
        }
        Insert: {
          created_at?: string
          date?: string | null
          has_photos?: boolean | null
          hidden?: boolean
          houzz_user_url?: string | null
          id?: string
          name: string
          photo_urls?: string[] | null
          project_type?: string | null
          rating?: number
          role?: string | null
          text: string
        }
        Update: {
          created_at?: string
          date?: string | null
          has_photos?: boolean | null
          hidden?: boolean
          houzz_user_url?: string | null
          id?: string
          name?: string
          photo_urls?: string[] | null
          project_type?: string | null
          rating?: number
          role?: string | null
          text?: string
        }
        Relationships: []
      }
      import_queue: {
        Row: {
          created_at: string
          error_message: string | null
          id: string
          processed_at: string | null
          status: string
          title: string | null
          type: string
          url: string
        }
        Insert: {
          created_at?: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          title?: string | null
          type?: string
          url: string
        }
        Update: {
          created_at?: string
          error_message?: string | null
          id?: string
          processed_at?: string | null
          status?: string
          title?: string | null
          type?: string
          url?: string
        }
        Relationships: []
      }
      partner_requests: {
        Row: {
          company_name: string
          contact_name: string
          created_at: string
          email: string
          id: string
          message: string | null
          notes: string | null
          phone: string | null
          profile_type: string
          status: string
          updated_at: string
        }
        Insert: {
          company_name: string
          contact_name: string
          created_at?: string
          email: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          profile_type: string
          status?: string
          updated_at?: string
        }
        Update: {
          company_name?: string
          contact_name?: string
          created_at?: string
          email?: string
          id?: string
          message?: string | null
          notes?: string | null
          phone?: string | null
          profile_type?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      press_mentions: {
        Row: {
          article_url: string
          created_at: string
          date: string | null
          display_order: number | null
          featured: boolean | null
          id: string
          logo_url: string | null
          source: string
          source_url: string | null
          title: string
        }
        Insert: {
          article_url: string
          created_at?: string
          date?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          source: string
          source_url?: string | null
          title: string
        }
        Update: {
          article_url?: string
          created_at?: string
          date?: string | null
          display_order?: number | null
          featured?: boolean | null
          id?: string
          logo_url?: string | null
          source?: string
          source_url?: string | null
          title?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          last_name: string | null
          photo_url: string | null
          pro_phone: string | null
          rge_approval_number: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          photo_url?: string | null
          pro_phone?: string | null
          rge_approval_number?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          last_name?: string | null
          photo_url?: string | null
          pro_phone?: string | null
          rge_approval_number?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          address: string | null
          budget: string
          city: string | null
          created_at: string
          email: string
          id: string
          latitude: number | null
          longitude: number | null
          marketing_consent: boolean | null
          message: string
          name: string
          phone: string
          postal_code: string | null
          rgpd_consent: boolean
          status: string
          surface: string
          timeline: string
          updated_at: string
        }
        Insert: {
          address?: string | null
          budget: string
          city?: string | null
          created_at?: string
          email: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          marketing_consent?: boolean | null
          message: string
          name: string
          phone: string
          postal_code?: string | null
          rgpd_consent?: boolean
          status?: string
          surface: string
          timeline: string
          updated_at?: string
        }
        Update: {
          address?: string | null
          budget?: string
          city?: string | null
          created_at?: string
          email?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          marketing_consent?: boolean | null
          message?: string
          name?: string
          phone?: string
          postal_code?: string | null
          rgpd_consent?: boolean
          status?: string
          surface?: string
          timeline?: string
          updated_at?: string
        }
        Relationships: []
      }
      renovation_simulations: {
        Row: {
          city: string | null
          client_id: string | null
          constraint_details: string | null
          constraints: string[] | null
          construction_period: string | null
          created_at: string
          end_date_max: string | null
          has_architect: string | null
          has_dpe: string | null
          id: string
          isolation_data: Json | null
          modify_layout: string | null
          occupy_during_works: string | null
          project_contexts: string[] | null
          project_types: string[] | null
          property_type: string | null
          quote_request_id: string | null
          selected_rooms: Json | null
          start_date: string | null
          start_date_value: string | null
          surface: string | null
          updated_at: string
        }
        Insert: {
          city?: string | null
          client_id?: string | null
          constraint_details?: string | null
          constraints?: string[] | null
          construction_period?: string | null
          created_at?: string
          end_date_max?: string | null
          has_architect?: string | null
          has_dpe?: string | null
          id?: string
          isolation_data?: Json | null
          modify_layout?: string | null
          occupy_during_works?: string | null
          project_contexts?: string[] | null
          project_types?: string[] | null
          property_type?: string | null
          quote_request_id?: string | null
          selected_rooms?: Json | null
          start_date?: string | null
          start_date_value?: string | null
          surface?: string | null
          updated_at?: string
        }
        Update: {
          city?: string | null
          client_id?: string | null
          constraint_details?: string | null
          constraints?: string[] | null
          construction_period?: string | null
          created_at?: string
          end_date_max?: string | null
          has_architect?: string | null
          has_dpe?: string | null
          id?: string
          isolation_data?: Json | null
          modify_layout?: string | null
          occupy_during_works?: string | null
          project_contexts?: string[] | null
          project_types?: string[] | null
          property_type?: string | null
          quote_request_id?: string | null
          selected_rooms?: Json | null
          start_date?: string | null
          start_date_value?: string | null
          surface?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "renovation_simulations_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "renovation_simulations_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_actions: {
        Row: {
          action_type: string | null
          created_at: string
          description: string | null
          due_date: string | null
          id: string
          metadata: Json | null
          plan_id: string | null
          priority: string | null
          result: string | null
          status: string | null
          title: string
          updated_at: string
        }
        Insert: {
          action_type?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          priority?: string | null
          result?: string | null
          status?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          action_type?: string | null
          created_at?: string
          description?: string | null
          due_date?: string | null
          id?: string
          metadata?: Json | null
          plan_id?: string | null
          priority?: string | null
          result?: string | null
          status?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "seo_actions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "seo_monthly_plans"
            referencedColumns: ["id"]
          },
        ]
      }
      seo_ai_citations: {
        Row: {
          ai_source: string
          cited_url: string | null
          created_at: string
          detected_at: string
          excerpt: string | null
          id: string
          metadata: Json | null
          query: string | null
          sentiment: string | null
        }
        Insert: {
          ai_source: string
          cited_url?: string | null
          created_at?: string
          detected_at?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          query?: string | null
          sentiment?: string | null
        }
        Update: {
          ai_source?: string
          cited_url?: string | null
          created_at?: string
          detected_at?: string
          excerpt?: string | null
          id?: string
          metadata?: Json | null
          query?: string | null
          sentiment?: string | null
        }
        Relationships: []
      }
      seo_keywords: {
        Row: {
          category: string | null
          created_at: string
          difficulty: number | null
          id: string
          intent: string | null
          keyword: string
          notes: string | null
          priority: string | null
          search_volume: number | null
          status: string | null
          target_url: string | null
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          intent?: string | null
          keyword: string
          notes?: string | null
          priority?: string | null
          search_volume?: number | null
          status?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          difficulty?: number | null
          id?: string
          intent?: string | null
          keyword?: string
          notes?: string | null
          priority?: string | null
          search_volume?: number | null
          status?: string | null
          target_url?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      seo_monthly_plans: {
        Row: {
          ai_summary: string | null
          created_at: string
          id: string
          month: number
          objectives: string | null
          status: string | null
          title: string | null
          updated_at: string
          year: number
        }
        Insert: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          month: number
          objectives?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          year: number
        }
        Update: {
          ai_summary?: string | null
          created_at?: string
          id?: string
          month?: number
          objectives?: string | null
          status?: string | null
          title?: string | null
          updated_at?: string
          year?: number
        }
        Relationships: []
      }
      seo_notifications: {
        Row: {
          created_at: string
          id: string
          link: string | null
          message: string | null
          metadata: Json | null
          read: boolean | null
          severity: string | null
          title: string
          type: string
        }
        Insert: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json | null
          read?: boolean | null
          severity?: string | null
          title: string
          type: string
        }
        Update: {
          created_at?: string
          id?: string
          link?: string | null
          message?: string | null
          metadata?: Json | null
          read?: boolean | null
          severity?: string | null
          title?: string
          type?: string
        }
        Relationships: []
      }
      seo_opportunities: {
        Row: {
          created_at: string
          description: string | null
          id: string
          keyword: string | null
          metadata: Json | null
          page_url: string | null
          recommended_action: string | null
          score: number | null
          status: string | null
          title: string
          type: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          keyword?: string | null
          metadata?: Json | null
          page_url?: string | null
          recommended_action?: string | null
          score?: number | null
          status?: string | null
          title: string
          type: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          keyword?: string | null
          metadata?: Json | null
          page_url?: string | null
          recommended_action?: string | null
          score?: number | null
          status?: string | null
          title?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      seo_rankings: {
        Row: {
          clicks: number | null
          country: string | null
          created_at: string
          ctr: number | null
          date: string
          device: string | null
          id: string
          impressions: number | null
          keyword: string
          keyword_id: string | null
          page_url: string | null
          position: number | null
        }
        Insert: {
          clicks?: number | null
          country?: string | null
          created_at?: string
          ctr?: number | null
          date: string
          device?: string | null
          id?: string
          impressions?: number | null
          keyword: string
          keyword_id?: string | null
          page_url?: string | null
          position?: number | null
        }
        Update: {
          clicks?: number | null
          country?: string | null
          created_at?: string
          ctr?: number | null
          date?: string
          device?: string | null
          id?: string
          impressions?: number | null
          keyword?: string
          keyword_id?: string | null
          page_url?: string | null
          position?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "seo_rankings_keyword_id_fkey"
            columns: ["keyword_id"]
            isOneToOne: false
            referencedRelation: "seo_keywords"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "admin" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["admin", "user"],
    },
  },
} as const
