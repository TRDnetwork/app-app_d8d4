// This file provides validation utilities for data import
import { StatusCodes } from 'http-status-codes';

// Validate CSV headers
export const validateCSVHeaders = (headers: string[], requiredHeaders: string[]): { valid: boolean; missing: string[] } => {
  const missing = requiredHeaders.filter(header => !headers.includes(header));
  return {
    valid: missing.length === 0,
    missing
  };
};

// Validate data type
export const validateType = (value: any, type: 'string' | 'number' | 'boolean' | 'array', fieldName: string): { valid: boolean; error?: string } => {
  switch (type) {
    case 'string':
      if (typeof value !== 'string' || !value.trim()) {
        return { valid: false, error: `${fieldName} must be a non-empty string` };
      }
      break;
    case 'number':
      if (typeof value !== 'number' || isNaN(value)) {
        return { valid: false, error: `${fieldName} must be a valid number` };
      }
      break;
    case 'boolean':
      if (typeof value !== 'boolean') {
        return { valid: false, error: `${fieldName} must be a boolean` };
      }
      break;
    case 'array':
      if (!Array.isArray(value)) {
        return { valid: false, error: `${fieldName} must be an array` };
      }
      break;
  }
  return { valid: true };
};

// Validate email format
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate URL
export const validateURL = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Validate price
export const validatePrice = (price: number): boolean => {
  return typeof price === 'number' && price >= 0;
};

// Validate stock
export const validateStock = (stock: number): boolean => {
  return Number.isInteger(stock) && stock >= 0;
};

// Generic validation result
export interface ValidationResult {
  success: boolean;
  errors: string[];
  data?: any;
}

// Validate product data
export const validateProductData = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!data.title?.trim()) {
    errors.push('Title is required');
  }

  if (!data.price || !validatePrice(data.price)) {
    errors.push('Valid price is required');
  }

  if (!data.stock || !validateStock(data.stock)) {
    errors.push('Valid stock is required');
  }

  if (!data.category_id?.trim()) {
    errors.push('Category ID is required');
  }

  // Optional fields with validation
  if (data.images && !Array.isArray(data.images)) {
    errors.push('Images must be an array');
  }

  if (data.tags && !Array.isArray(data.tags)) {
    errors.push('Tags must be an array');
  }

  if (data.status && !['active', 'inactive'].includes(data.status)) {
    errors.push('Status must be either "active" or "inactive"');
  }

  return {
    success: errors.length === 0,
    errors,
    data: errors.length === 0 ? data : undefined
  };
};

// Validate user data
export const validateUserData = (data: any): ValidationResult => {
  const errors: string[] = [];

  // Required fields
  if (!data.name?.trim()) {
    errors.push('Name is required');