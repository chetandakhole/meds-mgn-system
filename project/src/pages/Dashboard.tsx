import React, { useState, useEffect } from 'react';
import { Header } from '../components/layout/Header';
import { DashboardStats } from '../components/dashboard/DashboardStats';
import { MedicationCard } from '../components/medications/MedicationCard';
import { AddMedicationForm } from '../components/medications/AddMedicationForm';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useMedications, DashboardStats as Stats } from '../hooks/useMedications';
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';

export const Dashboard: React.FC = () => {
  const {
    medications,
    loading,
    error,
    addMedication,
    deleteMedication,
    logMedication,
    fetchDashboardStats,
  } = useMedications();

  const [showAddForm, setShowAddForm] = useState(false);
  const [stats, setStats] = useState<Stats>({
    totalMedications: 0,
    takenToday: 0,
    adherenceRate: 0,
    streak: 0,
  });
  const [statsLoading, setStatsLoading] = useState(true);
  const [medicationLogs, setMedicationLogs] = useState<Set<string>>(new Set());

  const today = format(new Date(), 'yyyy-MM-dd');

  useEffect(() => {
    loadStats();
  }, [medications]);

  const loadStats = async () => {
    try {
      setStatsLoading(true);
      const data = await fetchDashboardStats();
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats:', error);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleAddMedication = async (medicationData: any) => {
    try {
      await addMedication(medicationData);
      setShowAddForm(false);
    } catch (error) {
      console.error('Failed to add medication:', error);
    }
  };

  const handleDeleteMedication = async (id: number) => {
    if (window.confirm('Are you sure you want to delete this medication?')) {
      try {
        await deleteMedication(id);
      } catch (error) {
        console.error('Failed to delete medication:', error);
      }
    }
  };

  const handleLogMedication = async (medicationId: number, takenDate: string) => {
    try {
      await logMedication(medicationId, takenDate);
      const logKey = `${medicationId}-${takenDate}`;
      setMedicationLogs(prev => new Set(prev).add(logKey));
      // Refresh stats after logging
      loadStats();
    } catch (error) {
      console.error('Failed to log medication:', error);
    }
  };

  const isMedicationLogged = (medicationId: number, date: string) => {
    return medicationLogs.has(`${medicationId}-${date}`);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="text-center">
            <p className="text-red-600">Error: {error}</p>
            <Button onClick={() => window.location.reload()} className="mt-4">
              Retry
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              <div className="flex items-center space-x-2 text-gray-600 mt-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(), 'EEEE, MMMM d, yyyy')}</span>
              </div>
            </div>
            {!showAddForm && (
              <Button
                onClick={() => setShowAddForm(true)}
                className="flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Add Medication</span>
              </Button>
            )}
          </div>

          <DashboardStats stats={stats} loading={statsLoading} />
        </div>

        {showAddForm && (
          <div className="mb-8">
            <AddMedicationForm
              onAdd={handleAddMedication}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Your Medications ({medications.length})
          </h2>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <div className="h-32 bg-gray-200 rounded"></div>
                </Card>
              ))}
            </div>
          ) : medications.length === 0 ? (
            <Card className="text-center py-12">
              <div className="text-gray-500">
                <Plus className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No medications yet</h3>
                <p className="mb-4">Add your first medication to get started</p>
                {!showAddForm && (
                  <Button onClick={() => setShowAddForm(true)}>
                    Add Medication
                  </Button>
                )}
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medications.map((medication) => (
                <MedicationCard
                  key={medication.id}
                  medication={medication}
                  onDelete={handleDeleteMedication}
                  onLog={handleLogMedication}
                  isLogged={isMedicationLogged(medication.id, today)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};