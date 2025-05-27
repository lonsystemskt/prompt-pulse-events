
import React, { useState, useEffect, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, ChevronLeft, ChevronRight, Calendar } from "lucide-react";
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
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const activeDemands = event.demands.filter(demand => !demand.completed);

  const checkScrollability = () => {
    if (!containerRef.current) return;
    
    const { scrollLeft, scrollWidth, clientWidth } = containerRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 1);
  };

  useEffect(() => {
    checkScrollability();
    const handleResize = () => checkScrollability();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeDemands]);

  const scroll = (direction: 'left' | 'right') => {
    if (!containerRef.current) return;
    
    const scrollAmount = 260; // Card width + gap
    const newPosition = direction === 'left' 
      ? containerRef.current.scrollLeft - scrollAmount
      : containerRef.current.scrollLeft + scrollAmount;
    
    containerRef.current.scrollTo({ left: newPosition, behavior: 'smooth' });
    
    // Update scroll state after animation
    setTimeout(checkScrollability, 300);
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
    <div className="bg-slate-800/50 backdrop-blur-xl rounded-3xl border border-slate-600/40 p-6 shadow-2xl mb-4 transition-all duration-300 hover:shadow-3xl">
      <div className="flex items-center gap-4">
        {/* Event Options */}
        <EventOptionsDropdown
          event={event}
          onUpdateEvent={onUpdateEvent}
          onArchiveEvent={onArchiveEvent}
          onDeleteEvent={onDeleteEvent}
        />

        {/* Event Logo and Info */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {event.logo && (
            <img
              src={event.logo}
              alt={event.name}
              className="w-12 h-12 rounded-xl object-cover shadow-lg border-2 border-slate-600/30"
            />
          )}
          
          <div className="w-20">
            <h2 className="text-sm font-semibold text-white truncate">{event.name}</h2>
            <span className="text-blue-300 text-xs font-medium">
              {format(new Date(event.date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
          </div>
        </div>

        {/* Add Demand Button */}
        <Button
          onClick={() => setIsCreateDemandOpen(true)}
          size="sm"
          className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white rounded-full w-8 h-8 p-0 shadow-lg flex-shrink-0 border-0 transition-all duration-200 transform hover:scale-110"
        >
          <Plus className="w-4 h-4" />
        </Button>

        {/* Demands Section with Scroll */}
        <div className="flex-1 relative overflow-hidden">
          <div className="flex items-center">
            {/* Left Arrow */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('left')}
              disabled={!canScrollLeft}
              className={`absolute left-0 z-20 bg-slate-700/90 backdrop-blur-sm hover:bg-slate-600/90 text-white rounded-full w-8 h-8 p-0 border border-slate-500/50 shadow-lg transition-all duration-200 ${
                !canScrollLeft ? 'opacity-30' : 'hover:scale-110'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>

            {/* Cards Container */}
            <div
              ref={containerRef}
              onScroll={checkScrollability}
              className="flex gap-3 overflow-x-auto scrollbar-hide px-10 py-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              {activeDemands.length === 0 ? (
                <div className="text-slate-400 text-center py-4 flex-1 text-sm bg-slate-700/40 rounded-2xl border border-slate-600/30 backdrop-blur-sm min-w-[200px] flex-shrink-0">
                  <div className="flex flex-col items-center gap-2">
                    <Calendar className="w-5 h-5 text-slate-500" />
                    <span>Nenhuma demanda</span>
                  </div>
                </div>
              ) : (
                activeDemands.map((demand) => (
                  <div key={demand.id} className="flex-shrink-0">
                    <DemandCard
                      demand={demand}
                      onUpdateDemand={handleUpdateDemand}
                      onDeleteDemand={handleDeleteDemand}
                    />
                  </div>
                ))
              )}
            </div>

            {/* Right Arrow */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => scroll('right')}
              disabled={!canScrollRight}
              className={`absolute right-0 z-20 bg-slate-700/90 backdrop-blur-sm hover:bg-slate-600/90 text-white rounded-full w-8 h-8 p-0 border border-slate-500/50 shadow-lg transition-all duration-200 ${
                !canScrollRight ? 'opacity-30' : 'hover:scale-110'
              }`}
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
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
