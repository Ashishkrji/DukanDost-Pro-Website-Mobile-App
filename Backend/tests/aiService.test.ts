import { describe, test, expect } from '@jest/globals';
import { calculateLoanEligibility } from '../services/aiService.ts';

describe('AI Service - Loan Eligibility', () => {
  test('should be eligible for high score and revenue', () => {
    const result = calculateLoanEligibility(85, 100000);
    expect(result.isEligible).toBe(true);
    expect(result.creditGrade).toBe('A');
    expect(result.maxAmount).toBe(150000);
  });

  test('should not be eligible for low score', () => {
    const result = calculateLoanEligibility(60, 100000);
    expect(result.isEligible).toBe(false);
    expect(result.creditGrade).toBe('C');
  });

  test('should not be eligible for low revenue', () => {
    const result = calculateLoanEligibility(95, 10000);
    expect(result.isEligible).toBe(false);
  });

  test('should give A+ for score > 90', () => {
    const result = calculateLoanEligibility(95, 100000);
    expect(result.creditGrade).toBe('A+');
  });
});
