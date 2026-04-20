import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../src/components/AuthForm';

// Mock apiClient
vi.mock('../../src/lib/api', () => ({
  apiClient: vi.fn(),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', () => ({
  useNavigate: () => mockNavigate,
}));

describe('AuthForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form by default', () => {
    render(<AuthForm />);

    expect(screen.getByRole('heading', { level: 2, name: 'Login' })).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
  });

  it('switches to register form when link is clicked', () => {
    render(<AuthForm />);

    fireEvent.click(screen.getByText(/create an account/i));

    expect(screen.getByRole('heading', { level: 2, name: 'Register' })).toBeInTheDocument();
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
  });

  it('handles login form submission', async () => {
    const mockLogin = vi.fn().mockResolvedValue({
      accessToken: 'mock-access-token',
      refreshToken: 'mock-refresh-token',
      user: {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
        role: 'customer',
      },
    });

    vi.mock('../../src/lib/api', () => ({
      apiClient: mockLogin,
    }));

    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' },
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          email: 'test@example.com',
          password: 'password123',
        }),
      });
    });
  });

  it('handles register form submission', async () => {
    const mockRegister = vi.fn().mockResolvedValue({
      message: 'Registration successful',
      user: {
        _id: 'user123',
        email: 'test@example.com',
        name: 'Test User',
      },
    });

    vi.mock('../../src/lib/api', () => ({
      apiClient: mockRegister,
    }));

    render(<AuthForm />);

    // Switch to register form
    fireEvent.click(screen.getByText(/create an account/i));

    fireEvent.change(screen.getByLabelText(/name/i), {
      target: { value: 'Test User' },
    });
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'StrongPass123!' },
    });
    fireEvent.click(screen.getByRole('button', { name: /register/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          name: 'Test User',
          email: 'test@example.com',
          password: 'StrongPass123!',
        }),
      });
    });
  });

  it('shows validation error for invalid email', async () => {
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'not-an-email' },
    });
    fireEvent.blur(screen.getByLabelText(/email/i));

    expect(await screen.findByText(/invalid email/i)).toBeInTheDocument();
  });

  it('shows validation error for weak password', async () => {
    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'weak' },
    });
    fireEvent.blur(screen.getByLabelText(/password/i));

    expect(await screen.findByText(/at least 12 characters/i)).toBeInTheDocument();
  });

  it('shows server error message', async () => {
    const mockLogin = vi.fn().mockRejectedValue(new Error('Invalid credentials'));

    vi.mock('../../src/lib/api', () => ({
      apiClient: mockLogin,
    }));

    render(<AuthForm />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole