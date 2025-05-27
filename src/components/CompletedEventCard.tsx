
import React from 'react';
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { Demand } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompletedEventCardProps {
  demand: Demand & { eventName: string; eventLogo?: string };
  eventName: string;
  eventLogo?: string;
  onRestoreDemand: (demandId: string) => void;
  onDeleteDemand: (demandId: string) => void;
}

export const CompletedEventCard: React.FC<CompletedEventCardProps> = ({
  demand,
  eventName,
  eventLogo,
  onRestoreDemand,
  onDeleteDemand,
}) => {
  const handleRestore = () => {
    onRestoreDemand(demand.id);
  };

  return (
    <div className="bg-slate-800/40 backdrop-blur-xl rounded-lg border border-slate-600/30 p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-slate-800/50">
      <div className="flex items-center gap-3">
        {/* Status Indicator - Green for completed */}
        <div className="flex flex-col items-center gap-1">
          <div className="w-3 h-3 rounded-full bg-green-400" />
          <span className="text-xs text-slate-400 text-center leading-tight">Concluído</span>
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
                onClick={handleRestore}
                className="h-6 w-6 p-0 text-blue-400 hover:text-blue-300 hover:bg-slate-600/50"
                title="Restaurar demanda"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onDeleteDemand(demand.id)}
                className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600/50"
                title="Excluir permanentemente"
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
            <div className="flex gap-3 ml-2">
              <span className="text-blue-300">
                {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
              </span>
              {demand.completedAt && (
                <span className="text-green-300">
                  Concluído: {format(new Date(demand.completedAt), "dd/MM/yyyy", { locale: ptBR })}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
