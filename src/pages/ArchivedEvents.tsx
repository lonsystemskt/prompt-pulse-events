
import React, { useEffect, useState } from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";
import { supabase } from '@/integrations/supabase/client';

const ArchivedEvents = () => {
  const navigate = useNavigate();
  const { archivedEvents, loading, loadArchivedEvents } = useRealtimeEvents();
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    // Carregar eventos arquivados quando a página abrir
    loadArchivedEvents();
    
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, [loadArchivedEvents]);

  const handleRestore = async (eventId: string) => {
    try {
      console.log('Restaurando evento:', eventId);
      
      const { error } = await supabase
        .from('events')
        .update({ archived: false })
        .eq('id', eventId);

      if (error) {
        console.error('Erro ao restaurar evento:', error);
        throw error;
      }
      
      console.log('Evento restaurado com sucesso');
      // O realtime irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao restaurar evento:', error);
    }
  };

  const handleDelete = async (eventId: string) => {
    try {
      console.log('Deletando evento permanentemente:', eventId);
      
      // Primeiro deletar todas as demandas do evento
      const { error: demandsError } = await supabase
        .from('demands')
        .delete()
        .eq('event_id', eventId);

      if (demandsError) {
        console.error('Erro ao deletar demandas do evento:', demandsError);
        throw demandsError;
      }

      // Depois deletar o evento
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId);

      if (error) {
        console.error('Erro ao deletar evento:', error);
        throw error;
      }
      
      console.log('Evento deletado permanentemente com sucesso');
      // O realtime irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao deletar evento:', error);
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
        <div className="text-white text-lg">Carregando eventos arquivados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-6 shadow-2xl h-[120px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-4 flex-1">
              <Button
                onClick={() => navigate('/')}
                variant="ghost"
                className="text-white hover:bg-slate-700/50 p-2 transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="flex-1">
                <h1 className="text-4xl font-bold text-white mb-2">
                  Eventos Arquivados
                </h1>
                <p className="text-cyan-300">Desenvolvido por Lon Systems. {formatDateTime(currentDateTime)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Archived Events List */}
        <div className="space-y-4">
          {archivedEvents.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhum evento arquivado
              </div>
            </div>
          ) : (
            archivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4 shadow-2xl mb-4"
              >
                <div className="flex items-center gap-3">
                  {/* Event Logo and Info */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0"
                      />
                    )}
                    
                    <div className="min-w-0 flex-1 w-[100px]">
                      <h2 className="text-lg font-semibold text-white truncate">{event.name}</h2>
                      <span className="text-cyan-300 text-sm">
                        {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <p className="text-slate-400 text-sm">
                        {event.demands.length} demanda(s)
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleRestore(event.id)}
                      size="sm"
                      className="bg-green-500/20 hover:bg-green-500/30 backdrop-blur-sm border border-green-500/30 transition-all duration-200 text-sm px-3 py-2 text-green-300"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      size="sm"
                      className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/30 transition-all duration-200 text-sm px-3 py-2 text-red-300"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ArchivedEvents;
