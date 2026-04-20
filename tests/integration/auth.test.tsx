import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../../client/src/pages/Auth/Login';
import { Register } from '../../client/src/pages/Auth/Register';
import { useAuth } from '../../client/src/lib/auth';

// Mock dependencies
vi.mock('../../client/src/lib/auth', () => ({
  useAuth: vi.fn(),
  AuthProvider: ({ children }: { children: React.ReactNode }) => <>{children}</>
}));

describe('Authentication Components', () => {
  describe('Login Component', () => {
    it('renders login form with email and password fields', () => {
      (useAuth as vi.Mock).mockReturnValue({
        login: vi.fn(),
        isAuthenticated: false,
        isLoading: false
      });

      render(<Login />);

      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
    });

    it('calls login function with correct credentials on form submission', async () => {
      const mockLogin = vi.fn();
      (useAuth as vi.Mock).mockReturnValue({
        login: mockLogin,
        isAuthenticated: false,
        isLoading: false
      });

      render(<Login />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'password123');
      });
    });

    it('shows loading state during authentication', () => {
      (useAuth as vi.Mock).mockReturnValue({
        login: vi.fn(),
        isAuthenticated: false,
        isLoading: true
      });

      render(<Login />);

      expect(screen.getByRole('button', { name: /logging in/i })).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('displays error message on failed login', async () => {
      (useAuth as vi.Mock).mockReturnValue({
        login: vi.fn().mockRejectedValue(new Error('Invalid credentials')),
        isAuthenticated: false,
        isLoading: false
      });

      render(<Login />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'wrong-password' }
      });
      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/invalid credentials/i)).toBeInTheDocument();
      });
    });
  });

  describe('Register Component', () => {
    it('renders registration form with all required fields', () => {
      (useAuth as vi.Mock).mockReturnValue({
        register: vi.fn(),
        isAuthenticated: false,
        isLoading: false
      });

      render(<Register />);

      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('calls register function with correct data on form submission', async () => {
      const mockRegister = vi.fn();
      (useAuth as vi.Mock).mockReturnValue({
        register: mockRegister,
        isAuthenticated: false,
        isLoading: false
      });

      render(<Register />);

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'StrongPass123!' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockRegister).toHaveBeenCalledWith('test@example.com', 'StrongPass123!', 'John Doe');
      });
    });

    it('shows password strength requirements', () => {
      (useAuth as vi.Mock).mockReturnValue({
        register: vi.fn(),
        isAuthenticated: false,
        isLoading: false
      });

      render(<Register />);

      expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
      expect(screen.getByText(/contain at least one uppercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/contain at least one lowercase letter/i)).toBeInTheDocument();
      expect(screen.getByText(/contain at least one number/i)).toBeInTheDocument();
      expect(screen.getByText(/contain at least one special character/i)).toBeInTheDocument();
    });

    it('validates password strength before submission', async () => {
      const mockRegister = vi.fn();
      (useAuth as vi.Mock).mockReturnValue({
        register: mockRegister,
        isAuthenticated: false,
        isLoading: false
      });

      render(<Register />);

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' }
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' }
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'weak' }
      });
      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/password must be at least 8 characters long/i)).toBeInTheDocument();
        expect(mockRegister).not.toHaveBeenCalled();
      });
    });
  });
});