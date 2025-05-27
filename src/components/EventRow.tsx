
import React, { useState, useEffect, useRef } from 'react';
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDemands = event.demands.filter(demand => !demand.completed);

  const checkScrollability = () => {
    if (containerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
      setScrollPosition(scrollLeft);
    }
  };

  useEffect(() => {
    checkScrollability();
    
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, [activeDemands]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const scrollAmount = 300;
    const newPosition = direction === 'left' 
      ? Math.max(0, scrollPosition - scrollAmount)
      : Math.min(containerRef.current.scrollWidth - containerRef.current.clientWidth, scrollPosition + scrollAmount);
    
    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
  };

  const handleCreateDemand = (demandData: Omit<Demand, 'id' | 'completed' | 'completedAt' | 'created_at' | 'updated_at'>) => {
    // Criar uma demanda com ID temporário UUID válido
    const tempId = `temp-${crypto.randomUUID()}`;
    const newDemand: Demand = {
      ...demandData,
      id: tempId,
      completed: false,
      completedAt: undefined
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
    <div className="bg-slate-800/40 backdrop-blur-lg rounded-2xl border border-slate-600/30 p-4 shadow-2xl mb-4">
      <div className="flex items-center gap-3">
        {/* Event Options */}
        <EventOptionsDropdown
          event={event}
          onUpdateEvent={onUpdateEvent}
          onArchiveEvent={onArchiveEvent}
          onDeleteEvent={onDeleteEvent}
        />

        {/* Event Logo and Info */}
        <div className="flex items-center gap-2">
          {event.logo && (
            <img
              src={event.logo}
              alt={event.name}
              className="w-12 h-12 rounded-lg object-cover shadow-lg flex-shrink-0"
            />
          )}
          
          <div className="w-[70px]">
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
              ref={containerRef}
              onScroll={checkScrollability}
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
