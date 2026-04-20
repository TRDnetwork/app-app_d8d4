import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { RegisterForm } from '../../client/src/components/auth/RegisterForm';
import { useToast } from '../../client/src/components/ui/use-toast';

// Mock dependencies
vi.mock('../../client/src/hooks/useAuth', () => ({
  useAuth: () => ({
    signUp: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

vi.mock('../../client/src/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('RegisterForm', () => {
  const mockOnRegister = vi.fn();
  const mockOnSwitchToLogin = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders registration form correctly', () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Create an Account' })).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Create Account' })).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument();
    expect(screen.getByText('Already have an account?')).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter your name',
        })
      );
    });
  });

  it('shows validation error for empty email', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

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
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter a valid email address',
        })
      );
    });
  });

  it('shows validation error for empty password', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter a password',
        })
      );
    });
  });

  it('shows validation error for short password', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Password must be at least 8 characters long',
        })
      );
    });
  });

  it('shows validation error for password without uppercase letter', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'password1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        })
      );
    });
  });

  it('shows validation error for password without lowercase letter', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'PASSWORD1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        })
      );
    });
  });

  it('shows validation error for password without number', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'Password!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Password must contain at least one uppercase letter, one lowercase letter, and one number',
        })
      );
    });
  });

  it('shows validation error for password confirmation mismatch', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'DifferentPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Passwords do not match',
        })
      );
    });
  });

  it('calls signUp with correct credentials on valid form submission', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ error: null });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signUp: mockSignUp,
      }),
    }));

    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(mockSignUp).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'ValidPassword1!',
        name: 'John Doe',
      });
    });
  });

  it('shows success toast and calls onRegister on successful registration', async () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: 'Account created successfully. Please check your email to verify your account.',
        })
      );
      expect(mockOnRegister).toHaveBeenCalled();
    });
  });

  it('shows error toast on registration failure', async () => {
    const mockSignUp = vi.fn().mockResolvedValue({ 
      error: 'Email already exists' 
    });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signUp: mockSignUp,
      }),
    }));

    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.change(screen.getByLabelText('Full Name'), {
      target: { value: 'John Doe' },
    });
    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.change(screen.getByLabelText('Confirm Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Create Account' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Email already exists',
        })
      );
      expect(mockOnRegister).not.toHaveBeenCalled();
    });
  });

  it('calls onSwitchToLogin when sign in link is clicked', () => {
    render(
      <RegisterForm 
        onRegister={mockOnRegister} 
        onSwitchToLogin={mockOnSwitchToLogin} 
      />
    );

    fireEvent.click(screen.getByText('Sign in'));

    expect(mockOnSwitchToLogin).toHaveBeenCalled();
  });
});
```