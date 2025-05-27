
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";
import { Event, Demand } from "@/types/Event";
import { DemandCard } from "./DemandCard";
import { CreateDemandDialog } from "./CreateDemandDialog";
import { EventOptionsDropdown } from "./EventOptionsDropdown";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface EventRowProps {
  event: Event;
  onUpdateEvent: (eventId: string, updatedEvent: Partial<Event>) => void;
  onArchiveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventRow: React.FC<EventRowProps> = ({
  event,
  onUpdateEvent,
  onArchiveEvent,
  onDeleteEvent,
}) => {
  const [isCreateDemandOpen, setIsCreateDemandOpen] = useState(false);
  const [scrollPosition, setScrollPosition] = useState(0);
  const [containerRef, setContainerRef] = useState<HTMLDivElement | null>(null);

  const activeDemands = event.demands.filter(demand => !demand.completed);
  const canScrollLeft = scrollPosition > 0;
  const canScrollRight = containerRef && 
    containerRef.scrollWidth > containerRef.clientWidth && 
    scrollPosition < containerRef.scrollWidth - containerRef.clientWidth;

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(containerRef.scrollWidth - containerRef.clientWidth, scrollPosition + scrollAmount);
    
    containerRef.scrollTo({ left: newPosition, behavior: 'smooth' });
    setScrollPosition(newPosition);
  };

  const handleCreateDemand = (demandData: Omit<Demand, 'id' | 'completed'>) => {
    const newDemand: Demand = {
      ...demandData,
      id: Date.now().toString(),
      completed: false
    };
    
    onUpdateEvent(event.id, {
      demands: [...event.demands, newDemand]
    });
  };

  const handleUpdateDemand = (demandId: string, updatedDemand: Partial<Demand>) => {
    const updatedDemands = event.demands.map(demand =>
      demand.id === demandId ? { ...demand, ...updatedDemand } : demand
    );
    onUpdateEvent(event.id, { demands: updatedDemands });
  };

  const handleDeleteDemand = (demandId: string) => {
    const updatedDemands = event.demands.filter(demand => demand.id !== demandId);
    onUpdateEvent(event.id, { demands: updatedDemands });
  };

  return (
    <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-6 shadow-xl">
      <div className="flex items-center gap-4 mb-4">
        <EventOptionsDropdown
          event={event}
          onUpdateEvent={onUpdateEvent}
          onArchiveEvent={onArchiveEvent}
          onDeleteEvent={onDeleteEvent}
        />
        
        <div className="flex items-center gap-4 flex-1">
          <h2 className="text-xl font-semibold text-white">{event.name}</h2>
          <span className="text-blue-200 text-sm">
            {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
          </span>
        </div>

        <Button
          onClick={() => setIsCreateDemandOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <Plus className="w-4 h-4 mr-1" />
          Nova Demanda
        </Button>
      </div>

      <div className="relative">
        <div className="flex items-center">
          {canScrollLeft && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              className="absolute left-0 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-8 h-8 p-0"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          )}

          <div
            ref={setContainerRef}
            onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
            className="flex gap-4 overflow-x-auto scrollbar-hide px-8"
            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          >
            {activeDemands.length === 0 ? (
              <div className="text-white/60 text-center py-8 flex-1">
                Nenhuma demanda criada ainda
              </div>
            ) : (
              activeDemands.map((demand) => (
                <DemandCard
                  key={demand.id}
                  demand={demand}
                  onUpdateDemand={handleUpdateDemand}
                  onDeleteDemand={handleDeleteDemand}
                />
              ))
            )}
          </div>

          {canScrollRight && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              className="absolute right-0 z-10 bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white rounded-full w-8 h-8 p-0"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <CreateDemandDialog
        open={isCreateDemandOpen}
        onOpenChange={setIsCreateDemandOpen}
        onCreateDemand={handleCreateDemand}
      />
    </div>
  );
};
