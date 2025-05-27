
export interface Note {
  id: string;
  subject: string;
  text: string;
  date: string; // Supabase retorna como string
  assignee: 'Thiago' | 'Kalil';
  created_at?: string;
  updated_at?: string;
}
