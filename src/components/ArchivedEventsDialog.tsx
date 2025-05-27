
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

interface ArchivedEventsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  archivedEvents: Event[];
  setArchivedEvents: (events: Event[]) => void;
  events: Event[];
  setEvents: (events: Event[]) => void;
}

export const ArchivedEventsDialog: React.FC<ArchivedEventsDialogProps> = ({
  open,
  onOpenChange,
  archivedEvents,
  setArchivedEvents,
  events,
  setEvents,
}) => {
  const handleRestore = (eventId: string) => {
    const eventToRestore = archivedEvents.find(event => event.id === eventId);
    if (eventToRestore) {
      setEvents([...events, eventToRestore]);
      setArchivedEvents(archivedEvents.filter(event => event.id !== eventId));
    }
  };

  const handleDelete = (eventId: string) => {
    setArchivedEvents(archivedEvents.filter(event => event.id !== eventId));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Eventos Arquivados</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {archivedEvents.length === 0 ? (
            <div className="text-white/60 text-center py-8">
              Nenhum evento arquivado
            </div>
          ) : (
            archivedEvents.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-md rounded-xl border border-white/20 p-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {event.logo && (
                      <img
                        src={event.logo}
                        alt={event.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                    )}
                    <div>
                      <h3 className="font-medium text-white">{event.name}</h3>
                      <p className="text-blue-200 text-sm">
                        {format(new Date(event.date), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleRestore(event.id)}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <RotateCcw className="w-4 h-4 mr-1" />
                      Restaurar
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(event.id)}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      <Trash2 className="w-4 h-4 mr-1" />
                      Excluir
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
