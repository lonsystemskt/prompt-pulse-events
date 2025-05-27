
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/Event';

export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar eventos iniciais
  const loadEvents = async () => {
    try {
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', false);

      const { data: archivedData, error: archivedError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', true);

      if (eventsError) throw eventsError;
      if (archivedError) throw archivedError;

      const transformedEvents = (eventsData || []).map(event => ({
        ...event,
        demands: event.demands || []
      }));

      const transformedArchived = (archivedData || []).map(event => ({
        ...event,
        demands: event.demands || []
      }));

      setEvents(transformedEvents);
      setArchivedEvents(transformedArchived);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEvents();

    // Listener para mudanças na tabela events
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Mudança detectada na tabela events:', payload);
          loadEvents(); // Recarrega todos os eventos quando há mudança
        }
      )
      .subscribe();

    // Listener para mudanças na tabela demands
    const demandsChannel = supabase
      .channel('demands-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demands' },
        (payload) => {
          console.log('Mudança detectada na tabela demands:', payload);
          loadEvents(); // Recarrega eventos pois as demands estão relacionadas
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(demandsChannel);
    };
  }, []);

  return { events, archivedEvents, loading, refetch: loadEvents };
};
