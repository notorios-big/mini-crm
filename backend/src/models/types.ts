// Type definitions for the CRM system

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
  role: string;
  created_at: string;
}

export interface Lead {
  id: number;
  name: string;
  email: string;
  phone: string;
  city?: string;
  country?: string;
  status: 'new' | 'contacted' | 'qualified' | 'client' | 'discarded';
  current_step: number;
  watched_video: boolean;
  created_at: string;
  updated_at: string;
}

export interface Tag {
  id: number;
  name: string;
  color: string;
  created_at: string;
}

export interface Note {
  id: number;
  lead_id: number;
  user_id: number;
  content: string;
  created_at: string;
  user_name?: string;
}

export interface EmailSequence {
  id: number;
  name: string;
  subject: string;
  body: string;
  delay_days: number;
  delay_hours: number;
  is_active: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EmailLog {
  id: number;
  lead_id: number;
  sequence_id: number;
  status: 'pending' | 'sent' | 'failed';
  scheduled_at: string;
  sent_at?: string;
  error?: string;
  created_at: string;
}

export interface Conversation {
  id: number;
  lead_id: number;
  type: 'email' | 'whatsapp';
  subject?: string;
  last_message?: string;
  is_read: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
  lead_name?: string;
  lead_email?: string;
}

export interface Message {
  id: number;
  conversation_id: number;
  sender_type: 'lead' | 'admin';
  content: string;
  is_read: boolean;
  created_at: string;
}

export interface Config {
  key: string;
  value: string;
  updated_at: string;
}

export interface DashboardStats {
  total_leads: number;
  new_leads: number;
  contacted_leads: number;
  qualified_leads: number;
  clients: number;
  conversion_rate: number;
  step_1_completions: number;
  step_2_completions: number;
  step_3_completions: number;
  leads_today: number;
  leads_this_week: number;
  leads_this_month: number;
}

export interface LeadWithTags extends Lead {
  tags: Tag[];
  notes_count?: number;
}
