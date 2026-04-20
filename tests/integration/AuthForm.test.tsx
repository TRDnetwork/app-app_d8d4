import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AuthForm } from '../../client/src/components/AuthForm';

describe('AuthForm', () => {
  const mockOnSubmit = vi.fn();
  const mockOnSwitchMode = vi.fn();

  beforeEach(() => {
    mockOnSubmit.mockClear();
    mockOnSwitchMode.mockClear();
  });

  describe('Login Form', () => {
    it('renders login form correctly', () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      expect(screen.getByText('Login to Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
      expect(screen.getByText(/don't have an account/i)).toBeInTheDocument();
    });

    it('submits login form with valid data', async () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          email: 'test@example.com',
          password: 'password123',
        });
      });
    });

    it('shows validation error for invalid email', async () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'not-an-email' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/please enter a valid email/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for empty password', async () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });

      fireEvent.click(screen.getByRole('button', { name: /login/i }));

      await waitFor(() => {
        expect(screen.getByText(/password is required/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('switches to register mode when link is clicked', () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.click(screen.getByText(/create an account/i));

      expect(mockOnSwitchMode).toHaveBeenCalledWith('register');
    });
  });

  describe('Register Form', () => {
    it('renders register form correctly', () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      expect(screen.getByText('Create Your Account')).toBeInTheDocument();
      expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument();
      expect(screen.getByText(/already have an account/i)).toBeInTheDocument();
    });

    it('submits register form with valid data', async () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' },
      });

      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(mockOnSubmit).toHaveBeenCalledWith({
          name: 'John Doe',
          email: 'test@example.com',
          password: 'Password123!',
        });
      });
    });

    it('shows validation error for empty name', async () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'Password123!' },
      });

      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/name is required/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows validation error for password mismatch', async () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.change(screen.getByLabelText(/name/i), {
        target: { value: 'John Doe' },
      });
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'Password123!' },
      });
      fireEvent.change(screen.getByLabelText(/confirm password/i), {
        target: { value: 'DifferentPassword123!' },
      });

      fireEvent.click(screen.getByRole('button', { name: /register/i }));

      await waitFor(() => {
        expect(screen.getByText(/passwords do not match/i)).toBeInTheDocument();
      });
      expect(mockOnSubmit).not.toHaveBeenCalled();
    });

    it('shows password strength indicator', async () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      const passwordInput = screen.getByLabelText(/password/i);
      
      // Weak password
      fireEvent.change(passwordInput, { target: { value: '123' } });
      expect(screen.getByText(/password strength/i)).toBeInTheDocument();
      expect(screen.getByText(/weak/i)).toBeInTheDocument();

      // Medium password
      fireEvent.change(passwordInput, { target: { value: 'password123' } });
      expect(screen.getByText(/medium/i)).toBeInTheDocument();

      // Strong password
      fireEvent.change(passwordInput, { target: { value: 'Password123!' } });
      expect(screen.getByText(/strong/i)).toBeInTheDocument();
    });

    it('switches to login mode when link is clicked', () => {
      render(<AuthForm mode="register" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      fireEvent.click(screen.getByText(/already have an account/i));

      expect(mockOnSwitchMode).toHaveBeenCalledWith('login');
    });
  });

  describe('Form State', () => {
    it('resets form when mode changes', async () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} />);

      // Fill login form
      fireEvent.change(screen.getByLabelText(/email/i), {
        target: { value: 'test@example.com' },
      });
      fireEvent.change(screen.getByLabelText(/password/i), {
        target: { value: 'password123' },
      });

      // Switch to register
      fireEvent.click(screen.getByText(/create an account/i));

      // Check that fields are cleared
      expect(screen.getByLabelText(/name/i)).toHaveValue('');
      expect(screen.getByLabelText(/email/i)).toHaveValue('');
      expect(screen.getByLabelText(/password/i)).toHaveValue('');
      expect(screen.getByLabelText(/confirm password/i)).toHaveValue('');
    });

    it('shows loading state when submitting', async () => {
      render(<AuthForm mode="login" onSubmit={mockOnSubmit} onSwitchMode={mockOnSwitchMode} isLoading={true} />);

      const submitButton = screen.getByRole('button', { name: /logging in/i });
      expect(submitButton).toBeDisabled();
      expect(submitButton).toHaveTextContent(/logging in/i);
      expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });
  });
});