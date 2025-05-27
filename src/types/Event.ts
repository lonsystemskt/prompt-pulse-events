
export interface Demand {
  id: string;
  title: string;
  subject: string;
  date: string; // Supabase retorna como string
  completed: boolean;
  completedAt?: string;
  urgency?: string; // Adicionando campo urgency que estava faltando
  created_at?: string;
  updated_at?: string;
}

export interface Event {
  id: string;
  name: string;
  logo?: string;
  date: string; // Supabase retorna como string
  demands: Demand[];
  created_at?: string;
  updated_at?: string;
  archived?: boolean;
}
