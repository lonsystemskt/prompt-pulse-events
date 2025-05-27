
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Check } from "lucide-react";
import { Demand } from "@/types/Event";
import { EditDemandDialog } from "./EditDemandDialog";
import { format, isAfter, isBefore, addDays } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DemandCardProps {
  demand: Demand;
  onUpdateDemand: (demandId: string, updatedDemand: Partial<Demand>) => void;
  onDeleteDemand: (demandId: string) => void;
}

export const DemandCard: React.FC<DemandCardProps> = ({
  demand,
  onUpdateDemand,
  onDeleteDemand,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  const getStatusColor = () => {
    const today = new Date();
    const demandDate = new Date(demand.date);
    const tomorrow = addDays(today, 1);
    
    if (isBefore(demandDate, today)) return 'bg-red-500 shadow-red-500/30'; // Atrasada
    if (isAfter(demandDate, tomorrow)) return 'bg-green-500 shadow-green-500/30'; // Para os próximos dias
    return 'bg-orange-500 shadow-orange-500/30'; // Em dia
  };

  const handleComplete = () => {
    onUpdateDemand(demand.id, {
      completed: true,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-700/50 backdrop-blur-xl rounded-2xl border border-slate-600/40 p-4 shadow-xl hover:shadow-2xl transition-all duration-300 hover:bg-slate-700/60 hover:border-slate-500/50 w-[240px] h-[110px] min-w-[240px] transform hover:scale-105">
      <div className="flex items-start justify-between mb-2">
        <div className={`w-3 h-3 rounded-full shadow-lg ${getStatusColor()}`} />
        <div className="flex gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditOpen(true)}
            className="h-6 w-6 p-0 text-slate-400 hover:text-white hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleComplete}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteDemand(demand.id)}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600/50 rounded-lg transition-all duration-200"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <h3 className="font-semibold text-white mb-2 text-sm leading-tight truncate">{demand.title}</h3>
      <p className="text-slate-300 text-xs mb-2 line-clamp-2 leading-relaxed">{demand.subject}</p>
      
      <div className="text-blue-300 text-xs font-medium">
        {format(new Date(demand.date), "dd/MM", { locale: ptBR })}
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
