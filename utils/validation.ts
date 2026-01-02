// utils/validation.ts

export const validateIncome = (value: string): { isValid: boolean; error: string } => {
  if (!value || value.trim() === "") {
    return { isValid: false, error: "Income is required to calculate tax." };
  }

  const num = parseFloat(value);
  if (isNaN(num) || num < 0) {
    return { isValid: false, error: "Please enter a valid positive number." };
  }

  // Edge case from PRD: Extremely high income check (e.g., > 1 Billion)
  if (num > 1000000000) {
    return { isValid: false, error: "Amount exceeds maximum calculation limit." };
  }

  return { isValid: true, error: "" };
};