import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../../src/pages/Auth/Login';
import { Register } from '../../src/pages/Auth/Register';
import { api } from '../../src/lib/api';

describe('Authentication Flows', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Login Component', () => {
    it('submits login form with correct credentials', async () => {
      const mockLogin = vi.fn().mockResolvedValue({
        success: true,
        token: 'mock-jwt-token',
        user: {
          _id: 'user123',
          name: 'Test User',
          email: 'test@example.com',
          role: 'customer'
        }
      });
      
      vi.mock('../../src/lib/api', () => ({
        api: {
          auth: {
            login: mockLogin
          }
        }
      }));

      render(<Login />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123!');
      });
    });

    it('shows validation error for invalid email', async () => {
      render(<Login />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'not-an-email' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(/please enter a valid email/i)).toBeInTheDocument();
    });

    it('shows validation error for empty password', async () => {
      render(<Login />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: '' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      expect(await screen.findByText(/password is required/i)).toBeInTheDocument();
    });
  });

  describe('Register Component', () => {
    it('submits registration form with valid data', async () => {
      const mockRegister = vi.fn().mockResolvedValue({
        success: true,
        message: 'User registered successfully'
      });
      
      vi.mock('../../src/lib/api', () => ({
        api: {
          auth: {
            register: mockRegister
          }
        }
      }));

      render(<Register />);

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'Test User' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'StrongPass123!' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'StrongPass123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith(
          'Test User',
          'test@example.com',
          'StrongPass123!'
        );
      });
    });

    it('shows validation error for mismatched passwords', async () => {
      render(<Register />);

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'StrongPass123!' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'WrongPass123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      expect(await screen.findByText(/passwords do not match/i)).toBeInTheDocument();
    });

    it('shows validation error for weak password', async () => {
      render(<Register />);

      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'weak' }
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'weak' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      expect(await screen.findByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
      expect(await screen.findByText(/password must contain at least one uppercase letter/i)).toBeInTheDocument();
      expect(await screen.findByText(/password must contain at least one number/i)).toBeInTheDocument();
      expect(await screen.findByText(/password must contain at least one special character/i)).toBeInTheDocument();
    });
  });
});