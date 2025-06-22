import React, { useState } from 'react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Card } from '../ui/Card';
import { Plus, X } from 'lucide-react';

interface AddMedicationFormProps {
  onAdd: (medication: {
    name: string;
    dosage: string;
    frequency: number;
    instructions: string;
  }) => Promise<void>;
  onCancel: () => void;
}

export const AddMedicationForm: React.FC<AddMedicationFormProps> = ({
  onAdd,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    dosage: '',
    frequency: 1,
    instructions: '',
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Medication name is required';
    }

    if (!formData.dosage.trim()) {
      newErrors.dosage = 'Dosage is required';
    }

    if (formData.frequency < 1 || formData.frequency > 10) {
      newErrors.frequency = 'Frequency must be between 1 and 10';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      await onAdd(formData);
      setFormData({
        name: '',
        dosage: '',
        frequency: 1,
        instructions: '',
      });
      onCancel();
    } catch (error) {
      console.error('Failed to add medication:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'frequency' ? parseInt(value) || 1 : value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900">Add New Medication</h2>
        <Button variant="ghost" size="sm" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Medication Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            placeholder="e.g., Ibuprofen"
          />

          <Input
            label="Dosage"
            name="dosage"
            value={formData.dosage}
            onChange={handleChange}
            error={errors.dosage}
            placeholder="e.g., 200mg"
          />
        </div>

        <Input
          label="Frequency (times per day)"
          type="number"
          name="frequency"
          value={formData.frequency}
          onChange={handleChange}
          error={errors.frequency}
          min="1"
          max="10"
        />

        <div className="space-y-1">
          <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">
            Instructions (optional)
          </label>
          <textarea
            id="instructions"
            name="instructions"
            value={formData.instructions}
            onChange={handleChange}
            rows={3}
            placeholder="e.g., Take with food"
            className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="flex space-x-3">
          <Button type="submit" loading={loading} className="flex-1">
            <Plus className="h-4 w-4 mr-2" />
            Add Medication
          </Button>
          <Button type="button" variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </div>
      </form>
    </Card>
  );
};