'use client';

import { Button } from '@/components/ui/button';
import { Google, Facebook } from 'lucide-react';

interface SocialAuthButtonsProps {
  onGoogleClick?: () => void;
  onFacebookClick?: () => void;
  isLoading?: boolean;
}

export default function SocialAuthButtons({ 
  onGoogleClick, 
  onFacebookClick, 
  isLoading = false 
}: SocialAuthButtonsProps) {
  return (
    <div className="space-y-3">
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-text_dim">Or continue with</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="outline"
          className="w-full"
          onClick={onGoogleClick}
          disabled={isLoading}
        >
          <Google className="mr-2 h-4 w-4" />
          Google
        </Button>
        
        <Button
          variant="outline"
          className="w-full"
          onClick={onFacebookClick}
          disabled={isLoading}
        >
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </Button>
      </div>
    </div>
  );
}