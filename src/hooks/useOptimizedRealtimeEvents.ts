
import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/Event';

export const useOptimizedRealtimeEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  // Debounce para evitar recarregamentos excessivos
  const debounceTimeout = 500;

  // Função otimizada para transformar dados
  const transformEvents = useCallback((data: any[]) => {
    return (data || []).map(event => ({
      ...event,
      demands: (event.demands || []).map(demand => ({
        id: demand.id,
        title: demand.title,
        subject: demand.subject,
        date: demand.date,
        completed: demand.completed,
        completedAt: demand.completed_at,
        urgency: demand.urgency || 'Média',
        created_at: demand.created_at,
        updated_at: demand.updated_at
      }))
    }));
  }, []);

  // Função otimizada para carregar eventos com cache
  const loadEvents = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdate < debounceTimeout) {
      return; // Evita recarregamentos muito frequentes
    }

    try {
      setLoading(true);
      
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(20); // Reduzido para melhor performance

      if (eventsError) throw eventsError;

      const transformedEvents = transformEvents(eventsData);
      setEvents(transformedEvents);
      setLastUpdate(now);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  }, [transformEvents, lastUpdate]);

  // Função para carregar eventos arquivados apenas quando necessário
  const loadArchivedEvents = useCallback(async () => {
    try {
      const { data: archivedData, error: archivedError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', true)
        .order('created_at', { ascending: false })
        .limit(20);

      if (archivedError) throw archivedError;

      const transformedArchived = transformEvents(archivedData);
      setArchivedEvents(transformedArchived);
    } catch (error) {
      console.error('Erro ao carregar eventos arquivados:', error);
    }
  }, [transformEvents]);

  // Atualização otimizada de evento específico
  const updateSingleEvent = useCallback(async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('id', eventId)
        .single();

      if (error) return;

      const transformedEvent = transformEvents([data])[0];

      if (transformedEvent.archived) {
        setArchivedEvents(prev => {
          const updated = prev.filter(e => e.id !== eventId);
          return [...updated, transformedEvent];
        });
        setEvents(prev => prev.filter(e => e.id !== eventId));
      } else {
        setEvents(prev => {
          const updated = prev.filter(e => e.id !== eventId);
          return [...updated, transformedEvent].sort((a, b) => 
            new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
          );
        });
        setArchivedEvents(prev => prev.filter(e => e.id !== eventId));
      }
    } catch (error) {
      console.error('Erro ao atualizar evento específico:', error);
    }
  }, [transformEvents]);

  // Listener otimizado com debounce
  useEffect(() => {
    loadEvents();

    let debounceTimer: NodeJS.Timeout;

    const eventsChannel = supabase
      .channel('events-optimized')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            if (payload.eventType === 'DELETE') {
              const deletedId = payload.old?.id;
              if (deletedId) {
                setEvents(prev => prev.filter(e => e.id !== deletedId));
                setArchivedEvents(prev => prev.filter(e => e.id !== deletedId));
              }
            } else if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
              updateSingleEvent(payload.new.id as string);
            }
          }, 200);
        }
      )
      .subscribe();

    const demandsChannel = supabase
      .channel('demands-optimized')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demands' },
        (payload) => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(() => {
            const eventId = (payload.new && typeof payload.new === 'object' && 'event_id' in payload.new) 
              ? payload.new.event_id as string
              : (payload.old && typeof payload.old === 'object' && 'event_id' in payload.old)
              ? payload.old.event_id as string
              : null;
              
            if (eventId) {
              updateSingleEvent(eventId);
            }
          }, 100);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(demandsChannel);
    };
  }, [loadEvents, updateSingleEvent]);

  const memoizedReturn = useMemo(() => ({
    events,
    archivedEvents,
    loading,
    refetch: loadEvents,
    loadArchivedEvents
  }), [events, archivedEvents, loading, loadEvents, loadArchivedEvents]);

  return memoizedReturn;
};
