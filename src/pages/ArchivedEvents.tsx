
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowLeft, RotateCcw, Trash2 } from "lucide-react";
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
        {/* Header - Same height as main page */}
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-6 mb-6 shadow-2xl h-[120px] flex items-center">
          <div className="flex items-center gap-4 w-full">
            <Button
              onClick={() => navigate('/')}
              variant="ghost"
              className="text-white hover:bg-slate-700/50 p-2 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-white mb-2">
                Eventos Arquivados
              </h1>
              <p className="text-blue-300">Gerencie seus eventos arquivados</p>
            </div>
          </div>
        </div>

        {/* Navigation - Consistent with main page */}
        <div className="flex gap-3 mb-6">
          <Button
            onClick={() => navigate('/')}
            variant="outline"
            className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
          >
            Dashboard
          </Button>
          <Button
            onClick={() => navigate('/completed-demands')}
            variant="outline"
            className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg transition-all duration-200"
          >
            Demandas Concluídas
          </Button>
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
                className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-6 shadow-xl transition-all duration-200 hover:shadow-2xl"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-16 h-16 rounded-xl object-cover shadow-lg flex-shrink-0"
                      />
                    )}
                    <div>
                      <h3 className="text-xl font-semibold text-white mb-1">{event.name}</h3>
                      <p className="text-blue-300 text-sm">
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                      <p className="text-slate-400 text-sm mt-1">
                        {event.demands.length} demanda(s)
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-shrink-0">
                    <Button
                      onClick={() => handleRestore(event.id)}
                      className="bg-green-500/80 hover:bg-green-600/80 backdrop-blur-sm border border-green-400/30 transition-all duration-200"
                    >
                      <RotateCcw className="w-4 h-4 mr-2" />
                      Restaurar
                    </Button>
                    <Button
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-500/80 hover:bg-red-600/80 backdrop-blur-sm border border-red-400/30 transition-all duration-200"
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
