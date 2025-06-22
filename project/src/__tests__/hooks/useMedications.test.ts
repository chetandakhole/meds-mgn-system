import { describe, it, expect, vi, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMedications } from '../../hooks/useMedications';

// Mock the AuthContext
vi.mock('../../contexts/AuthContext', () => ({
  useAuth: vi.fn(() => ({
    token: 'mock-token',
  })),
}));

// Mock fetch
global.fetch = vi.fn();

describe('useMedications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should fetch medications on mount', async () => {
    const mockMedications = [
      {
        id: 1,
        name: 'Ibuprofen',
        dosage: '200mg',
        frequency: 2,
        instructions: 'Take with food',
        created_at: '2024-01-01',
      },
    ];

    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => mockMedications,
    });

    const { result } = renderHook(() => useMedications());

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.medications).toEqual(mockMedications);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe(null);
  });

  it('should handle fetch error', async () => {
    (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

    const { result } = renderHook(() => useMedications());

    // Wait for the effect to run
    await act(async () => {
      await new Promise(resolve => setTimeout(resolve, 0));
    });

    expect(result.current.medications).toEqual([]);
    expect(result.current.loading).toBe(false);
    expect(result.current.error).toBe('Network error');
  });

  it('should add medication successfully', async () => {
    const newMedication = {
      id: 2,
      name: 'Aspirin',
      dosage: '81mg',
      frequency: 1,
      instructions: '',
      created_at: '2024-01-02',
    };

    // Mock initial fetch
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    });

    // Mock add medication
    (global.fetch as any).mockResolvedValueOnce({
      ok: true,
      json: async () => newMedication,
    });

    const { result } = renderHook(() => useMedications());

    await act(async () => {
      await result.current.addMedication({
        name: 'Aspirin',
        dosage: '81mg',
        frequency: 1,
        instructions: '',
      });
    });

    expect(result.current.medications).toContainEqual(newMedication);
  });
});