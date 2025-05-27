
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, X } from "lucide-react";
import { Contact } from "@/types/CRM";

interface EditContactDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdateContact: (contact: Contact) => void;
  contact: Contact | null;
}

export const EditContactDialog = ({
  open,
  onOpenChange,
  onUpdateContact,
  contact
}: EditContactDialogProps) => {
  const [name, setName] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [comments, setComments] = useState<string[]>(['']);

  useEffect(() => {
    if (contact) {
      setName(contact.name);
      setWhatsapp(contact.whatsapp);
      setEmail(contact.email);
      setSubject(contact.subject);
      setComments(contact.comments.length > 0 ? contact.comments : ['']);
    }
  }, [contact]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!contact || !name.trim() || !whatsapp.trim() || !email.trim() || !subject.trim()) {
      return;
    }

    const filteredComments = comments.filter(comment => comment.trim() !== '');
    
    onUpdateContact({
      ...contact,
      name: name.trim(),
      whatsapp: whatsapp.trim(),
      email: email.trim(),
      subject: subject.trim(),
      comments: filteredComments
    });

    onOpenChange(false);
  };

  const addComment = () => {
    setComments([...comments, '']);
  };

  const removeComment = (index: number) => {
    if (comments.length > 1) {
      setComments(comments.filter((_, i) => i !== index));
    }
  };

  const updateComment = (index: number, value: string) => {
    const newComments = [...comments];
    newComments[index] = value;
    setComments(newComments);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-slate-900/90 backdrop-blur-xl border border-cyan-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-cyan-300">Editar Contato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-cyan-300">Nome</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
              placeholder="Nome completo"
              required
            />
          </div>

          <div>
            <Label htmlFor="whatsapp" className="text-cyan-300">WhatsApp</Label>
            <Input
              id="whatsapp"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
              placeholder="(00) 00000-0000"
              required
            />
          </div>

          <div>
            <Label htmlFor="email" className="text-cyan-300">E-mail</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
              placeholder="email@exemplo.com"
              required
            />
          </div>

          <div>
            <Label htmlFor="subject" className="text-cyan-300">Assunto</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
              placeholder="Assunto do contato"
              required
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <Label className="text-cyan-300">Comentários</Label>
              <Button
                type="button"
                onClick={addComment}
                size="sm"
                className="bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-500/30"
              >
                <Plus className="w-4 h-4" />
              </Button>
            </div>
            {comments.map((comment, index) => (
              <div key={index} className="flex gap-2 mb-2">
                <Input
                  value={comment}
                  onChange={(e) => updateComment(index, e.target.value)}
                  className="bg-slate-800/50 border-cyan-500/30 text-white placeholder:text-slate-400"
                  placeholder="Adicione um comentário"
                />
                {comments.length > 1 && (
                  <Button
                    type="button"
                    onClick={() => removeComment(index)}
                    size="sm"
                    variant="ghost"
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/20"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
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
              Salvar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
