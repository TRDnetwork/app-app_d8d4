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
    signIn, 
    signUp, 
    signInWithProvider, 
    handleAuthCallback,
    forgotPassword,
    resetPassword
  } = useAuth();
  const navigate = useNavigate();

  // Handle OAuth callback
  useEffect(() => {
    const error = searchParams.get('error');
    if (error) {
      handleAuthCallback();
    }
  }, [searchParams, handleAuthCallback]);

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
      
      if (!