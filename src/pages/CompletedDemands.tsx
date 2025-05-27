
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2, Plus, Archive, Check } from "lucide-react";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const CompletedDemands = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);

  const eventsWithCompletedDemands = events.filter(event => 
    event.demands.some(demand => demand.completed)
  );

  const handleRestore = (eventId: string, demandId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedDemands = event.demands.map(demand =>
          demand.id === demandId ? { ...demand, completed: false, completedAt: undefined } : demand
        );
        return { ...event, demands: updatedDemands };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  const handleDelete = (eventId: string, demandId: string) => {
    const updatedEvents = events.map(event => {
      if (event.id === eventId) {
        const updatedDemands = event.demands.filter(demand => demand.id !== demandId);
        return { ...event, demands: updatedDemands };
      }
      return event;
    });
    setEvents(updatedEvents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header - Mesmo layout da página principal */}
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-6 mb-6 shadow-2xl h-[120px] flex items-center">
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
                  Demandas Concluídas
                </h1>
                <p className="text-blue-300">Gerencie suas demandas concluídas</p>
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              <Button
                onClick={() => navigate('/')}
                variant="outline"
                className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
              >
                Dashboard
              </Button>
              <Button
                onClick={() => navigate('/archived-events')}
                variant="outline"
                className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
              >
                <Archive className="w-4 h-4 mr-2" />
                Arquivados
              </Button>
            </div>
          </div>
        </div>

        {/* Completed Demands List */}
        <div className="space-y-4">
          {eventsWithCompletedDemands.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhuma demanda concluída
              </div>
            </div>
          ) : (
            eventsWithCompletedDemands.map((event) => {
              const completedDemands = event.demands.filter(demand => demand.completed);
              
              return (
                <div key={event.id} className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-4 shadow-2xl mb-4">
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-600/30 mb-4">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold text-white">{event.name}</h3>
                      <p className="text-blue-300 text-sm">
                        {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {completedDemands.map((demand) => (
                      <div
                        key={demand.id}
                        className="bg-slate-700/40 backdrop-blur-sm rounded-xl border border-slate-600/20 p-4 transition-all duration-200 hover:bg-slate-700/50"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{demand.title}</h4>
                            <p className="text-slate-300 text-sm mb-2">{demand.subject}</p>
                            <div className="flex gap-4 text-xs text-blue-300">
                              <span>
                                Data: {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {demand.completedAt && (
                                <span>
                                  Concluída em: {format(new Date(demand.completedAt), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <Button
                              size="sm"
                              onClick={() => handleRestore(event.id, demand.id)}
                              className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/30 transition-all duration-200"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restaurar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(event.id, demand.id)}
                              className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/30 transition-all duration-200"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default CompletedDemands;
