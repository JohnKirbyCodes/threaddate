export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      brands: {
        Row: {
          country_code: string | null
          created_at: string | null
          created_by: string | null
          depop_url: string | null
          description: string | null
          ebay_url: string | null
          founded_year: number | null
          id: number
          logo_url: string | null
          name: string
          parent_brand_id: number | null
          poshmark_url: string | null
          slug: string
          verification_status: string | null
          verified: boolean | null
          verified_at: string | null
          verified_by: string | null
          website_url: string | null
          wikipedia_url: string | null
        }
        Insert: {
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          depop_url?: string | null
          description?: string | null
          ebay_url?: string | null
          founded_year?: number | null
          id?: never
          logo_url?: string | null
          name: string
          parent_brand_id?: number | null
          poshmark_url?: string | null
          slug: string
          verification_status?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
          wikipedia_url?: string | null
        }
        Update: {
          country_code?: string | null
          created_at?: string | null
          created_by?: string | null
          depop_url?: string | null
          description?: string | null
          ebay_url?: string | null
          founded_year?: number | null
          id?: never
          logo_url?: string | null
          name?: string
          parent_brand_id?: number | null
          poshmark_url?: string | null
          slug?: string
          verification_status?: string | null
          verified?: boolean | null
          verified_at?: string | null
          verified_by?: string | null
          website_url?: string | null
          wikipedia_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "brands_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_parent_brand_id_fkey"
            columns: ["parent_brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "brands_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      clothing_items: {
        Row: {
          color: string | null
          created_at: string | null
          created_by: string
          description: string | null
          era: Database["public"]["Enums"]["era_enum"] | null
          id: number
          image_url: string | null
          name: string
          size: string | null
          slug: string
          status: Database["public"]["Enums"]["status_enum"] | null
          style_number: string | null
          submission_notes: string | null
          type: Database["public"]["Enums"]["clothing_type_enum"]
          verification_score: number | null
          verified_at: string | null
          verified_by: string | null
          year_manufactured: number | null
        }
        Insert: {
          color?: string | null
          created_at?: string | null
          created_by: string
          description?: string | null
          era?: Database["public"]["Enums"]["era_enum"] | null
          id?: never
          image_url?: string | null
          name: string
          size?: string | null
          slug: string
          status?: Database["public"]["Enums"]["status_enum"] | null
          style_number?: string | null
          submission_notes?: string | null
          type: Database["public"]["Enums"]["clothing_type_enum"]
          verification_score?: number | null
          verified_at?: string | null
          verified_by?: string | null
          year_manufactured?: number | null
        }
        Update: {
          color?: string | null
          created_at?: string | null
          created_by?: string
          description?: string | null
          era?: Database["public"]["Enums"]["era_enum"] | null
          id?: never
          image_url?: string | null
          name?: string
          size?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["status_enum"] | null
          style_number?: string | null
          submission_notes?: string | null
          type?: Database["public"]["Enums"]["clothing_type_enum"]
          verification_score?: number | null
          verified_at?: string | null
          verified_by?: string | null
          year_manufactured?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "clothing_items_created_by_fkey"
            columns: ["created_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "clothing_items_verified_by_fkey"
            columns: ["verified_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          id: string
          reputation_score: number | null
          role: string | null
          username: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          id: string
          reputation_score?: number | null
          role?: string | null
          username?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          id?: string
          reputation_score?: number | null
          role?: string | null
          username?: string | null
        }
        Relationships: []
      }
      tag_evidence: {
        Row: {
          created_at: string | null
          description: string | null
          evidence_type: string | null
          id: number
          image_url: string
          tag_id: number
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          evidence_type?: string | null
          id?: never
          image_url: string
          tag_id: number
        }
        Update: {
          created_at?: string | null
          description?: string | null
          evidence_type?: string | null
          id?: never
          image_url?: string
          tag_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "tag_evidence_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      tags: {
        Row: {
          brand_id: number
          category: Database["public"]["Enums"]["identifier_category_enum"]
          clothing_item_id: number | null
          created_at: string | null
          era: Database["public"]["Enums"]["era_enum"]
          id: number
          image_url: string
          origin_country: string | null
          status: Database["public"]["Enums"]["status_enum"] | null
          stitch_type: Database["public"]["Enums"]["stitch_enum"] | null
          submission_notes: string | null
          user_id: string
          verification_score: number | null
          year_end: number | null
          year_start: number | null
        }
        Insert: {
          brand_id: number
          category?: Database["public"]["Enums"]["identifier_category_enum"]
          clothing_item_id?: number | null
          created_at?: string | null
          era: Database["public"]["Enums"]["era_enum"]
          id?: never
          image_url: string
          origin_country?: string | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          stitch_type?: Database["public"]["Enums"]["stitch_enum"] | null
          submission_notes?: string | null
          user_id: string
          verification_score?: number | null
          year_end?: number | null
          year_start?: number | null
        }
        Update: {
          brand_id?: number
          category?: Database["public"]["Enums"]["identifier_category_enum"]
          clothing_item_id?: number | null
          created_at?: string | null
          era?: Database["public"]["Enums"]["era_enum"]
          id?: never
          image_url?: string
          origin_country?: string | null
          status?: Database["public"]["Enums"]["status_enum"] | null
          stitch_type?: Database["public"]["Enums"]["stitch_enum"] | null
          submission_notes?: string | null
          user_id?: string
          verification_score?: number | null
          year_end?: number | null
          year_start?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "tags_brand_id_fkey"
            columns: ["brand_id"]
            isOneToOne: false
            referencedRelation: "brands"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_clothing_item_id_fkey"
            columns: ["clothing_item_id"]
            isOneToOne: false
            referencedRelation: "clothing_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tags_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      votes: {
        Row: {
          created_at: string | null
          id: number
          tag_id: number
          user_id: string
          vote_value: number | null
        }
        Insert: {
          created_at?: string | null
          id?: never
          tag_id: number
          user_id: string
          vote_value?: number | null
        }
        Update: {
          created_at?: string | null
          id?: never
          tag_id?: number
          user_id?: string
          vote_value?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "votes_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "votes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      clothing_type_enum:
        | "T-Shirt"
        | "Sweatshirt"
        | "Hoodie"
        | "Jacket"
        | "Coat"
        | "Jeans"
        | "Pants"
        | "Shorts"
        | "Dress"
        | "Skirt"
        | "Hat"
        | "Shoes"
        | "Boots"
        | "Belt"
        | "Bag"
        | "Other"
      era_enum:
        | "Pre-1900s"
        | "1900s"
        | "1910s"
        | "1920s"
        | "1930s"
        | "1940s"
        | "1950s"
        | "1960s"
        | "1970s"
        | "1980s"
        | "1990s"
        | "2000s (Y2K)"
        | "2010s"
        | "2020s"
        | "Modern"
      identifier_category_enum:
        | "Neck Tag"
        | "Care Tag"
        | "Button/Snap"
        | "Zipper"
        | "Tab"
        | "Stitching"
        | "Print/Graphic"
        | "Hardware"
        | "Other"
      status_enum: "pending" | "verified" | "rejected"
      stitch_enum: "Single" | "Double" | "Chain" | "Other"
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      clothing_type_enum: [
        "T-Shirt",
        "Sweatshirt",
        "Hoodie",
        "Jacket",
        "Coat",
        "Jeans",
        "Pants",
        "Shorts",
        "Dress",
        "Skirt",
        "Hat",
        "Shoes",
        "Boots",
        "Belt",
        "Bag",
        "Other",
      ],
      era_enum: [
        "Pre-1900s",
        "1900s",
        "1910s",
        "1920s",
        "1930s",
        "1940s",
        "1950s",
        "1960s",
        "1970s",
        "1980s",
        "1990s",
        "2000s (Y2K)",
        "2010s",
        "2020s",
        "Modern",
      ],
      identifier_category_enum: [
        "Neck Tag",
        "Care Tag",
        "Button/Snap",
        "Zipper",
        "Tab",
        "Stitching",
        "Print/Graphic",
        "Hardware",
        "Other",
      ],
      status_enum: ["pending", "verified", "rejected"],
      stitch_enum: ["Single", "Double", "Chain", "Other"],
    },
  },
} as const

