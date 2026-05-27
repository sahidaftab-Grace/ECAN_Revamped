import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

const API_URL = '/api/events';

const getAuthHeaders = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

/**
 * Hook for fetching list of events with filters and pagination
 */
export const useEvents = (filters = {}) => {
  return useQuery({
    queryKey: ['events', filters],
    queryFn: async () => {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value);
        }
      });
      
      const res = await fetch(`${API_URL}?${params.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch events');
      return res.json();
    },
    staleTime: 30000,
  });
};

/**
 * Hook for fetching a single event by ID
 */
export const useEvent = (id) => {
  return useQuery({
    queryKey: ['events', id],
    queryFn: async () => {
      const res = await fetch(`${API_URL}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch event');
      return res.json();
    },
    enabled: !!id,
  });
};

/**
 * Hook for creating or updating an event
 */
export const useSaveEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (formData) => {
      const id = formData.get('id');
      const method = id ? 'PUT' : 'POST';
      const url = id ? `${API_URL}/${id}` : API_URL;

      const res = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: formData, // Multer handles FormData on backend
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to save event');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};

/**
 * Hook for deleting an event
 */
export const useDeleteEvent = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (id) => {
      const res = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to delete event');
      }
      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['events'] });
    },
  });
};
