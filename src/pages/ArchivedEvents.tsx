
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { useNavigate } from "react-router-dom";
import { Navigation } from "@/components/Navigation";

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
      <Navigation />
      
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header */}
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
                  Eventos Arquivados
                </h1>
                <p className="text-blue-300">Gerencie seus eventos arquivados</p>
              </div>
            </div>
          </div>
        </div>

        {/* Archived Events List */}
        <div className="space-y-4">
          {archivedEvents.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhum evento arquivado
              </div>
            </div>
          ) : (
            archivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-4 shadow-2xl mb-4"
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
                      <span className="text-blue-300 text-sm">
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
                      className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/30 transition-all duration-200 text-sm px-3 py-2"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      size="sm"
                      className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/30 transition-all duration-200 text-sm px-3 py-2"
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
