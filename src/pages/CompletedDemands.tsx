
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2, Archive, Check, Calendar } from "lucide-react";
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
        {/* Header com nova identidade visual */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Check className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Demandas Concluídas
                  </h1>
                  <p className="text-green-300/80 text-lg">Gerencie suas demandas concluídas</p>
                </div>
              </div>
            </div>
            
            {/* Menu de navegação sempre visível */}
            <div className="flex items-center gap-4">
              <div className="flex bg-slate-700/40 backdrop-blur-sm rounded-2xl p-2 border border-slate-600/30">
                <Button
                  onClick={() => navigate('/')}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-xl px-6 py-3 font-medium transition-all duration-200"
                >
                  Demandas
                </Button>
                <Button
                  onClick={() => navigate('/archived-events')}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-xl px-6 py-3 font-medium transition-all duration-200"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Arquivados
                </Button>
                <Button
                  onClick={() => navigate('/completed-demands')}
                  variant="ghost"
                  className="bg-green-500/80 text-white hover:bg-green-600/90 rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-md"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Concluídas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Completed Demands List */}
        <div className="space-y-6">
          {eventsWithCompletedDemands.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl border border-slate-600/30 p-16 text-center shadow-xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                  <Check className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-slate-300 text-xl font-medium">
                  Nenhuma demanda concluída
                </div>
                <div className="text-slate-400">
                  As demandas concluídas aparecerão aqui
                </div>
              </div>
            </div>
          ) : (
            eventsWithCompletedDemands.map((event) => {
              const completedDemands = event.demands.filter(demand => demand.completed);
              
              return (
                <div key={event.id} className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-6 shadow-2xl transition-all duration-300 hover:shadow-3xl">
                  <div className="flex items-center gap-4 pb-6 border-b border-slate-600/30 mb-6">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-lg flex-shrink-0 border-2 border-slate-600/30"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-bold text-white">{event.name}</h3>
                      <p className="text-green-300 text-sm font-medium">
                        {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-slate-400 text-sm">
                        {completedDemands.length} demanda(s) concluída(s)
                      </p>
                    </div>
                  </div>
                  
                  <div className="grid gap-4">
                    {completedDemands.map((demand) => (
                      <div
                        key={demand.id}
                        className="bg-slate-700/40 backdrop-blur-sm rounded-2xl border border-slate-600/30 p-5 transition-all duration-300 hover:bg-slate-700/60 hover:border-slate-500/40"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-semibold text-white mb-2 text-lg">{demand.title}</h4>
                            <p className="text-slate-300 text-sm mb-3 leading-relaxed">{demand.subject}</p>
                            <div className="flex gap-6 text-sm">
                              <span className="text-blue-300 font-medium">
                                Data: {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {demand.completedAt && (
                                <span className="text-green-300 font-medium">
                                  Concluída em: {format(new Date(demand.completedAt), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-3 flex-shrink-0 ml-6">
                            <Button
                              size="sm"
                              onClick={() => handleRestore(event.id, demand.id)}
                              className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              <RotateCcw className="w-4 h-4 mr-2" />
                              Restaurar
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleDelete(event.id, demand.id)}
                              className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-105"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
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
