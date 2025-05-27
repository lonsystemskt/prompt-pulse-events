
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Archive, Check, Calendar } from "lucide-react";
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800">
      <div className="container mx-auto p-4 max-w-7xl">
        {/* Header Minimalista */}
        <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-8 mb-6 shadow-2xl">
          <div className="flex items-center justify-between w-full">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Calendar className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-bold text-white mb-1">
                    Lon Demandas
                  </h1>
                  <p className="text-blue-300/80 text-lg">Gerencie suas demandas com eficiência</p>
                </div>
              </div>
            </div>
            
            {/* Menu Minimalista */}
            <div className="flex items-center gap-3">
              <Button
                onClick={() => navigate('/archived-events')}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl px-4 py-2 font-medium transition-all duration-200 border border-slate-600/30"
              >
                <Archive className="w-4 h-4 mr-2" />
                Arquivados
              </Button>
              <Button
                onClick={() => navigate('/completed-demands')}
                variant="ghost"
                className="text-slate-300 hover:text-white hover:bg-slate-700/50 rounded-xl px-4 py-2 font-medium transition-all duration-200 border border-slate-600/30"
              >
                <Check className="w-4 h-4 mr-2" />
                Concluídas
              </Button>
              
              <Button
                onClick={() => setIsCreateEventOpen(true)}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-lg border-0 rounded-2xl px-6 py-2 font-medium transition-all duration-200 transform hover:scale-105"
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
            <div className="bg-slate-800/40 backdrop-blur-lg rounded-3xl border border-slate-600/30 p-16 text-center shadow-xl">
              <div className="flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-slate-700/50 rounded-2xl flex items-center justify-center">
                  <Calendar className="w-8 h-8 text-slate-400" />
                </div>
                <div className="text-slate-300 text-xl font-medium">
                  Nenhum evento criado ainda
                </div>
                <div className="text-slate-400">
                  Clique em "Novo Evento" para começar a organizar suas demandas
                </div>
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
