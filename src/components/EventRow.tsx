
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
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-4 shadow-2xl mb-4 w-[220px] h-[80px]">
      <div className="flex items-center gap-3 h-full">
        {/* Event Options */}
        <EventOptionsDropdown
          event={event}
          onUpdateEvent={onUpdateEvent}
          onArchiveEvent={onArchiveEvent}
          onDeleteEvent={onDeleteEvent}
        />

        {/* Event Logo and Info */}
        <div className="flex items-center min-w-0 flex-1" style={{ gap: '40px' }}>
          {event.logo && (
            <img
              src={event.logo}
              alt={event.name}
              className="w-8 h-8 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
          )}
          
          <div className="min-w-0 flex-1 w-[100px]">
            <h2 className="text-sm font-semibold text-white truncate">{event.name}</h2>
            <span className="text-blue-300 text-xs">
              {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Add Demand Button */}
        <Button
          onClick={() => setIsCreateDemandOpen(true)}
          size="sm"
          className="bg-blue-500/80 hover:bg-blue-600/80 backdrop-blur-sm text-white rounded-full w-6 h-6 p-0 shadow-lg flex-shrink-0 border border-blue-400/30"
        >
          <Plus className="w-3 h-3" />
        </Button>

        {/* Demands Section with Navigation */}
        <div className="flex-1 relative min-w-0">
          <div className="flex items-center">
            {canScrollLeft && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => scroll('left')}
                className="absolute left-0 z-10 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 text-white rounded-full w-5 h-5 p-0 border border-slate-500/30 shadow-lg"
              >
                <ChevronLeft className="w-2 h-2" />
              </Button>
            )}

            <div
              ref={setContainerRef}
              onScroll={(e) => setScrollPosition(e.currentTarget.scrollLeft)}
              className="flex gap-2 overflow-x-auto scrollbar-hide px-4"
            >
              {activeDemands.length === 0 ? (
                <div className="text-slate-400 text-center py-2 flex-1 text-xs bg-slate-700/30 rounded-xl border border-slate-600/20 backdrop-blur-sm min-w-[120px]">
                  Nenhuma demanda
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
                className="absolute right-0 z-10 bg-slate-700/80 backdrop-blur-sm hover:bg-slate-600/80 text-white rounded-full w-5 h-5 p-0 border border-slate-500/30 shadow-lg"
              >
                <ChevronRight className="w-2 h-2" />
              </Button>
            )}
          </div>
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
