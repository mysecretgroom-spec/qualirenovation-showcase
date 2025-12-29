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
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
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
    Enums: {},
  },
} as const
