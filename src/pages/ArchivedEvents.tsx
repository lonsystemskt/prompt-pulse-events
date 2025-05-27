
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2, Archive, Check, Calendar } from "lucide-react";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";

const ArchivedEvents = () => {
  const navigate = useNavigate();
  const [archivedEvents, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);

  const handleRestore = (eventId: string) => {
    const eventToRestore = archivedEvents.find(event => event.id === eventId);
    if (eventToRestore) {
      setEvents([...events, eventToRestore]);
      setArchivedEvents(archivedEvents.filter(event => event.id !== eventId));
    }
  };

  const handleDelete = (eventId: string) => {
    setArchivedEvents(archivedEvents.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header com nova identidade visual */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6 flex-1">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Archive className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Eventos Arquivados
                  </h1>
                  <p className="text-orange-300/80 text-lg">Gerencie seus eventos arquivados</p>
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
                  className="bg-orange-500/80 text-white hover:bg-orange-600/90 rounded-xl px-6 py-3 font-medium transition-all duration-200 shadow-md"
                >
                  <Archive className="w-4 h-4 mr-2" />
                  Arquivados
                </Button>
                <Button
                  onClick={() => navigate('/completed-demands')}
                  variant="ghost"
                  className="text-slate-300 hover:text-white hover:bg-slate-600/50 rounded-xl px-6 py-3 font-medium transition-all duration-200"
                >
                  <Check className="w-4 h-4 mr-2" />
                  Concluídas
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Archived Events List */}
        <div className="space-y-4">
          {archivedEvents.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl border border-slate-600/30 p-16 text-center shadow-xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                  <Archive className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-slate-300 text-xl font-medium">
                  Nenhum evento arquivado
                </div>
                <div className="text-slate-400">
                  Os eventos arquivados aparecerão aqui
                </div>
              </div>
            </div>
          ) : (
            archivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-6 shadow-2xl mb-4 transition-all duration-300 hover:shadow-3xl"
              >
                <div className="flex items-center gap-4">
                  {/* Event Logo and Info - Logo aumentada */}
                  <div className="flex items-center gap-4 min-w-0 flex-1">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-12 h-12 rounded-xl object-cover shadow-lg flex-shrink-0 border-2 border-slate-600/30"
                      />
                    )}
                    
                    <div className="min-w-0 flex-1">
                      <h2 className="text-lg font-semibold text-white truncate">{event.name}</h2>
                      <span className="text-orange-300 text-sm font-medium">
                        {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <p className="text-slate-400 text-sm">
                        {event.demands.length} demanda(s) • Arquivado
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      onClick={() => handleRestore(event.id)}
                      size="sm"
                      className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      size="sm"
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white border-0 rounded-xl px-4 py-2 font-medium transition-all duration-200 transform hover:scale-105"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
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
