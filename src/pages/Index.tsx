
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { EventRow } from "@/components/EventRow";
import { CreateEventDialog } from "@/components/CreateEventDialog";
import { ArchivedEventsDialog } from "@/components/ArchivedEventsDialog";
import { CompletedDemandsDialog } from "@/components/CompletedDemandsDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Event } from "@/types/Event";

const Index = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [archivedEvents, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);
  const [isCreateEventOpen, setIsCreateEventOpen] = useState(false);
  const [isArchivedOpen, setIsArchivedOpen] = useState(false);
  const [isCompletedOpen, setIsCompletedOpen] = useState(false);

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
        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 mb-6 shadow-2xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-white mb-2">
                Sistema de Gestão de Eventos
              </h1>
              <p className="text-blue-200">Gerencie seus eventos e demandas de forma eficiente</p>
            </div>
            <div className="flex gap-3">
              <Button
                onClick={() => setIsArchivedOpen(true)}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Eventos Arquivados
              </Button>
              <Button
                onClick={() => setIsCompletedOpen(true)}
                variant="outline"
                className="bg-white/10 border-white/30 text-white hover:bg-white/20"
              >
                Demandas Concluídas
              </Button>
              <Button
                onClick={() => setIsCreateEventOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white shadow-lg"
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
            <div className="bg-white/5 backdrop-blur-md rounded-2xl border border-white/10 p-12 text-center">
              <div className="text-white/60 text-lg">
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

      <ArchivedEventsDialog
        open={isArchivedOpen}
        onOpenChange={setIsArchivedOpen}
        archivedEvents={archivedEvents}
        setArchivedEvents={setArchivedEvents}
        events={events}
        setEvents={setEvents}
      />

      <CompletedDemandsDialog
        open={isCompletedOpen}
        onOpenChange={setIsCompletedOpen}
        events={events}
        onUpdateEvent={handleUpdateEvent}
      />
    </div>
  );
};

export default Index;
