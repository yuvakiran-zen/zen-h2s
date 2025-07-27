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
      profiles: {
        Row: {
          id: string
          user_id: string
          age: number
          future_age: number
          personality: 'conservative' | 'balanced' | 'aggressive'
          goals: string[]
          avatar_url: string | null
          monthly_income: number | null
          monthly_expenses: number | null
          current_savings: number | null
          risk_tolerance: 'low' | 'medium' | 'high' | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          age: number
          future_age: number
          personality: 'conservative' | 'balanced' | 'aggressive'
          goals: string[]
          avatar_url?: string | null
          monthly_income?: number | null
          monthly_expenses?: number | null
          current_savings?: number | null
          risk_tolerance?: 'low' | 'medium' | 'high' | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          age?: number
          future_age?: number
          personality?: 'conservative' | 'balanced' | 'aggressive'
          goals?: string[]
          avatar_url?: string | null
          monthly_income?: number | null
          monthly_expenses?: number | null
          current_savings?: number | null
          risk_tolerance?: 'low' | 'medium' | 'high' | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      connected_accounts: {
        Row: {
          id: string
          user_id: string
          account_type: string
          account_name: string
          is_connected: boolean
          connection_data: Json | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          account_type: string
          account_name: string
          is_connected?: boolean
          connection_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          account_type?: string
          account_name?: string
          is_connected?: boolean
          connection_data?: Json | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "connected_accounts_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      financial_data: {
        Row: {
          id: string
          user_id: string
          balance: number
          monthly_income: number
          monthly_expenses: number
          savings_rate: number
          investment_value: number | null
          investment_returns: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          balance: number
          monthly_income: number
          monthly_expenses: number
          savings_rate: number
          investment_value?: number | null
          investment_returns?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          balance?: number
          monthly_income?: number
          monthly_expenses?: number
          savings_rate?: number
          investment_value?: number | null
          investment_returns?: number | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "financial_data_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      recommendations: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          category: 'investment' | 'spending' | 'savings' | 'debt'
          impact: 'high' | 'medium' | 'low'
          effort: 'high' | 'medium' | 'low'
          potential_savings: number
          steps: string[]
          is_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          category: 'investment' | 'spending' | 'savings' | 'debt'
          impact: 'high' | 'medium' | 'low'
          effort: 'high' | 'medium' | 'low'
          potential_savings: number
          steps: string[]
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          category?: 'investment' | 'spending' | 'savings' | 'debt'
          impact?: 'high' | 'medium' | 'low'
          effort?: 'high' | 'medium' | 'low'
          potential_savings?: number
          steps?: string[]
          is_completed?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendations_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      scenarios: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string
          type: 'conservative' | 'balanced' | 'aggressive'
          final_net_worth: number
          confidence_score: number
          timeline_data: Json
          is_selected: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description: string
          type: 'conservative' | 'balanced' | 'aggressive'
          final_net_worth: number
          confidence_score: number
          timeline_data: Json
          is_selected?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string
          type?: 'conservative' | 'balanced' | 'aggressive'
          final_net_worth?: number
          confidence_score?: number
          timeline_data?: Json
          is_selected?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "scenarios_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
      chat_messages: {
        Row: {
          id: string
          user_id: string
          content: string
          sender: 'user' | 'future_self' | 'ai_assistant'
          future_age: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content: string
          sender: 'user' | 'future_self' | 'ai_assistant'
          future_age?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string
          sender?: 'user' | 'future_self' | 'ai_assistant'
          future_age?: number | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      personality_type: 'conservative' | 'balanced' | 'aggressive'
      risk_tolerance: 'low' | 'medium' | 'high'
      recommendation_category: 'investment' | 'spending' | 'savings' | 'debt'
      impact_level: 'high' | 'medium' | 'low'
      message_sender: 'user' | 'future_self' | 'ai_assistant'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 