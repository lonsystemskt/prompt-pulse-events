
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { RotateCcw, Trash2 } from "lucide-react";
import { Event } from "@/types/Event";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface CompletedDemandsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  events: Event[];
  onUpdateEvent: (eventId: string, updatedEvent: Partial<Event>) => void;
}

export const CompletedDemandsDialog: React.FC<CompletedDemandsDialogProps> = ({
  open,
  onOpenChange,
  events,
  onUpdateEvent,
}) => {
  const eventsWithCompletedDemands = events.filter(event => 
    event.demands.some(demand => demand.completed)
  );

  const handleRestore = (eventId: string, demandId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const updatedDemands = event.demands.map(demand =>
        demand.id === demandId ? { ...demand, completed: false, completedAt: undefined } : demand
      );
      onUpdateEvent(eventId, { demands: updatedDemands });
    }
  };

  const handleDelete = (eventId: string, demandId: string) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      const updatedDemands = event.demands.filter(demand => demand.id !== demandId);
      onUpdateEvent(eventId, { demands: updatedDemands });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Demandas Concluídas</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {eventsWithCompletedDemands.length === 0 ? (
            <div className="text-white/60 text-center py-8">
              Nenhuma demanda concluída
            </div>
          ) : (
            eventsWithCompletedDemands.map((event) => {
              const completedDemands = event.demands.filter(demand => demand.completed);
              
              return (
                <div key={event.id} className="space-y-3">
                  <div className="flex items-center gap-3 pb-2 border-b border-white/20">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-8 h-8 rounded-lg object-cover"
                      />
                    )}
                    <h3 className="font-medium text-white">{event.name}</h3>
                  </div>
                  
                  <div className="grid gap-3">
                    {completedDemands.map((demand) => (
                      <div
                        key={demand.id}
                        className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <h4 className="font-medium text-white mb-1">{demand.title}</h4>
                            <p className="text-white/80 text-sm mb-2">{demand.subject}</p>
                            <div className="flex gap-4 text-xs text-blue-200">
                              <span>
                                Data: {format(new Date(demand.date), "dd/MM/yyyy", { locale: ptBR })}
                              </span>
                              {demand.completedAt && (
                                <span>
                                  Concluída em: {format(new Date(demand.completedAt), "dd/MM/yyyy", { locale: ptBR })}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => handleRestore(event.id, demand.id)}
                              className="bg-green-600 hover:bg-green-700"
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restaurar
                            </Button>
                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(event.id, demand.id)}
                              className="bg-red-600 hover:bg-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-1" />
                              Excluir
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
