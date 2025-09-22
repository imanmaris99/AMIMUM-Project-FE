"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SessionManager } from '@/lib/auth';

interface LoginProtectionProps {
  children: React.ReactNode;
  redirectTo?: string;
  showMessage?: boolean;
}

const LoginProtection: React.FC<LoginProtectionProps> = ({ 
  children, 
  redirectTo = '/login',
  showMessage = true 
}) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkLoginStatus = () => {
      const isAuthenticated = SessionManager.isAuthenticated();
      
      if (isAuthenticated) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
        if (showMessage) {
          toast.error('Silakan login terlebih dahulu untuk mengakses halaman ini');
        }
        router.push(redirectTo);
      }
    };

    checkLoginStatus();
    
    // Listen for storage changes (when user logs in from another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'isLoggedIn' || e.key === 'userEmail') {
        checkLoginStatus();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [router, redirectTo, showMessage]);

  // Show loading while checking login status
  if (isLoggedIn === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <LoadingSpinner size="lg" color="primary" label="Memeriksa status login..." />
      </div>
    );
  }

  // If not logged in, don't render children (redirect will happen)
  if (!isLoggedIn) {
    return null;
  }

  // If logged in, render children
  return <>{children}</>;
};

export default LoginProtection;
