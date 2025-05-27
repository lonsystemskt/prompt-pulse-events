
export interface Contact {
  id: string;
  name: string;
  whatsapp: string;
  email: string;
  subject: string;
  comments: string[];
  created_at?: string;
  updated_at?: string;
  date?: string;
  completed?: boolean;
  status?: string;
}
