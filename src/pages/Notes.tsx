
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Calendar, User } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CreateNoteDialog } from "@/components/CreateNoteDialog";
import { EditNoteDialog } from "@/components/EditNoteDialog";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { Note } from "@/types/Note";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const Notes = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('notes', []);
  const [isCreateNoteOpen, setIsCreateNoteOpen] = useState(false);
  const [isEditNoteOpen, setIsEditNoteOpen] = useState(false);
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateNote = (noteData: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...noteData,
      id: Date.now().toString()
    };
    setNotes([...notes, newNote]);
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(notes.map(note => 
      note.id === updatedNote.id ? updatedNote : note
    ));
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
  };

  const handleEditNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditNoteOpen(true);
  };

  const formatDateTime = (date: Date) => {
    return date.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-4 shadow-2xl h-[120px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                Anotações
              </h1>
              <p className="text-cyan-300">Desenvolvido por Lon Systems. {formatDateTime(currentDateTime)}</p>
            </div>
          </div>
        </div>

        {/* Nova Anotação Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsCreateNoteOpen(true)}
            className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 backdrop-blur-sm text-white shadow-lg border border-cyan-400/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nova Anotação
          </Button>
        </div>

        {/* Notes List */}
        <div className="space-y-4">
          {notes.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhuma anotação criada ainda. Clique em "Nova Anotação" para começar.
              </div>
            </div>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4 shadow-2xl mb-4"
              >
                <div className="flex items-start gap-3">
                  {/* Note Info */}
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-lg font-semibold text-white">{note.subject}</h2>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded border ${
                          note.assignee === 'Thiago' 
                            ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                            : 'bg-green-500/20 text-green-300 border-green-500/30'
                        }`}>
                          <User className="w-3 h-3 inline mr-1" />
                          {note.assignee}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-cyan-300 mb-3">
                      <Calendar className="w-4 h-4" />
                      {format(new Date(note.date), "dd/MM/yyyy", { locale: ptBR })}
                    </div>

                    <div className="text-sm text-slate-300 bg-slate-700/30 rounded-lg p-3 border border-slate-600/30">
                      {note.text}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleEditNote(note)}
                      size="sm"
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-sm border border-cyan-500/30 transition-all duration-200 text-sm px-3 py-2"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteNote(note.id)}
                      size="sm"
                      className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/30 transition-all duration-200 text-sm px-3 py-2 text-red-300"
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
      </div>

      <CreateNoteDialog
        open={isCreateNoteOpen}
        onOpenChange={setIsCreateNoteOpen}
        onCreateNote={handleCreateNote}
      />

      <EditNoteDialog
        open={isEditNoteOpen}
        onOpenChange={setIsEditNoteOpen}
        onUpdateNote={handleUpdateNote}
        note={selectedNote}
      />
    </div>
  );
};

export default Notes;
