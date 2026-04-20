import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { LoginForm } from '../../client/src/components/auth/LoginForm';
import { useToast } from '../../client/src/components/ui/use-toast';

// Mock dependencies
vi.mock('../../client/src/hooks/useAuth', () => ({
  useAuth: () => ({
    signIn: vi.fn().mockResolvedValue({ error: null }),
    signInWithGoogle: vi.fn().mockResolvedValue({ error: null }),
    signInWithFacebook: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

vi.mock('../../client/src/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

describe('LoginForm', () => {
  const mockOnLogin = vi.fn();
  const mockOnForgotPassword = vi.fn();
  const mockOnSwitchToRegister = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Welcome Back' })).toBeInTheDocument();
    expect(screen.getByLabelText('Email')).toBeInTheDocument();
    expect(screen.getByLabelText('Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Sign In' })).toBeInTheDocument();
    expect(screen.getByText('Forgot password?')).toBeInTheDocument();
    expect(screen.getByText('Or continue with')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Google' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Facebook' })).toBeInTheDocument();
    expect(screen.getByText('Don\'t have an account?')).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

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
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'invalid-email' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

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
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Please enter your password',
        })
      );
    });
  });

  it('shows validation error for short password', async () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'short' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Password must be at least 8 characters long',
        })
      );
    });
  });

  it('calls signIn with correct credentials on valid form submission', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ error: null });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signIn: mockSignIn,
        signInWithGoogle: vi.fn(),
        signInWithFacebook: vi.fn(),
      }),
    }));

    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(mockSignIn).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'ValidPassword1!',
      });
    });
  });

  it('shows success toast and calls onLogin on successful login', async () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'ValidPassword1!' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          title: 'Success',
          description: 'Signed in successfully',
        })
      );
      expect(mockOnLogin).toHaveBeenCalled();
    });
  });

  it('shows error toast on login failure', async () => {
    const mockSignIn = vi.fn().mockResolvedValue({ 
      error: 'Invalid credentials' 
    });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signIn: mockSignIn,
        signInWithGoogle: vi.fn(),
        signInWithFacebook: vi.fn(),
      }),
    }));

    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.change(screen.getByLabelText('Email'), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText('Password'), {
      target: { value: 'wrong-password' },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Sign In' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Invalid credentials',
        })
      );
      expect(mockOnLogin).not.toHaveBeenCalled();
    });
  });

  it('calls onForgotPassword when forgot password link is clicked', () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByText('Forgot password?'));

    expect(mockOnForgotPassword).toHaveBeenCalled();
  });

  it('calls onSwitchToRegister when sign up link is clicked', () => {
    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByText('Sign up'));

    expect(mockOnSwitchToRegister).toHaveBeenCalled();
  });

  it('calls signInWithGoogle when Google button is clicked', async () => {
    const mockSignInWithGoogle = vi.fn().mockResolvedValue({ error: null });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signIn: vi.fn(),
        signInWithGoogle: mockSignInWithGoogle,
        signInWithFacebook: vi.fn(),
      }),
    }));

    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Google' }));

    await waitFor(() => {
      expect(mockSignInWithGoogle).toHaveBeenCalled();
    });
  });

  it('shows error toast when Google sign in fails', async () => {
    const mockSignInWithGoogle = vi.fn().mockResolvedValue({ 
      error: 'Google sign in failed' 
    });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signIn: vi.fn(),
        signInWithGoogle: mockSignInWithGoogle,
        signInWithFacebook: vi.fn(),
      }),
    }));

    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Google' }));

    await waitFor(() => {
      expect(useToast().toast).toHaveBeenCalledWith(
        expect.objectContaining({
          variant: 'destructive',
          description: 'Google sign in failed',
        })
      );
    });
  });

  it('calls signInWithFacebook when Facebook button is clicked', async () => {
    const mockSignInWithFacebook = vi.fn().mockResolvedValue({ error: null });
    vi.mock('../../client/src/hooks/useAuth', () => ({
      useAuth: () => ({
        signIn: vi.fn(),
        signInWithGoogle: vi.fn(),
        signInWithFacebook: mockSignInWithFacebook,
      }),
    }));

    render(
      <LoginForm 
        onLogin={mockOnLogin} 
        onForgotPassword={mockOnForgotPassword} 
        onSwitchToRegister={mockOnSwitchToRegister} 
      />
    );

    fireEvent.click(screen.getByRole('button', { name: 'Facebook' }));

    await waitFor(() => {
      expect(mockSignInWithFacebook).toHaveBeenCalled();
    });
  });
});
```