
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
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-slate-600/30 p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-slate-800/50">
      <div className="flex items-center gap-3">
        {/* Status Indicator */}
        <div className="flex flex-col items-center gap-1">
          <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
          <span className="text-xs text-slate-400 text-center leading-tight">{getStatusText()}</span>
        </div>

        {/* Event Logo */}
        <div className="flex-shrink-0">
          {eventLogo ? (
            <img
              src={eventLogo}
              alt={eventName}
              className="w-10 h-10 rounded-lg object-cover shadow border border-slate-600/30"
            />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-slate-700/50 flex items-center justify-center border border-slate-600/30">
              <span className="text-slate-400 text-xs font-medium">
                {eventName.substring(0, 2).toUpperCase()}
              </span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-1">
            <h3 className="text-lg font-semibold text-white truncate">{demand.title}</h3>
            <div className="flex gap-1 ml-2">
              <Button
                size="sm"
                variant="ghost"
                onClick={() => setIsEditOpen(true)}
                className="h-6 w-6 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
              >
                <Edit className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleComplete}
                className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-slate-600/50"
              >
                <Check className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteDemand(demand.id)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600/50"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>

          <p className="text-slate-300 text-xs mb-2 line-clamp-1">{demand.subject}</p>

          <div className="flex items-center justify-between text-xs">
            <span className="text-cyan-300 font-medium truncate">
              {eventName}
            </span>
            <span className="text-blue-300 ml-2">
              {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
            </span>
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
