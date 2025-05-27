
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventRow } from "@/components/EventRow";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { Event } from "@/types/Event";
import { Navigation } from "@/components/Navigation";
import { supabase } from '@/integrations/supabase/client';

const Index = () => {
  const { events, loading, refetch } = useRealtimeEvents();
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateEvent = async (eventData: Omit<Event, 'id' | 'demands'>) => {
    try {
      console.log('Criando evento:', eventData);
      
      const { error } = await supabase
        .from('events')
        .insert([{
          name: eventData.name,
          logo: eventData.logo,
          date: eventData.date,
          archived: false
        }]);

      if (error) {
        console.error('Erro ao criar evento:', error);
        throw error;
      }
      
      console.log('Evento criado com sucesso');
    } catch (error) {
      console.error('Erro completo ao criar evento:', error);
    }
  };

  const handleUpdateEvent = async (eventId: string, updatedEvent: Partial<Event>) => {
    try {
      console.log('Index: Atualizando evento:', eventId, updatedEvent);
      
      // Se há demandas para processar
      if (updatedEvent.demands) {
        console.log('Index: Processando', updatedEvent.demands.length, 'demandas');
        
        for (const demand of updatedEvent.demands) {
          if (demand.id && demand.id.startsWith('temp-')) {
            // Nova demanda (id temporário) - inserir no banco
            console.log('Index: Inserindo nova demanda:', demand);
            
            const insertData = {
              event_id: eventId,
              title: demand.title,
              subject: demand.subject,
              date: demand.date,
              urgency: 'Média', // Sempre usar 'Média' como urgência padrão
              completed: false,
              completed_at: null
            };
            
            console.log('Index: Dados para inserção:', insertData);
            
            const { data, error } = await supabase
              .from('demands')
              .insert(insertData)
              .select()
              .single();
            
            if (error) {
              console.error('Erro ao inserir demanda:', error);
              throw error;
            }
            
            console.log('Index: Demanda inserida com sucesso:', data);
            
          } else if (demand.id && !demand.id.startsWith('temp-')) {
            // Demanda existente - atualizar no banco
            console.log('Index: Atualizando demanda existente:', demand);
            
            const updateData = {
              title: demand.title,
              subject: demand.subject,
              date: demand.date,
              urgency: demand.urgency || 'Média',
              completed: demand.completed,
              completed_at: demand.completedAt || null
            };
            
            const { error } = await supabase
              .from('demands')
              .update(updateData)
              .eq('id', demand.id);
            
            if (error) {
              console.error('Erro ao atualizar demanda:', error);
              throw error;
            }
            
            console.log('Index: Demanda atualizada com sucesso');
          }
        }
      }

      // Atualizar o evento se necessário
      const eventUpdateData: any = {};
      if (updatedEvent.name !== undefined) eventUpdateData.name = updatedEvent.name;
      if (updatedEvent.logo !== undefined) eventUpdateData.logo = updatedEvent.logo;
      if (updatedEvent.date !== undefined) eventUpdateData.date = updatedEvent.date;

      if (Object.keys(eventUpdateData).length > 0) {
        console.log('Index: Atualizando dados do evento:', eventUpdateData);
        
        const { error } = await supabase
          .from('events')
          .update(eventUpdateData)
          .eq('id', eventId);

        if (error) {
          console.error('Erro ao atualizar evento:', error);
          throw error;
        }
        
        console.log('Index: Evento atualizado com sucesso');
      }
      
    } catch (error) {
      console.error('Index: Erro completo ao atualizar evento:', error);
      // Não relançar o erro para evitar travamentos na UI
    }
  };

  const handleArchiveEvent = async (eventId: string) => {
    try {
      console.log('Arquivando evento:', eventId);
      
      const { error } = await supabase
        .from('events')
        .update({ archived: true })
        .eq('id', eventId);

      if (error) {
        console.error('Erro ao arquivar evento:', error);
        throw error;
      }
      
      console.log('Evento arquivado com sucesso');
    } catch (error) {
      console.error('Erro completo ao arquivar evento:', error);
    }
  };

  const handleDeleteEvent = async (eventId: string) => {
    try {
      console.log('Deletando evento:', eventId);
      
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Erro ao deletar evento:', error);
        throw error;
      }
      
      console.log('Evento deletado com sucesso');
    } catch (error) {
      console.error('Erro completo ao deletar evento:', error);
    }
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando eventos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-4 shadow-2xl h-[120px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Lon Demandas
              </h1>
              <p className="text-cyan-300">Desenvolvido por Lon Systems. {formatDateTime(currentDateTime)}</p>
            </div>
          </div>
        </div>

        {/* Novo Evento Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsCreateEventOpen(true)}
            className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 backdrop-blur-sm text-white shadow-lg border border-cyan-400/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Evento
          </Button>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhum evento criado ainda. Clique em "Novo Evento" para começar.
              </div>
            </div>
          ) : (
            events.map((event) => (
              <EventRow
                key={event.id}
                event={event}
                onUpdateEvent={handleUpdateEvent}
                onArchiveEvent={handleArchiveEvent}
                onDeleteEvent={handleDeleteEvent}
              />
            ))
          )}
        </div>
      </div>

      <CreateEventDialog
        open={isCreateEventOpen}
        onOpenChange={setIsCreateEventOpen}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Index;
