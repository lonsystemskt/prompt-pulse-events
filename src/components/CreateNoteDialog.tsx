
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Note } from "@/types/Note";

interface CreateNoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateNote: (note: Omit<Note, 'id'>) => void;
}

export const CreateNoteDialog = ({
  open,
  onOpenChange,
  onCreateNote
}: CreateNoteDialogProps) => {
  const [subject, setSubject] = useState('');
  const [text, setText] = useState('');
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [assignee, setAssignee] = useState<'Thiago' | 'Kalil'>('Thiago');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!subject.trim() || !text.trim() || !date) {
      return;
    }

    onCreateNote({
      subject: subject.trim(),
      text: text.trim(),
      date,
      assignee
    });

    // Reset form
    setSubject('');
    setText('');
    setDate(new Date());
    setAssignee('Thiago');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-300">Nova Anotação</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="subject" className="text-cyan-300">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
              placeholder="Assunto da anotação"
              required
            />
          </div>

          <div>
            <Label htmlFor="text" className="text-cyan-300">Texto da Anotação</Label>
            <Textarea
              id="text"
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400 min-h-[100px]"
              placeholder="Escreva sua anotação aqui..."
              required
            />
          </div>

          <div>
            <Label className="text-cyan-300">Data</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal bg-slate-800/50 border-cyan-500/30 text-white hover:bg-slate-700/50",
                    !date && "text-slate-400"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "dd/MM/yyyy", { locale: ptBR }) : <span>Selecione uma data</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  initialFocus
                  className="p-3 pointer-events-auto text-white"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <Label className="text-cyan-300">Responsável</Label>
            <Select value={assignee} onValueChange={(value: 'Thiago' | 'Kalil') => setAssignee(value)}>
              <SelectTrigger className="bg-slate-800/50 border-cyan-500/30 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 text-white">
                <SelectItem value="Thiago">Thiago</SelectItem>
                <SelectItem value="Kalil">Kalil</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1 border-cyan-500/30 text-cyan-300 hover:bg-cyan-500/20"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-600 hover:to-blue-600"
            >
              Criar Anotação
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
