
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { useAuthStore } from '../../src/stores/authStore';
import Login from '../../src/pages/Login';
import Register from '../../src/pages/Register';
import { authApi } from '../../src/lib/api';

// Mock API calls
vi.mock('../../src/lib/api', () => ({
  authApi: {
    login: vi.fn(),
    register: vi.fn(),
    verifyEmail: vi.fn(),
    forgotPassword: vi.fn(),
    resetPassword: vi.fn(),
  },
}));

// Mock router
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe('Authentication Flow', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useAuthStore.setState({ user: null, token: null });
  });

  describe('Login Page', () => {
    it('renders login form correctly', () => {
      render(<Login />);
      
      expect(screen.getByText('Log In')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Log In' })).toBeInTheDocument();
      expect(screen.getByText('Forgot password?')).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
    });

    it('submits login form with valid credentials', async () => {
      const mockResponse = { 
        user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'customer' }, 
        token: 'test-token' 
      };
      (authApi.login as any).mockResolvedValue(mockResponse);
      
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
      
      await waitFor(() => {
        expect(authApi.login).toHaveBeenCalledWith({ email: 'test@example.com', password: 'password123' });
        expect(useAuthStore.getState().user).toEqual(mockResponse.user);
        expect(useAuthStore.getState().token).toBe('test-token');
      });
    });

    it('shows error for invalid credentials', async () => {
      (authApi.login as any).mockRejectedValue(new Error('Invalid credentials'));
      
      render(<Login />);
      
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'wrongpassword' } });
      fireEvent.click(screen.getByRole('button', { name: 'Log In' }));
      
      await waitFor(() => {
        expect(screen.getByText('Sign in failed')).toBeInTheDocument();
      });
    });

    it('navigates to register page', () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });
      
      render(<Login />);
      
      fireEvent.click(screen.getByText('Create Account'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/register');
    });
  });

  describe('Register Page', () => {
    it('renders registration form correctly', () => {
      render(<Register />);
      
      expect(screen.getByText('Create Account')).toBeInTheDocument();
      expect(screen.getByLabelText('Name')).toBeInTheDocument();
      expect(screen.getByLabelText('Email')).toBeInTheDocument();
      expect(screen.getByLabelText('Password')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
      expect(screen.getByText('Continue with Google')).toBeInTheDocument();
      expect(screen.getByText('Continue with Facebook')).toBeInTheDocument();
    });

    it('submits registration form with valid data', async () => {
      const mockResponse = { 
        user: { id: '1', email: 'test@example.com', name: 'Test User', role: 'customer' }, 
        token: 'test-token' 
      };
      (authApi.register as any).mockResolvedValue(mockResponse);
      
      render(<Register />);
      
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      
      await waitFor(() => {
        expect(authApi.register).toHaveBeenCalledWith({ 
          email: 'test@example.com', 
          password: 'password123', 
          name: 'Test User' 
        });
        expect(useAuthStore.getState().user).toEqual(mockResponse.user);
        expect(useAuthStore.getState().token).toBe('test-token');
      });
    });

    it('shows error for registration failure', async () => {
      (authApi.register as any).mockRejectedValue(new Error('Registration failed'));
      
      render(<Register />);
      
      fireEvent.change(screen.getByLabelText('Name'), { target: { value: 'Test User' } });
      fireEvent.change(screen.getByLabelText('Email'), { target: { value: 'test@example.com' } });
      fireEvent.change(screen.getByLabelText('Password'), { target: { value: 'password123' } });
      fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));
      
      await waitFor(() => {
        expect(screen.getByText('Sign up failed')).toBeInTheDocument();
      });
    });

    it('navigates to login page', () => {
      const mockNavigate = vi.fn();
      vi.mock('react-router-dom', async () => {
        const actual = await vi.importActual('react-router-dom');
        return {
          ...actual,
          useNavigate: () => mockNavigate,
        };
      });
      
      render(<Register />);
      
      fireEvent.click(screen.getByText('Sign in'));
      
      expect(mockNavigate).toHaveBeenCalledWith('/login');
    });
  });
});
```