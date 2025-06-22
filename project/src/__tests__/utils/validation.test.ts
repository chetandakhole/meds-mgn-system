import { describe, it, expect } from 'vitest';
import { validateEmail, validatePassword, validateMedicationForm } from '../../utils/validation';

describe('validateEmail', () => {
  it('should return true for valid email addresses', () => {
    expect(validateEmail('test@example.com')).toBe(true);
    expect(validateEmail('user.name@domain.co.uk')).toBe(true);
    expect(validateEmail('user+tag@example.org')).toBe(true);
  });

  it('should return false for invalid email addresses', () => {
    expect(validateEmail('invalid-email')).toBe(false);
    expect(validateEmail('test@')).toBe(false);
    expect(validateEmail('@example.com')).toBe(false);
    expect(validateEmail('')).toBe(false);
  });
});

describe('validatePassword', () => {
  it('should return valid for strong passwords', () => {
    const result = validatePassword('password123');
    expect(result.isValid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  it('should return invalid for weak passwords', () => {
    const result = validatePassword('123');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must be at least 6 characters long');
    expect(result.errors).toContain('Password must contain at least one lowercase letter');
  });

  it('should return invalid for passwords without numbers', () => {
    const result = validatePassword('password');
    expect(result.isValid).toBe(false);
    expect(result.errors).toContain('Password must contain at least one number');
  });
});

describe('validateMedicationForm', () => {
  it('should return valid for complete medication data', () => {
    const data = {
      name: 'Ibuprofen',
      dosage: '200mg',
      frequency: 2,
    };
    
    const result = validateMedicationForm(data);
    expect(result.isValid).toBe(true);
    expect(Object.keys(result.errors)).toHaveLength(0);
  });

  it('should return invalid for incomplete medication data', () => {
    const data = {
      name: '',
      dosage: '',
      frequency: 0,
    };
    
    const result = validateMedicationForm(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.name).toBe('Medication name is required');
    expect(result.errors.dosage).toBe('Dosage is required');
    expect(result.errors.frequency).toBe('Frequency must be between 1 and 10 times per day');
  });

  it('should return invalid for frequency out of range', () => {
    const data = {
      name: 'Test Med',
      dosage: '100mg',
      frequency: 15,
    };
    
    const result = validateMedicationForm(data);
    expect(result.isValid).toBe(false);
    expect(result.errors.frequency).toBe('Frequency must be between 1 and 10 times per day');
  });
});