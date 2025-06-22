import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';

export interface Medication {
  id: number;
  name: string;
  dosage: string;
  frequency: number;
  instructions: string;
  created_at: string;
}

export interface MedicationLog {
  id: number;
  medication_id: number;
  taken_date: string;
  taken_time: string;
  notes: string;
}

export interface DashboardStats {
  totalMedications: number;
  takenToday: number;
  adherenceRate: number;
  streak: number;
}

export const useMedications = () => {
  const { token } = useAuth();
  const [medications, setMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchMedications = async () => {
    if (!token) return;

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('http://localhost:3001/api/medications', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch medications');
      }

      const data = await response.json();
      setMedications(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const addMedication = async (medication: Omit<Medication, 'id' | 'created_at'>) => {
    if (!token) throw new Error('No authentication token');

    const response = await fetch('http://localhost:3001/api/medications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(medication),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to add medication');
    }

    const newMedication = await response.json();
    setMedications(prev => [newMedication, ...prev]);
    return newMedication;
  };

  const deleteMedication = async (id: number) => {
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`http://localhost:3001/api/medications/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to delete medication');
    }

    setMedications(prev => prev.filter(med => med.id !== id));
  };

  const logMedication = async (medicationId: number, takenDate: string, notes?: string) => {
    if (!token) throw new Error('No authentication token');

    const response = await fetch(`http://localhost:3001/api/medications/${medicationId}/logs`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ taken_date: takenDate, notes }),
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || 'Failed to log medication');
    }

    return await response.json();
  };

  const fetchDashboardStats = async (): Promise<DashboardStats> => {
    if (!token) throw new Error('No authentication token');

    const response = await fetch('http://localhost:3001/api/dashboard/stats', {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch dashboard stats');
    }

    return await response.json();
  };

  useEffect(() => {
    fetchMedications();
  }, [token]);

  return {
    medications,
    loading,
    error,
    fetchMedications,
    addMedication,
    deleteMedication,
    logMedication,
    fetchDashboardStats,
  };
};