
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Event } from '@/types/Event';

export const useRealtimeEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [archivedEvents, setArchivedEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para transformar dados do Supabase
  const transformEvents = (data: any[]) => {
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
  };

  // Função para carregar eventos iniciais
  const loadEvents = async () => {
    try {
      setLoading(true);
      
      // Carregar apenas eventos não arquivados com limite para performance
      const { data: eventsData, error: eventsError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', false)
        .order('created_at', { ascending: false })
        .limit(50); // Limitar para melhor performance

      if (eventsError) throw eventsError;

      const transformedEvents = transformEvents(eventsData);
      setEvents(transformedEvents);
    } catch (error) {
      console.error('Erro ao carregar eventos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Função para carregar eventos arquivados apenas quando necessário
  const loadArchivedEvents = async () => {
    try {
      console.log('Carregando eventos arquivados...');
      
      const { data: archivedData, error: archivedError } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('archived', true)
        .order('created_at', { ascending: false })
        .limit(50);

      if (archivedError) {
        console.error('Erro ao carregar eventos arquivados:', archivedError);
        throw archivedError;
      }

      const transformedArchived = transformEvents(archivedData);
      console.log('Eventos arquivados carregados:', transformedArchived.length);
      setArchivedEvents(transformedArchived);
    } catch (error) {
      console.error('Erro ao carregar eventos arquivados:', error);
    }
  };

  // Função otimizada para atualizar apenas eventos específicos
  const updateSingleEvent = async (eventId: string) => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          demands (*)
        `)
        .eq('id', eventId)
        .single();

      if (error) {
        console.error('Erro ao buscar evento específico:', error);
        return;
      }

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
  };

  useEffect(() => {
    loadEvents();

    // Listener otimizado para mudanças na tabela events
    const eventsChannel = supabase
      .channel('events-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'events' },
        (payload) => {
          console.log('Mudança detectada na tabela events:', payload);
          
          if (payload.eventType === 'DELETE') {
            const deletedId = payload.old?.id;
            if (deletedId) {
              setEvents(prev => prev.filter(e => e.id !== deletedId));
              setArchivedEvents(prev => prev.filter(e => e.id !== deletedId));
            }
          } else if (payload.new && typeof payload.new === 'object' && 'id' in payload.new) {
            // Pequeno delay para garantir que as demandas foram inseridas
            setTimeout(() => {
              updateSingleEvent(payload.new.id as string);
            }, 100);
          }
        }
      )
      .subscribe();

    // Listener otimizado para mudanças na tabela demands
    const demandsChannel = supabase
      .channel('demands-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'demands' },
        (payload) => {
          console.log('Mudança detectada na tabela demands:', payload);
          
          const eventId = (payload.new && typeof payload.new === 'object' && 'event_id' in payload.new) 
            ? payload.new.event_id as string
            : (payload.old && typeof payload.old === 'object' && 'event_id' in payload.old)
            ? payload.old.event_id as string
            : null;
            
          if (eventId) {
            // Pequeno delay para garantir consistência
            setTimeout(() => {
              updateSingleEvent(eventId);
            }, 50);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(eventsChannel);
      supabase.removeChannel(demandsChannel);
    };
  }, []);

  return { 
    events, 
    archivedEvents, 
    loading, 
    refetch: loadEvents,
    loadArchivedEvents 
  };
};
