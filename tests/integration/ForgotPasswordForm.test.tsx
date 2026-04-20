import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ForgotPasswordForm } from '../../client/src/components/auth/ForgotPasswordForm';
import { useToast } from '../../client/src/components/ui/use-toast';

// Mock dependencies
vi.mock('../../client/src/hooks/useAuth', () => ({
  useAuth: () => ({
    resetPassword: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

vi.mock('../../client/src/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('ForgotPasswordForm', () => {
  const mockOnBackToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders forgot password form correctly', () => {
    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Send Reset Email' })).toBeInTheDocument();
    expect(screen.getByText('Back to Sign In')).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Email' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter your email address',
        })
      );
    });
  });

  it('shows validation error for invalid email', async () => {
    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Email' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter a valid email address',
        })
      );
    });
  });

  it('calls resetPassword with correct email on valid form submission', async () => {
    const mockResetPassword = vi.fn().mockResolvedValue({ error: null });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        resetPassword: mockResetPassword,
      }),
    }));

    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Email' }));

    await waitFor(() => {
      expect(mockResetPassword).toHaveBeenCalledWith('test@example.com');
    });
  });

  it('shows success toast and calls onBackToLogin on successful password reset request', async () => {
    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Email' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: 'Password reset email sent. Please check your inbox.',
        })
      );
      expect(mockOnBackToLogin).toHaveBeenCalled();
    });
  });

  it('shows error toast on password reset request failure', async () => {
    const mockResetPassword = vi.fn().mockResolvedValue({ 
      error: 'User not found' 
    });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        resetPassword: mockResetPassword,
      }),
    }));

    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'nonexistent@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Send Reset Email' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'User not found',
        })
      );
      expect(mockOnBackToLogin).not.toHaveBeenCalled();
    });
  });

  it('calls onBackToLogin when back to sign in link is clicked', () => {
    render(
      <ForgotPasswordForm onBackToLogin={mockOnBackToLogin} />
    );

    fireEvent.click(screen.getByText('Back to Sign In'));

    expect(mockOnBackToLogin).toHaveBeenCalled();
  });
});
```