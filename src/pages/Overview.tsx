
import React from 'react';
import { Navigation } from "@/components/Navigation";
import { DemandOverviewCard } from "@/components/DemandOverviewCard";
import { useRealtimeEvents } from "@/hooks/useRealtimeEvents";
import { supabase } from '@/integrations/supabase/client';

const Overview = () => {
  const { events, archivedEvents, loading } = useRealtimeEvents();

  // Combinar todos os eventos (ativos + arquivados)
  const allEvents = [...events, ...archivedEvents];

  // Extrair todas as demandas ativas de todos os eventos
  const allActiveDemands = allEvents.flatMap(event => 
    event.demands
      .filter(demand => !demand.completed)
      .map(demand => ({ ...demand, eventName: event.name, eventLogo: event.logo }))
  );

  const handleUpdateDemand = async (demandId: string, updatedDemand: any) => {
    try {
      const { error } = await supabase
        .from('demands')
        .update({
          title: updatedDemand.title,
          subject: updatedDemand.subject,
          date: updatedDemand.date,
          urgency: updatedDemand.urgency,
          completed: updatedDemand.completed,
          completed_at: updatedDemand.completedAt
        })
        .eq('id', demandId);

      if (error) throw error;
      // O realtime irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao atualizar demanda:', error);
    }
  };

  const handleDeleteDemand = async (demandId: string) => {
    try {
      const { error } = await supabase
        .from('demands')
        .delete()
        .eq('id', demandId);

      if (error) throw error;
      // O realtime irá atualizar automaticamente
    } catch (error) {
      console.error('Erro ao deletar demanda:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando visão geral...</div>
      </div>
    );
  }

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
