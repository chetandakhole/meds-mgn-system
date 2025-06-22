import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { MedicationCard } from '../../components/medications/MedicationCard';

// Mock the date-fns module
vi.mock('date-fns', () => ({
  format: vi.fn(() => '2024-01-15'),
}));

describe('MedicationCard', () => {
  const mockMedication = {
    id: 1,
    name: 'Ibuprofen',
    dosage: '200mg',
    frequency: 2,
    instructions: 'Take with food',
    created_at: '2024-01-01',
  };

  const mockProps = {
    medication: mockMedication,
    onDelete: vi.fn(),
    onLog: vi.fn(),
    isLogged: false,
  };

  it('should render medication information correctly', () => {
    render(<MedicationCard {...mockProps} />);
    
    expect(screen.getByText('Ibuprofen')).toBeInTheDocument();
    expect(screen.getByText('200mg')).toBeInTheDocument();
    expect(screen.getByText('2 times daily')).toBeInTheDocument();
    expect(screen.getByText('Take with food')).toBeInTheDocument();
  });

  it('should show "Take Now" button when medication is not logged', () => {
    render(<MedicationCard {...mockProps} />);
    
    expect(screen.getByText('Take Now')).toBeInTheDocument();
  });

  it('should not show "Take Now" button when medication is logged', () => {
    render(<MedicationCard {...mockProps} isLogged={true} />);
    
    expect(screen.queryByText('Take Now')).not.toBeInTheDocument();
  });

  it('should call onLog when "Take Now" is clicked', () => {
    render(<MedicationCard {...mockProps} />);
    
    fireEvent.click(screen.getByText('Take Now'));
    expect(mockProps.onLog).toHaveBeenCalledWith(1, '2024-01-15');
  });

  it('should show correct frequency text for single dose', () => {
    const singleDoseMedication = { ...mockMedication, frequency: 1 };
    render(<MedicationCard {...mockProps} medication={singleDoseMedication} />);
    
    expect(screen.getByText('Once daily')).toBeInTheDocument();
  });
});