
import React, { useMemo } from 'react';
import { Navigation } from "@/components/Navigation";
import { DemandOverviewCard } from "@/components/DemandOverviewCard";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Event } from "@/types/Event";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";

const Overview = () => {
  const [events] = useLocalStorage<Event[]>('events', []);
  const [archivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);

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

  // Dados para o gráfico
  const chartData = useMemo(() => {
    const eventDemandCounts = allEvents.map(event => ({
      name: event.name,
      demands: event.demands.filter(demand => !demand.completed).length
    })).filter(item => item.demands > 0);

    return eventDemandCounts;
  }, [allEvents]);

  const chartConfig = {
    demands: {
      label: "Demandas",
      color: "hsl(var(--chart-1))",
    },
  };

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
    const [, setEvents] = useLocalStorage<Event[]>('events', []);
    const [, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);
    
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
    const [, setEvents] = useLocalStorage<Event[]>('events', []);
    const [, setArchivedEvents] = useLocalStorage<Event[]>('archivedEvents', []);
    
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

        {/* Gráfico de Demandas por Evento */}
        {chartData.length > 0 && (
          <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-6 shadow-2xl">
            <h2 className="text-2xl font-semibold text-white mb-4">Demandas por Evento</h2>
            <div className="h-64">
              <ChartContainer config={chartConfig}>
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData}>
                    <XAxis 
                      dataKey="name" 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <YAxis 
                      tick={{ fill: '#94a3b8', fontSize: 12 }}
                      axisLine={{ stroke: '#475569' }}
                    />
                    <ChartTooltip 
                      content={<ChartTooltipContent />}
                      cursor={{ stroke: '#06b6d4', strokeWidth: 2 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="demands" 
                      stroke="#06b6d4"
                      strokeWidth={3}
                      dot={{ fill: '#06b6d4', strokeWidth: 2, r: 6 }}
                      activeDot={{ r: 8, stroke: '#0891b2', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
            
            {/* Resumo numérico */}
            <div className="mt-4 flex flex-wrap gap-4">
              {chartData.map((item) => (
                <div key={item.name} className="bg-slate-700/50 rounded-lg p-3 flex items-center gap-3">
                  <div className="w-3 h-3 bg-cyan-400 rounded-full"></div>
                  <span className="text-white font-medium">{item.name}</span>
                  <span className="text-cyan-300 font-bold">{item.demands}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Lista de Demandas */}
        <div className="space-y-4">
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
