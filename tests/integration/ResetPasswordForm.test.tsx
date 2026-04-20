import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ResetPasswordForm } from '../../client/src/components/auth/ResetPasswordForm';
import { useSearchParams } from 'next/navigation';

// Mock dependencies
vi.mock('../../client/src/hooks/useAuth', () => ({
  useAuth: () => ({
    updatePassword: vi.fn().mockResolvedValue({ error: null }),
  }),
}));

vi.mock('../../client/src/components/ui/use-toast', () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock('next/navigation', () => ({
  useSearchParams: vi.fn(),
}));

describe('ResetPasswordForm', () => {
  const mockOnPasswordReset = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders reset password form correctly', () => {
    // Mock search params with token
    (useSearchParams as vi.Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('reset-token-123'),
    });

    render(
      <ResetPasswordForm onPasswordReset={mockOnPasswordReset} />
    );

    expect(screen.getByRole('heading', { level: 1, name: 'Reset Password' })).toBeInTheDocument();
    expect(screen.getByLabelText('New Password')).toBeInTheDocument();
    expect(screen.getByLabelText('Confirm New Password')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Reset Password' })).toBeInTheDocument();
  });

  it('shows validation error for empty password', async () => {
    // Mock search params with token
    (useSearchParams as vi.Mock).mockReturnValue({
      get: vi.fn().mockReturnValue('reset-token-123'),
    });

    render(