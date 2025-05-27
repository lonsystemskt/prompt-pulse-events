
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
    
    if (isBefore(demandDate, today)) return 'bg-red-400'; // Atrasada
    if (isAfter(demandDate, tomorrow)) return 'bg-green-400'; // Para os próximos dias
    return 'bg-orange-400'; // Em dia
  };

  const handleComplete = () => {
    onUpdateDemand(demand.id, {
      completed: true,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-slate-700/40 backdrop-blur-lg rounded-xl border border-slate-600/30 p-2 min-w-[140px] shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-slate-700/50 h-[60px]">
      <div className="flex items-start justify-between mb-1">
        <div className={`w-1.5 h-1.5 rounded-full ${getStatusColor()}`} />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditOpen(true)}
            className="h-4 w-4 p-0 text-slate-300 hover:text-white hover:bg-slate-600/50"
          >
            <Edit className="w-2 h-2" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleComplete}
            className="h-4 w-4 p-0 text-green-400 hover:text-green-300 hover:bg-slate-600/50"
          >
            <Check className="w-2 h-2" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteDemand(demand.id)}
            className="h-4 w-4 p-0 text-red-400 hover:text-red-300 hover:bg-slate-600/50"
          >
            <Trash2 className="w-2 h-2" />
          </Button>
        </div>
      </div>

      <h3 className="font-medium text-white mb-1 text-xs leading-tight truncate">{demand.title}</h3>
      <p className="text-slate-300 text-xs mb-1 line-clamp-1 leading-tight">{demand.subject}</p>
      
      <div className="text-blue-300 text-xs">
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
