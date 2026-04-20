import React, { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { useAuth } from '../../lib/auth';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Google, Facebook, Loader2, Eye, EyeOff } from 'lucide-react';
import { z } from 'zod';
import { toast } from '../ui/use-toast';
import DOMPurify from 'dompurify';
import { trackAuthEvent, trackCTAClick, trackFormSubmit } from '../../lib/analytics';

// Validation schemas
const emailSchema = z.string().email('Please enter a valid email address');
const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[a-z]/, 'Password must contain a lowercase letter')
  .regex(/[A-Z]/, 'Password must contain an uppercase letter')
  .regex(/[0-9]/, 'Password must contain a number')
  .regex(/[^a-zA-Z0-9]/, 'Password must contain a special character');

const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: emailSchema,
  password: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

const forgotPasswordSchema = z.object({
  email: emailSchema,
});

const resetPasswordSchema = z.object({
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

interface AuthFormProps {
  mode: 'login' | 'register' | 'forgot-password' | 'reset-password';
  onSuccess?: () => void;
  token?: string; // For reset password mode
}

const AuthForm: React.FC<AuthFormProps> = ({ mode, onSuccess, token }) => {
  const [searchParams] = useSearchParams();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  
  const { 
    login, 
    register, 
    verifyEmail, 
    resendVerificationEmail,
    forgotPassword,
    resetPassword,
    getCurrentUser
  } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: DOMPurify.sanitize(error),
      });
    }
  }, [searchParams]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      // Validate form data
      let validationSchema;
      switch (mode) {
        case 'login':
          validationSchema = loginSchema;
          break;
        case 'register':
          validationSchema = registerSchema;
          break;
        case 'forgot-password':
          validationSchema = forgotPasswordSchema;
          break;
        case 'reset-password':
          validationSchema = resetPasswordSchema;
          break;
      }
      
      const result = validationSchema?.safeParse(formData);
      
      if (!result?.success) {
        const fieldErrors: Record<string, string> = {};
        result?.error?.errors.forEach((error) => {
          fieldErrors[error.path[0]] = error.message;
        });
        setErrors(fieldErrors);
        setIsLoading(false);
        return;
      }

      // Submit form based on mode
      switch (mode) {
        case 'login':
          await login(formData.email, formData.password);
          trackAuthEvent('login');
          trackFormSubmit('login', true);
          toast({
            title: 'Login Successful',
            description: 'Welcome back!',
          });
          break;

        case 'register':
          await register(formData.name, formData.email, formData.password);
          trackAuthEvent('register');
          trackFormSubmit('register', true);
          toast({
            title: 'Registration Successful',
            description: 'Please check your email to verify your account.',
          });
          break;

        case 'forgot-password':
          await forgotPassword(formData.email);
          trackFormSubmit('forgot_password', true);
          toast({
            title: 'Password Reset Email Sent',
            description: 'If an account with this email exists, a reset link has been sent.',
          });
          break;

        case 'reset-password':
          if (!token) {
            setErrors({ form: 'Invalid reset token' });
            setIsLoading(false);
            return;
          }
          await resetPassword(token, formData.newPassword);
          trackFormSubmit('reset_password', true);
          toast({
            title: 'Password Reset Successful',
            description: 'You can now log in with your new password.',
          });
          navigate('/login');
          break;
      }

      // Call success callback if provided
      if (onSuccess) {
        onSuccess();
      }
    } catch (error: any) {
      const errorMessage = error.message || 'An error occurred';
      setErrors({ form: errorMessage });
      trackFormSubmit(mode, false, { error: errorMessage });
      toast({
        variant: 'destructive',
        title: 'Error',
        description: DOMPurify.sanitize(errorMessage),
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle OAuth login
  const handleOAuthLogin = (provider: 'google' | 'facebook') => {
    trackCTAClick(`${provider}_login`, 'auth_form');
    // In a real app, this would redirect to the OAuth provider
    window.location.href = `/api/auth/oauth/${provider}`;
  };

  // Handle email verification
  const handleVerifyEmail = async () => {
    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }
    
    try {
      await resendVerificationEmail(formData.email);
      toast({
        title: 'Verification Email Sent',
        description: 'Please check your email for the verification code.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: error.message || 'Failed to send verification email',
      });
    }
  };

  // Render form based on mode
  const renderForm = () => {
    switch (mode) {
      case 'login':
        return (
          <>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={isPasswordVisible ? 'text' : 'password'}
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className={errors.password ? 'border-destructive' : ''}
                  />
                  <button
                    type="button"
                    onClick={() => setIsPasswordVisible(!isPasswordVisible)}