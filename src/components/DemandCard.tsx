
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
    
    if (isBefore(demandDate, today)) return 'bg-red-500'; // Atrasada
    if (isAfter(demandDate, tomorrow)) return 'bg-green-500'; // Para os próximos dias
    return 'bg-orange-500'; // Em dia
  };

  const handleComplete = () => {
    onUpdateDemand(demand.id, {
      completed: true,
      completedAt: new Date().toISOString()
    });
  };

  return (
    <div className="bg-white/15 backdrop-blur-md rounded-xl border border-white/30 p-4 min-w-[280px] shadow-lg hover:shadow-xl transition-all duration-300 hover:bg-white/20">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-3 h-3 rounded-full ${getStatusColor()}`} />
        <div className="flex gap-1">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setIsEditOpen(true)}
            className="h-6 w-6 p-0 text-white/70 hover:text-white hover:bg-white/20"
          >
            <Edit className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={handleComplete}
            className="h-6 w-6 p-0 text-green-400 hover:text-green-300 hover:bg-white/20"
          >
            <Check className="w-3 h-3" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            onClick={() => onDeleteDemand(demand.id)}
            className="h-6 w-6 p-0 text-red-400 hover:text-red-300 hover:bg-white/20"
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>

      <h3 className="font-medium text-white mb-2 text-sm">{demand.title}</h3>
      <p className="text-white/80 text-xs mb-3 line-clamp-2">{demand.subject}</p>
      
      <div className="text-blue-200 text-xs">
        {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
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
