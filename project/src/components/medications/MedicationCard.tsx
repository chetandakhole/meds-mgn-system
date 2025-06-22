import React, { useState } from 'react';
import { Medication } from '../../hooks/useMedications';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { Clock, Trash2, CheckCircle, Circle } from 'lucide-react';
import { format } from 'date-fns';

interface MedicationCardProps {
  medication: Medication;
  onDelete: (id: number) => void;
  onLog: (medicationId: number, takenDate: string) => void;
  isLogged?: boolean;
}

export const MedicationCard: React.FC<MedicationCardProps> = ({
  medication,
  onDelete,
  onLog,
  isLogged = false,
}) => {
  const [logging, setLogging] = useState(false);
  const today = format(new Date(), 'yyyy-MM-dd');

  const handleTakeNow = async () => {
    setLogging(true);
    try {
      await onLog(medication.id, today);
    } catch (error) {
      console.error('Failed to log medication:', error);
    } finally {
      setLogging(false);
    }
  };

  const frequencyText = medication.frequency === 1 
    ? 'Once daily' 
    : `${medication.frequency} times daily`;

  return (
    <Card className="hover:shadow-md transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-2">
            <h3 className="text-lg font-semibold text-gray-900">{medication.name}</h3>
            {isLogged ? (
              <CheckCircle className="h-5 w-5 text-green-500" />
            ) : (
              <Circle className="h-5 w-5 text-gray-400" />
            )}
          </div>
          
          <div className="space-y-1 text-sm text-gray-600">
            <p><strong>Dosage:</strong> {medication.dosage}</p>
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{frequencyText}</span>
            </div>
            {medication.instructions && (
              <p><strong>Instructions:</strong> {medication.instructions}</p>
            )}
          </div>
        </div>

        <div className="flex flex-col space-y-2 ml-4">
          {!isLogged && (
            <Button
              size="sm"
              onClick={handleTakeNow}
              loading={logging}
              className="whitespace-nowrap"
            >
              Take Now
            </Button>
          )}
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(medication.id)}
            className="flex items-center space-x-1"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};