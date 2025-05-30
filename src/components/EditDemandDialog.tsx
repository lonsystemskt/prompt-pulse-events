
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Demand } from "@/types/Event";
import { OptimizedButton } from "@/components/OptimizedButton";

interface EditDemandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  demand: Demand;
  onUpdateDemand: (demandId: string, updatedDemand: Partial<Demand>) => void;
}

export const EditDemandDialog: React.FC<EditDemandDialogProps> = ({
  open,
  onOpenChange,
  demand,
  onUpdateDemand,
}) => {
  const [title, setTitle] = useState(demand.title);
  const [subject, setSubject] = useState(demand.subject);
  const [date, setDate] = useState<Date>(new Date(demand.date));
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  useEffect(() => {
    setTitle(demand.title);
    setSubject(demand.subject);
    setDate(new Date(demand.date));
  }, [demand]);

  const handleSubmit = useCallback(async () => {
    if (!title.trim() || !subject.trim() || !date) {
      console.log('Campos obrigatórios não preenchidos na edição');
      return;
    }

    console.log('Atualizando demanda:', demand.id, {
      title: title.trim(),
      subject: subject.trim(),
      date: date.toISOString(),
    });

    await onUpdateDemand(demand.id, {
      title: title.trim(),
      subject: subject.trim(),
      date: date.toISOString(),
    });

    setIsCalendarOpen(false);
    onOpenChange(false);
  }, [title, subject, date, demand.id, onUpdateDemand, onOpenChange]);

  const handleDateSelect = useCallback((selectedDate: Date | undefined) => {
    console.log('Data selecionada para edição:', selectedDate);
    if (selectedDate) {
      setDate(selectedDate);
      setIsCalendarOpen(false);
    }
  }, []);

  const formattedDate = useMemo(() => {
    return format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR });
  }, [date]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Editar Demanda</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título da Demanda</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Digite o título"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject">Assunto</Label>
            <Textarea
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Descreva o assunto da demanda"
              className="bg-white/10 border-white/30 text-white placeholder:text-white/60 min-h-[80px]"
              required
            />
          </div>

          <div className="space-y-2">
            <Label>Data da Demanda</Label>
            <Popover open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
              <PopoverTrigger asChild>
                <OptimizedButton
                  type="button"
                  variant="outline"
                  className="w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formattedDate}
                </OptimizedButton>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-800 border-white/20 z-50" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <OptimizedButton
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Cancelar
            </OptimizedButton>
            <OptimizedButton
              onClick={handleSubmit}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              Salvar Alterações
            </OptimizedButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
