
import React, { useState } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreVertical, Edit, Archive, Trash2 } from "lucide-react";
import { Event } from "@/types/Event";
import { EditEventDialog } from "./EditEventDialog";

interface EventOptionsDropdownProps {
  event: Event;
  onUpdateEvent: (eventId: string, updatedEvent: Partial<Event>) => void;
  onArchiveEvent: (eventId: string) => void;
  onDeleteEvent: (eventId: string) => void;
}

export const EventOptionsDropdown: React.FC<EventOptionsDropdownProps> = ({
  event,
  onUpdateEvent,
  onArchiveEvent,
  onDeleteEvent,
}) => {
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="text-white/70 hover:text-white hover:bg-white/20 w-8 h-8 p-0"
          >
            {event.logo ? (
              <img
                src={event.logo}
                alt={event.name}
                className="w-6 h-6 rounded object-cover"
              />
            ) : (
              <MoreVertical className="w-4 h-4" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white">
          <DropdownMenuItem
            onClick={() => setIsEditOpen(true)}
            className="hover:bg-white/20 cursor-pointer"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onArchiveEvent(event.id)}
            className="hover:bg-white/20 cursor-pointer"
          >
            <Archive className="w-4 h-4 mr-2" />
            Arquivar evento
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => onDeleteEvent(event.id)}
            className="hover:bg-red-500/20 text-red-400 cursor-pointer"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Excluir permanentemente
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <EditEventDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        event={event}
        onUpdateEvent={onUpdateEvent}
      />
    </>
  );
};
