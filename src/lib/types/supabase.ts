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
      products: {
        Row: {
          id: string
          brand: string
          name: string
          art: string
          design: string
          colour: string
          uom: string
          hsnCode: string
          mrp: number
          salesPrice: number
          purchasePrice: number
          stock: number
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['products']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['products']['Insert']>
      }
      contacts: {
        Row: {
          id: string
          name: string
          type: 'customer' | 'supplier' | 'employee'
          email: string
          phone: string
          address: string
          city: string
          state: string
          gstn: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['contacts']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['contacts']['Insert']>
      }
      transactions: {
        Row: {
          id: string
          date: string
          contact_id: string
          total: number
          items: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['transactions']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['transactions']['Insert']>
      }
      purchases: {
        Row: {
          id: string
          date: string
          contact_id: string
          total: number
          items: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['purchases']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['purchases']['Insert']>
      }
      quotations: {
        Row: {
          id: string
          date: string
          contact_id: string
          valid_until: string
          status: 'draft' | 'sent' | 'accepted' | 'rejected'
          items: Json
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['quotations']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['quotations']['Insert']>
      }
      attendance: {
        Row: {
          id: string
          employee_id: string
          year: number
          month: number
          records: Json
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['attendance']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['attendance']['Insert']>
      }
      sales_returns: {
        Row: {
          id: string
          date: string
          original_id: string
          contact_id: string
          items: Json
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['sales_returns']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['sales_returns']['Insert']>
      }
      purchase_returns: {
        Row: {
          id: string
          date: string
          original_id: string
          contact_id: string
          items: Json
          total: number
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['purchase_returns']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['purchase_returns']['Insert']>
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