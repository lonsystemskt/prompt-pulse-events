
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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

interface CreateDemandDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateDemand: (demandData: Omit<Demand, 'id' | 'completed' | 'completedAt' | 'created_at' | 'updated_at'>) => void;
}

export const CreateDemandDialog: React.FC<CreateDemandDialogProps> = ({
  open,
  onOpenChange,
  onCreateDemand,
}) => {
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [date, setDate] = useState<Date>();
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('Dados do formulário:', { title, subject, date });
    
    if (!title.trim() || !subject.trim() || !date) {
      console.log('Campos obrigatórios não preenchidos');
      return;
    }

    const demandData = {
      title: title.trim(),
      subject: subject.trim(),
      date: date.toISOString(),
      urgency: 'Média' as const
    };

    console.log('Criando demanda com dados:', demandData);
    
    onCreateDemand(demandData);

    // Reset form
    setTitle('');
    setSubject('');
    setDate(undefined);
    setIsCalendarOpen(false);
    onOpenChange(false);
  };

  const handleDateSelect = (selectedDate: Date | undefined) => {
    console.log('Data selecionada:', selectedDate);
    if (selectedDate) {
      setDate(selectedDate);
      setIsCalendarOpen(false);
    }
  };

  const handleOpenChange = (open: boolean) => {
    setIsCalendarOpen(open);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/95 backdrop-blur-md border-white/20 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Nova Demanda</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            <Popover open={isCalendarOpen} onOpenChange={handleOpenChange}>
              <PopoverTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal bg-white/10 border-white/30 text-white hover:bg-white/20",
                    !date && "text-white/60"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd 'de' MMMM 'de' yyyy", { locale: ptBR }) : "Selecionar data"}
                </Button>
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
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
            >
              Criar Demanda
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
