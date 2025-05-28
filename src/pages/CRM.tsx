
import React, { useState, useEffect, useCallback } from 'react';
import { Plus, Edit, Trash2, Phone, Mail } from "lucide-react";
import { CreateContactDialog } from "@/components/CreateContactDialog";
import { EditContactDialog } from "@/components/EditContactDialog";
import { useOptimizedRealtimeCRM } from "@/hooks/useOptimizedRealtimeCRM";
import { Contact } from "@/types/CRM";
import { supabase } from '@/integrations/supabase/client';
import { PageLayout } from '@/components/PageLayout';
import { OptimizedButton } from '@/components/OptimizedButton';

const CRM = () => {
  const { contacts, loading } = useOptimizedRealtimeCRM();
  const [isCreateContactOpen, setIsCreateContactOpen] = useState(false);
  const [isEditContactOpen, setIsEditContactOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const handleCreateContact = useCallback(async (contactData: Omit<Contact, 'id'>) => {
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
    } catch (error) {
      console.error('Erro ao criar contato:', error);
    }
  }, []);

  const handleUpdateContact = useCallback(async (updatedContact: Contact) => {
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
    } catch (error) {
      console.error('Erro ao atualizar contato:', error);
    }
  }, []);

  const handleDeleteContact = useCallback(async (contactId: string) => {
    try {
      const { error } = await supabase
        .from('crm_records')
        .delete()
        .eq('id', contactId);

      if (error) throw error;
    } catch (error) {
      console.error('Erro ao deletar contato:', error);
    }
  }, []);

  const handleEditContact = useCallback((contact: Contact) => {
    setSelectedContact(contact);
    setIsEditContactOpen(true);
  }, []);

  if (loading) {
    return (
      <PageLayout title="CRM">
        <div className="text-white text-lg text-center py-12">Carregando contatos...</div>
      </PageLayout>
    );
  }

  return (
    <PageLayout title="CRM">
      {/* Novo Contato Button */}
      <div className="mb-6 flex justify-end">
        <OptimizedButton
          onClick={() => setIsCreateContactOpen(true)}
          className="bg-gradient-to-r from-cyan-500/80 to-blue-500/80 hover:from-cyan-600/80 hover:to-blue-600/80 backdrop-blur-sm text-white shadow-lg border border-cyan-400/30"
        >
          <Plus className="w-4 h-4 mr-2" />
          Novo Contato
        </OptimizedButton>
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
              className="bg-slate-800/40 backdrop-blur-xl rounded-2xl border border-cyan-500/30 p-4 shadow-2xl mb-4 max-w-full transition-all duration-200 hover:shadow-3xl hover:border-cyan-400/40"
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
                  <OptimizedButton
                    onClick={() => handleEditContact(contact)}
                    size="sm"
                    className="bg-cyan-500/20 hover:bg-cyan-500/30 backdrop-blur-sm border border-cyan-500/30 text-sm px-3 py-2"
                  >
                    <Edit className="w-4 h-4 mr-1" />
                    Editar
                  </OptimizedButton>
                  <OptimizedButton
                    onClick={() => handleDeleteContact(contact.id)}
                    size="sm"
                    className="bg-red-500/20 hover:bg-red-500/30 backdrop-blur-sm border border-red-500/30 text-sm px-3 py-2 text-red-300"
                  >
                    <Trash2 className="w-4 h-4 mr-1" />
                    Excluir
                  </OptimizedButton>
                </div>
              </div>
            </div>
          ))
        )}
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
    </PageLayout>
  );
};

export default CRM;
