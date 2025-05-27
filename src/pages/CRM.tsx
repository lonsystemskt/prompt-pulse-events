
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { Navigation } from "@/components/Navigation";
import { CreateContactDialog } from "@/components/CreateContactDialog";
import { EditContactDialog } from "@/components/EditContactDialog";
import { useRealtimeCRM } from "@/hooks/useRealtimeCRM";
import { Contact } from "@/types/CRM";
import { supabase } from '@/integrations/supabase/client';

const CRM = () => {
  const { contacts, loading } = useRealtimeCRM();
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [currentDateTime, setCurrentDateTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleCreateContact = async (contactData: Omit<Contact, 'id'>) => {
    try {
      const { error } = await supabase
        .from('crm_records')
        .insert([{
          name: contactData.name,
          email: contactData.email,
          contact: contactData.whatsapp,
          subject: contactData.subject,
          file: contactData.comments.join(', '),
          date: new Date().toISOString(),
          completed: false,
          status: 'Ativo'
        }]);

      if (error) throw error;
      // O realtime irá atualizar automaticamente a lista
    } catch (error) {
      console.error('Erro ao criar contato:', error);
    }
  };

  const handleUpdateContact = async (updatedContact: Contact) => {
    try {
      const { error } = await supabase
        .from('crm_records')
        .update({
          name: updatedContact.name,
          email: updatedContact.email,
          contact: updatedContact.whatsapp,
          subject: updatedContact.subject,
          file: updatedContact.comments.join(', ')
        })
        .eq('id', updatedContact.id);

      if (error) throw error;
      // O realtime irá atualizar automaticamente a lista
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
  };

  const handleDeleteContact = async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('crm_records')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
      // O realtime irá atualizar automaticamente a lista
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
    }
  };

  const handleEditContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsEditContactOpen(true);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 flex items-center justify-center">
        <div className="text-white text-lg">Carregando contatos...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900">
      <Navigation />
      
      <div className="mx-10 p-4 max-w-none">
        {/* Header */}
        <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-6 mb-4 shadow-2xl h-[120px] flex items-center">
          <div className="flex items-center justify-between w-full">
            <div className="flex-1">
              <h1 className="text-4xl font-bold text-white mb-2">
                CRM
              </h1>
              <p className="text-cyan-300">Desenvolvido por Lon Systems. {formatDateTime(currentDateTime)}</p>
            </div>
          </div>
        </div>

        {/* Novo Contato Button */}
        <div className="mb-6 flex justify-end">
          <Button
            onClick={() => setIsCreateContactOpen(true)}
            className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 backdrop-blur-sm text-white shadow-lg border border-cyan-400/30 transition-all duration-200"
          >
            <Plus className="w-4 h-4 mr-2" />
            Novo Contato
          </Button>
        </div>

        {/* Contacts List */}
        <div className="space-y-4 max-h-[calc(100vh-300px)] overflow-y-auto">
          {contacts.length === 0 ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-12 text-center shadow-xl">
              <div className="text-slate-400 text-lg">
                Nenhum contato criado ainda. Clique em "Novo Contato" para começar.
              </div>
            </div>
          ) : (
            contacts.map((contact) => (
              <div
                key={contact.id}
                className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4 shadow-2xl mb-4 max-w-full"
              >
                <div className="flex items-center gap-3 w-full overflow-hidden">
                  {/* Contact Info */}
                  <div className="min-w-0 flex-1 overflow-hidden">
                    <div className="flex items-center gap-4 mb-2">
                      <h2 className="text-lg font-semibold text-white truncate max-w-[200px]">{contact.name}</h2>
                      <span className="text-cyan-300 text-sm px-2 py-1 bg-cyan-500/20 rounded border border-cyan-500/30 whitespace-nowrap">
                        {contact.subject}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-300 mb-2 flex-wrap">
                      <div className="flex items-center gap-1 min-w-0">
                        <Phone className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="truncate max-w-[150px]">{contact.whatsapp}</span>
                      </div>
                      <div className="flex items-center gap-1 min-w-0">
                        <Mail className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                        <span className="truncate max-w-[200px]">{contact.email}</span>
                      </div>
                    </div>

                    {contact.comments.length > 0 && (
                      <div className="text-sm text-slate-400 max-w-full">
                        <span className="font-medium text-cyan-300">Comentários:</span>
                        <div className="mt-1 space-y-1 max-h-20 overflow-y-auto">
                          {contact.comments.map((comment, index) => (
                            <div key={index} className="ml-2 truncate">• {comment}</div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2 flex-shrink-0">
                    <Button
                      onClick={() => handleEditContact(contact)}
                      size="sm"
                      className="bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-sm border border-cyan-500/30 transition-all duration-200 text-sm px-3 py-2"
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Editar
                    </Button>
                    <Button
                      onClick={() => handleDeleteContact(contact.id)}
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

      <CreateContactDialog
        open={isCreateContactOpen}
        onOpenChange={setIsCreateContactOpen}
        onCreateContact={handleCreateContact}
      />

      <EditContactDialog
        open={isEditContactOpen}
        onOpenChange={setIsEditContactOpen}
        onUpdateContact={handleUpdateContact}
        contact={selectedContact}
      />
    </div>
  );
};

export default CRM;
