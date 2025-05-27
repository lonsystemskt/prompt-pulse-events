
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Note } from '@/types/Note';

export const useRealtimeNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar notas iniciais
  const loadNotes = async () => {
    try {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedNotes = (data || []).map(note => ({
        id: note.id,
        subject: note.subject,
        text: note.title,
        assignee: note.author,
        date: note.date
      }));

      setNotes(transformedNotes);
    } catch (error) {
      console.error('Erro ao carregar notas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes();

    // Listener para mudanças na tabela notes
    const channel = supabase
      .channel('notes-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notes' },
        (payload) => {
          console.log('Mudança detectada na tabela notes:', payload);
          loadNotes(); // Recarrega todas as notas quando há mudança
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { notes, loading, refetch: loadNotes };
};
