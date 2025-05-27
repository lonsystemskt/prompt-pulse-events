
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check } from "lucide-react";
import { Demand } from "@/types/Event";
import { EditDemandDialog } from "./EditDemandDialog";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DemandOverviewCardProps {
  demand: Demand & { eventName: string; eventLogo?: string };
  eventName: string;
  eventLogo?: string;
  onUpdateDemand: (demandId: string, updatedDemand: Partial<Demand>) => void;
  onDeleteDemand: (demandId: string) => void;
}

export const DemandOverviewCard: React.FC<DemandOverviewCardProps> = ({
  demand,
  eventName,
  eventLogo,
  onUpdateDemand,
  onDeleteDemand,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusColor = () => {
    const today = new Date();
    const demandDate = new Date(demand.date);
    const tomorrow = addDays(today, 1);
    
    if (isBefore(demandDate, today)) return 'bg-red-400'; // Atrasada
    if (isAfter(demandDate, tomorrow)) return 'bg-green-400'; // Para os próximos dias
    return 'bg-orange-400'; // Em dia
  };

  const getStatusText = () => {
    const today = new Date();
    const demandDate = new Date(demand.date);
    const tomorrow = addDays(today, 1);
    
    if (isBefore(demandDate, today)) return 'Atrasada';
    if (isAfter(demandDate, tomorrow)) return 'No prazo';
    return 'Urgente';
  };

  const handleComplete = () => {
    onUpdateDemand(demand.id, {
      completed: true,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-slate-600/30 p-6 shadow-2xl hover:shadow-3xl transition-all duration-300 hover:bg-slate-800/50">
      <div className="flex items-center gap-4">
        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-2">
          <div className={`w-4 h-4 rounded-full ${getStatusColor()}`} />
          <span className="text-xs text-slate-400">{getStatusText()}</span>
        </div>

        {/* Event Logo */}
        <div className="flex-shrink-0">
          {eventLogo ? (
            <img
              src={eventLogo}
              alt={eventName}
              className="w-16 h-16 rounded-xl object-cover shadow-lg border border-slate-600/30"
            />
          ) : (
            <div className="w-16 h-16 rounded-xl bg-slate-700/50 flex items-center justify-center border border-slate-600/30">
              <span className="text-slate-400 text-xs font-medium text-center">
                {eventName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-xl font-semibold text-white truncate">{demand.title}</h3>
            <div className="flex gap-2 ml-4">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditOpen(true)}
                className="h-8 w-8 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleComplete}
                className="h-8 w-8 p-0 text-green-400 hover:text-green-300 hover:bg-slate-600/50"
              >
                <Check className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteDemand(demand.id)}
                className="h-8 w-8 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600/50"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>

          <p className="text-slate-300 text-sm mb-3 line-clamp-2">{demand.subject}</p>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-cyan-300 text-sm font-medium">
                Evento: {eventName}
              </span>
              <span className="text-blue-300 text-sm">
                Entrega: {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
              </span>
            </div>
          </div>
        </div>
      </div>

      <EditDemandDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        demand={demand}
        onUpdateDemand={onUpdateDemand}
      />
    </div>
  );
};
