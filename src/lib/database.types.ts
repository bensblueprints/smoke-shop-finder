export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      shops: {
        Row: {
          id: string
          name: string
          address1: string | null
          address2: string | null
          city: string | null
          state: string | null
          zip_code: string | null
          country: string | null
          website: string | null
          phone: string | null
          email: string | null
          date_added: string | null
          date_updated: string | null
          has_cbd: boolean | null
          business_type: string | null
          has_marijuana: boolean | null
          has_kratom: boolean | null
          buyer_name: string | null
          title: string | null
          claimed: boolean | null
          claimed_by: string | null
          claimed_at: string | null
          search_vector: unknown | null
        }
        Insert: {
          id?: string
          name: string
          address1?: string | null
          address2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          date_added?: string | null
          date_updated?: string | null
          has_cbd?: boolean | null
          business_type?: string | null
          has_marijuana?: boolean | null
          has_kratom?: boolean | null
          buyer_name?: string | null
          title?: string | null
          claimed?: boolean | null
          claimed_by?: string | null
          claimed_at?: string | null
          search_vector?: unknown | null
        }
        Update: {
          id?: string
          name?: string
          address1?: string | null
          address2?: string | null
          city?: string | null
          state?: string | null
          zip_code?: string | null
          country?: string | null
          website?: string | null
          phone?: string | null
          email?: string | null
          date_added?: string | null
          date_updated?: string | null
          has_cbd?: boolean | null
          business_type?: string | null
          has_marijuana?: boolean | null
          has_kratom?: boolean | null
          buyer_name?: string | null
          title?: string | null
          claimed?: boolean | null
          claimed_by?: string | null
          claimed_at?: string | null
          search_vector?: unknown | null
        }
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
  }
}