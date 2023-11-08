
import { ValidationPlugin } from "./validation";
import { describe, it, expect } from 'vitest';

describe('ValidationPlugin', () => {

  const validation = new ValidationPlugin();


  describe('minLength validator', () => {
    it('should return true for valid input', () => {
      const validator = validation.minLength(5);
      expect(validator('12345')).toBe(true);
      expect(validator('123456')).toBe(true);
    });

    it('should return error message for invalid input', () => {
      const validator = validation.minLength(5);
      expect(validator('1234')).toBe('Min 5 characters allowed.');
    });
  });

  describe('maxLength validator', () => {
    it('should return true for valid input', () => {
      const validator = validation.maxLength(5);
      expect(validator('12345')).toBe(true);
      expect(validator('1234')).toBe(true);
    });

    it('should return error message for invalid input', () => {
      const validator = validation.maxLength(5);
      expect(validator('123456')).toBe('Max 5 characters allowed.');
    });
  });

  describe('required validator', () => {
    it('should return true for valid string input', () => {
      const validator = validation.required();
      expect(validator('test')).toBe(true);
    });

    it('should return error message for empty string input', () => {
      const validator = validation.required();
      expect(validator('')).toBe('This field is required.');
    });

  });

  describe('allowedLengths validator', () => {
    it('should return true for valid input lengths', () => {
      const validator = validation.allowedLengths([5, 10]);
      expect(validator('hello')).toBe(true); // 5 characters
      expect(validator('hello worl')).toBe(true); 
    });

    it('should return default error message for invalid input lengths', () => {
      const validator = validation.allowedLengths([5, 10]);
      expect(validator('hi')).toBe('Must be 5 or 10 characters.'); // 2 characters
      expect(validator('this is a longer test string')).toBe('Must be 5 or 10 characters.');
    });

    it('should return custom error message for invalid input lengths', () => {
      const customMessage = 'Length must be 3 or 7 characters.';
      const validator = validation.allowedLengths([3, 7], customMessage);
      expect(validator('hi')).toBe(customMessage); // 2 characters
      expect(validator('this is a test')).toBe(customMessage); // 14 characters
    });

    it('should handle single allowed length', () => {
      const validator = validation.allowedLengths([5]);
      expect(validator('hello')).toBe(true); // 5 characters
      expect(validator('hi')).toBe('Must be 5 characters.'); // 2 characters
    });

    it('should handle multiple allowed lengths', () => {
      const validator = validation.allowedLengths([3, 5, 7]);
      expect(validator('hi')).toBe('Must be 3, 5 or 7 characters.'); // 2 characters
      expect(validator('hello')).toBe(true); // 5 characters
      expect(validator('this is')).toBe(true); // 7 characters, includes space
    });
  });

  describe('required validator', () => {
    it('should return true for non-empty strings', () => {
      const validator = validation.required();
      expect(validator('hello')).toBe(true);
      expect(validator('   hello   ')).toBe(true); // should trim spaces
    });

    it('should return default error message for empty or undefined strings', () => {
      const validator = validation.required();
      expect(validator('')).toBe("This field is required.");
      expect(validator('   ')).toBe("This field is required."); // only spaces
      expect(validator(undefined)).toBe("This field is required."); 
    });

    it('should return custom error message for empty strings', () => {
      const customMessage = 'Field cannot be empty.';
      const validator = validation.required(customMessage);
      expect(validator('')).toBe(customMessage);
    });

  });

  describe('integer validator', () => {

    it('should validate a correct integer value', () => {
      const validator = validation.integer();
      expect(validator('42')).toBe(true);
    });
  
    it('should return an error message for a decimal value', () => {
      const validator = validation.integer();
      expect(validator('42.5')).toBe("The value must be an integer number");
    });
  
    it('should return an error message for a non-numeric string', () => {
      const validator = validation.integer();
      expect(validator('hello')).toBe("The value must be an integer number");
    });
  
    it('should return an error message for a negative decimal value', () => {
      const validator = validation.integer();
      expect(validator('-42.5')).toBe("The value must be an integer number");
    });
  
    it('should validate a correct negative integer value', () => {
      const validator = validation.integer();
      expect(validator('-42')).toBe(true);
    });
  
    it('should use a custom error message when provided', () => {
      const customMessage = "Please provide a whole number";
      const validator = validation.integer(customMessage);
      expect(validator('42.5')).toBe(customMessage);
    });
  
  });
})