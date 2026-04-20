import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client with environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Types for authentication
export type AuthUser = {
  id: string;
  email: string;
  role: 'customer' | 'seller' | 'admin';
  name?: string;
  phone?: string;
  profile_picture_url?: string;
  email_verified: boolean;
};

export type SignUpData = {
  email: string;
  password: string;
  name: string;
};

export type SignInData = {
  email: string;
  password: string;
};

export type ResetPasswordData = {
  email: string;
};

export type UpdatePasswordData = {
  token: string;
  password: string;
};

// Authentication service
export class AuthService {
  // Sign up with email and password
  static async signUp(data: SignUpData): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: {
            name: data.name,
            role: 'customer',
            email_verified: false,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (authData.user) {
        // Return user data
        return {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            role: 'customer',
            name: data.name,
            email_verified: false,
          },
          error: null,
        };
      }

      return { user: null, error: 'Sign up failed' };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Sign in with email and password
  static async signIn(data: SignInData): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      });

      if (error) {
        return { user: null, error: error.message };
      }

      if (authData.user) {
        // Get user profile data
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', authData.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          return { user: null, error: profileError.message };
        }

        return {
          user: {
            id: authData.user.id,
            email: authData.user.email!,
            role: profileData?.role || 'customer',
            name: profileData?.name,
            phone: profileData?.phone,
            profile_picture_url: profileData?.profile_picture_url,
            email_verified: authData.user.email_confirmed_at !== null,
          },
          error: null,
        };
      }

      return { user: null, error: 'Sign in failed' };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Sign in with Google OAuth
  static async signInWithGoogle(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Sign in with Facebook OAuth
  static async signInWithFacebook(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'facebook',
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        return { error: error.message };
      }

      return { error: null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Sign out
  static async signOut(): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signOut();
      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Send magic link for passwordless sign in
  static async sendMagicLink(email: string): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Reset password
  static async resetPassword(data: ResetPasswordData): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Update password with reset token
  static async updatePassword(data: UpdatePasswordData): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase.auth.verifyOtp({
        token: data.token,
        type: 'recovery',
      });

      if (error) {
        return { error: error.message };
      }

      // Update password
      const { error: updateError } = await supabase.auth.updateUser({
        password: data.password,
      });

      return { error: updateError?.message || null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Get current user session
  static async getCurrentUser(): Promise<{ user: AuthUser | null; error: string | null }> {
    try {
      const { data: { session }, error: sessionError } = await supabase.auth.getSession();

      if (sessionError) {
        return { user: null, error: sessionError.message };
      }

      if (!session?.user) {
        return { user: null, error: null };
      }

      // Get user profile data
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        return { user: null, error: profileError.message };
      }

      return {
        user: {
          id: session.user.id,
          email: session.user.email!,
          role: profileData?.role || 'customer',
          name: profileData?.name,
          phone: profileData?.phone,
          profile_picture_url: profileData?.profile_picture_url,
          email_verified: session.user.email_confirmed_at !== null,
        },
        error: null,
      };
    } catch (error: any) {
      return { user: null, error: error.message };
    }
  }

  // Update user profile
  static async updateProfile(
    userId: string,
    data: Partial<Omit<AuthUser, 'id' | 'email' | 'role' | 'email_verified'>>
  ): Promise<{ error: string | null }> {
    try {
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: userId,
          ...data,
        });

      return { error: error?.message || null };
    } catch (error: any) {
      return { error: error.message };
    }
  }

  // Check if email is available
  static async isEmailAvailable(email: string): Promise<boolean> {
    try {
      const { data, error } = await supabase.auth.admin.listUsers({
        query: email,
      });

      if (error) {
        return false;
      }

      return data.users.length === 0;
    } catch (error) {
      return false;
    }
  }
}
```

```typescript