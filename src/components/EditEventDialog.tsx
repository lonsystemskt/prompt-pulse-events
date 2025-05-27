
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Upload } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Event } from "@/types/Event";

interface EditEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Event;
  onUpdateEvent: (eventId: string, updatedEvent: Partial<Event>) => void;
}

export const EditEventDialog: React.FC<EditEventDialogProps> = ({
  open,
  onOpenChange,
  event,
  onUpdateEvent,
}) => {
  const [name, setName] = useState(event.name);
  const [logo, setLogo] = useState(event.logo || '');
  const [date, setDate] = useState<Date>(new Date(event.date));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setName(event.name);
    setLogo(event.logo || '');
    setDate(new Date(event.date));
  }, [event]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !date) return;

    onUpdateEvent(event.id, {
      name,
      logo,
      date: date.toISOString(),
    });

    onOpenChange(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setLogo(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    if (selectedDate) {
      setDate(selectedDate);
    }
    setIsCalendarOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Evento</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Evento</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Digite o nome do evento"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Logo do Evento</Label>
            <div className="flex items-center gap-4">
              {logo && (
                <img
                  src={logo}
                  alt="Logo"
                  className="w-12 h-12 rounded-lg object-cover border border-white/30"
                />
              )}
              <div className="flex-1">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  id="logo-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => document.getElementById('logo-upload')?.click()}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {logo ? 'Trocar Logo' : 'Upload Logo'}
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Data do Evento</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR })}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900 border-white/20">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  initialFocus
                  className="bg-slate-900 text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Salvar Alterações
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
