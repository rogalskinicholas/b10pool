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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      profiles: {
        Row: {
          created_at: string
          display_name: string | null
          email: string
          full_name: string
          grad_year: number | null
          id: string
          instagram: string | null
          phone: string | null
          school_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          display_name?: string | null
          email: string
          full_name: string
          grad_year?: number | null
          id: string
          instagram?: string | null
          phone?: string | null
          school_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          display_name?: string | null
          email?: string
          full_name?: string
          grad_year?: number | null
          id?: string
          instagram?: string | null
          phone?: string | null
          school_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_school_id_fkey"
            columns: ["school_id"]
            isOneToOne: false
            referencedRelation: "schools"
            referencedColumns: ["id"]
          },
        ]
      }
      rides: {
        Row: {
          contact_method: Database["public"]["Enums"]["contact_method"]
          contact_value: string
          created_at: string
          departs_at: string
          departs_on: string
          destination: Database["public"]["Enums"]["location"]
          driver_id: string
          id: string
          notes: string | null
          origin: Database["public"]["Enums"]["location"]
          price_per_seat: number
          seats_available: number
          seats_total: number
          status: Database["public"]["Enums"]["ride_status"]
          updated_at: string
        }
        Insert: {
          contact_method: Database["public"]["Enums"]["contact_method"]
          contact_value: string
          created_at?: string
          departs_at: string
          departs_on?: string
          destination: Database["public"]["Enums"]["location"]
          driver_id: string
          id?: string
          notes?: string | null
          origin: Database["public"]["Enums"]["location"]
          price_per_seat: number
          seats_available: number
          seats_total: number
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
        }
        Update: {
          contact_method?: Database["public"]["Enums"]["contact_method"]
          contact_value?: string
          created_at?: string
          departs_at?: string
          departs_on?: string
          destination?: Database["public"]["Enums"]["location"]
          driver_id?: string
          id?: string
          notes?: string | null
          origin?: Database["public"]["Enums"]["location"]
          price_per_seat?: number
          seats_available?: number
          seats_total?: number
          status?: Database["public"]["Enums"]["ride_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "rides_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      schools: {
        Row: {
          email_domain: string
          id: string
          is_active: boolean
          location: Database["public"]["Enums"]["location"]
          name: string
        }
        Insert: {
          email_domain: string
          id: string
          is_active?: boolean
          location: Database["public"]["Enums"]["location"]
          name: string
        }
        Update: {
          email_domain?: string
          id?: string
          is_active?: boolean
          location?: Database["public"]["Enums"]["location"]
          name?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_allowed_email: { Args: { p_email: string }; Returns: boolean }
      is_verified_student: { Args: never; Returns: boolean }
      redact_name: { Args: { full_name: string }; Returns: string }
      school_for_email: { Args: { p_email: string }; Returns: string }
      time_zone_for: {
        Args: { loc: Database["public"]["Enums"]["location"] }
        Returns: string
      }
    }
    Enums: {
      contact_method: "sms" | "instagram" | "whatsapp" | "groupme"
      location:
        | "purdue"
        | "uiuc"
        | "chicago_downtown"
        | "chicago_ord"
        | "chicago_mdw"
        | "indy_downtown"
        | "indy_ind"
      ride_status: "open" | "full" | "cancelled"
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
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
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
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
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
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
      contact_method: ["sms", "instagram", "whatsapp", "groupme"],
      location: [
        "purdue",
        "uiuc",
        "chicago_downtown",
        "chicago_ord",
        "chicago_mdw",
        "indy_downtown",
        "indy_ind",
      ],
      ride_status: ["open", "full", "cancelled"],
    },
  },
} as const
