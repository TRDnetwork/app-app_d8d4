
```
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Login } from '../../src/pages/Login';
import { Register } from '../../src/pages/Register';
import { useAuth } from '../../src/lib/auth';

// Mock the useAuth hook
vi.mock('../../src/lib/auth', () => ({
  useAuth: vi.fn(),
}));

describe('Authentication Flow', () => {
  it('renders login form with correct fields', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      login: vi.fn(),
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Login />);
    
    expect(screen.getByText('Sign in to ShopSphere')).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument();
    expect(screen.getByText(/forgot password/i)).toBeInTheDocument();
  });

  it('shows validation errors for empty login form', async () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({
      user: null,
      login: mockLogin,
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Login />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('handles successful login', async () => {
    const mockLogin = vi.fn();
    (useAuth as any).mockReturnValue({
      user: null,
      login: mockLogin,
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Login />);
    
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }));
    
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('user@example.com', 'password123');
    });
  });

  it('renders register form with correct fields', () => {
    (useAuth as any).mockReturnValue({
      user: null,
      register: vi.fn(),
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Register />);
    
    expect(screen.getByText('Create an account')).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument();
  });

  it('shows validation errors for incomplete registration', async () => {
    const mockRegister = vi.fn();
    (useAuth as any).mockReturnValue({
      user: null,
      register: mockRegister,
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Register />);
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(screen.getByText('Name is required')).toBeInTheDocument();
      expect(screen.getByText('Invalid email address')).toBeInTheDocument();
      expect(screen.getByText('Password must be at least 6 characters')).toBeInTheDocument();
    });
  });

  it('handles successful registration', async () => {
    const mockRegister = vi.fn();
    (useAuth as any).mockReturnValue({
      user: null,
      register: mockRegister,
      getAuthError: vi.fn().mockReturnValue(null)
    });

    render(<Register />);
    
    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'John Doe' }
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'user@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.change(screen.getByLabelText(/confirm password/i), {
      target: { value: 'password123' }
    });
    
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }));
    
    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('John Doe', 'user@example.com', 'password123');
    });
  });
});
```