
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contact } from '@/types/CRM';

export const useRealtimeCRM = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para carregar contatos iniciais
  const loadContacts = async () => {
    try {
      const { data, error } = await supabase
        .from('crm_records')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const transformedContacts = (data || []).map(record => ({
        id: record.id,
        name: record.name,
        email: record.email,
        whatsapp: record.contact,
        subject: record.subject,
        comments: record.file ? [record.file] : [],
        created_at: record.created_at,
        updated_at: record.updated_at,
        date: record.date,
        completed: record.completed,
        status: record.status
      }));

      setContacts(transformedContacts);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadContacts();

    // Listener para mudanças na tabela crm_records
    const channel = supabase
      .channel('crm-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_records' },
        (payload) => {
          console.log('Mudança detectada na tabela crm_records:', payload);
          loadContacts(); // Recarrega todos os contatos quando há mudança
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return { contacts, loading, refetch: loadContacts };
};
