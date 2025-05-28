
import { useEffect, useState, useCallback, useMemo } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Contact } from '@/types/CRM';

export const useOptimizedRealtimeCRM = () => {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<number>(0);

  const debounceTimeout = 500;

  const loadContacts = useCallback(async () => {
    const now = Date.now();
    if (now - lastUpdate < debounceTimeout) {
      return;
    }

    try {
      const { data, error } = await supabase
        .from('crm_records')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50); // Limite para performance

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
      setLastUpdate(now);
    } catch (error) {
      console.error('Erro ao carregar contatos:', error);
    } finally {
      setLoading(false);
    }
  }, [lastUpdate]);

  useEffect(() => {
    loadContacts();

    let debounceTimer: NodeJS.Timeout;

    const channel = supabase
      .channel('crm-optimized')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'crm_records' },
        () => {
          clearTimeout(debounceTimer);
          debounceTimer = setTimeout(loadContacts, 300);
        }
      )
      .subscribe();

    return () => {
      clearTimeout(debounceTimer);
      supabase.removeChannel(channel);
    };
  }, [loadContacts]);

  const memoizedReturn = useMemo(() => ({
    contacts,
    loading,
    refetch: loadContacts
  }), [contacts, loading, loadContacts]);

  return memoizedReturn;
};
