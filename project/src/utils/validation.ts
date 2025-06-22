export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];

  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }

  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

export const validateMedicationForm = (data: {
  name: string;
  dosage: string;
  frequency: number;
}): { isValid: boolean; errors: Record<string, string> } => {
  const errors: Record<string, string> = {};

  if (!data.name.trim()) {
    errors.name = 'Medication name is required';
  }

  if (!data.dosage.trim()) {
    errors.dosage = 'Dosage is required';
  }

  if (data.frequency < 1 || data.frequency > 10) {
    errors.frequency = 'Frequency must be between 1 and 10 times per day';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};