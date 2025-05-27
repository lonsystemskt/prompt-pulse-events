
import React, { useMemo } from 'react';
import { Navigation } from "@/components/Navigation";
import { DemandOverviewCard } from "@/components/DemandOverviewCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Event } from "@/types/Event";

const Overview = () => {
  const [events, setEvents] = useLocalStorage<Event[]>('events', []);
  const [archivedEvents, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);

  // Combinar todos os eventos (ativos + arquivados)
  const allEvents = useMemo(() => [...events, ...archivedEvents], [events, archivedEvents]);

  // Extrair todas as demandas ativas de todos os eventos
  const allActiveDemands = useMemo(() => {
    return allEvents.flatMap(event => 
      event.demands
        .filter(demand => !demand.completed)
        .map(demand => ({ ...demand, eventName: event.name, eventLogo: event.logo }))
    );
  }, [allEvents]);

  const handleUpdateDemand = (demandId: string, updatedDemand: any) => {
    // Encontrar e atualizar a demanda no evento correto
    const updateEventDemands = (eventsList: Event[], setEventsList: (events: Event[]) => void) => {
      const updatedEvents = eventsList.map(event => {
        const demandIndex = event.demands.findIndex(d => d.id === demandId);
        if (demandIndex !== -1) {
          const updatedDemands = [...event.demands];
          updatedDemands[demandIndex] = { ...updatedDemands[demandIndex], ...updatedDemand };
          return { ...event, demands: updatedDemands };
        }
        return event;
      });
      setEventsList(updatedEvents);
    };

    // Atualizar em ambas as listas
    updateEventDemands(events, setEvents);
    updateEventDemands(archivedEvents, setArchivedEvents);
  };

  const handleDeleteDemand = (demandId: string) => {
    // Encontrar e remover a demanda do evento correto
    const updateEventDemands = (eventsList: Event[], setEventsList: (events: Event[]) => void) => {
      const updatedEvents = eventsList.map(event => {
        const updatedDemands = event.demands.filter(d => d.id !== demandId);
        if (updatedDemands.length !== event.demands.length) {
          return { ...event, demands: updatedDemands };
        }
        return event;
      });
      setEventsList(updatedEvents);
    };

    // Remover de ambas as listas
    updateEventDemands(events, setEvents);
    updateEventDemands(archivedEvents, setArchivedEvents);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-6 shadow-2xl">
          <h1 className="text-4xl font-bold text-white mb-2">
            Visão Geral
          </h1>
          <p className="text-cyan-300">Todas as demandas em uma única visualização</p>
        </div>

        {/* Lista de Demandas */}
        <div className="space-y-2">
          {allActiveDemands.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhuma demanda ativa encontrada.
              </div>
            </div>
          ) : (
            allActiveDemands.map((demand) => (
              <DemandOverviewCard
                key={demand.id}
                demand={demand}
                eventName={demand.eventName}
                eventLogo={demand.eventLogo}
                onUpdateDemand={handleUpdateDemand}
                onDeleteDemand={handleDeleteDemand}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;
