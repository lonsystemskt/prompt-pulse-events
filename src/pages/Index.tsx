
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Archive, Check } from "lucide-react";
import { EventRow } from "@/components/EventRow";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Event } from "@/types/Event";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [archivedEvents, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);

  const handleCreateEvent = (eventData: Omit<Event, 'id' | 'demands'>) => {
    const newEvent: Event = {
      ...eventData,
      id: Date.now().toString(),
      demands: []
    };
    setEvents([...events, newEvent]);
  };

  const handleUpdateEvent = (eventId: string, updatedEvent: Partial<Event>) => {
    setEvents(events.map(event => 
      event.id === eventId ? { ...event, ...updatedEvent } : event
    ));
  };

  const handleArchiveEvent = (eventId: string) => {
    const eventToArchive = events.find(event => event.id === eventId);
    if (eventToArchive) {
      setArchivedEvents([...archivedEvents, eventToArchive]);
      setEvents(events.filter(event => event.id !== eventId));
    }
  };

  const handleDeleteEvent = (eventId: string) => {
    setEvents(events.filter(event => event.id !== eventId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 p-4">
      <div className="max-w-[calc(100vw-30px)] mx-auto">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Dashboard de Eventos
              </h1>
              <p className="text-blue-300">Gerencie seus eventos e demandas</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => navigate('/archived-events')}
                variant="outline"
                className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg"
              >
                <Archive className="w-4 h-4 mr-2" />
                Arquivados
              </Button>
              <Button
                onClick={() => navigate('/completed-demands')}
                variant="outline"
                className="bg-slate-800/40 border-slate-600/30 text-white hover:bg-slate-700/50 backdrop-blur-lg"
              >
                <Check className="w-4 h-4 mr-2" />
                Concluídas
              </Button>
              <Button
                onClick={() => setIsCreateEventOpen(true)}
                className="bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm text-white shadow-lg border border-blue-400/30"
              >
                <Plus className="w-4 h-4 mr-2" />
                Novo Evento
              </Button>
            </div>
          </div>
        </div>

        {/* Events List */}
        <div className="space-y-4">
          {events.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-12 text-center shadow-xl">
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

      {/* Dialogs */}
      <CreateEventDialog
        open={isCreateEventOpen}
        onOpenChange={setIsCreateEventOpen}
        onCreateEvent={handleCreateEvent}
      />
    </div>
  );
};

export default Index;
