"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { store } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (role: 'Admin' | 'User') => {
    setIsLoading(true);
    store.login(role);
    setTimeout(() => {
      router.push('/dashboard');
    }, 800);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-2xl border-primary/10">
        <CardHeader className="text-center space-y-2">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <ShieldCheck className="w-10 h-10 text-primary" />
          </div>
          <CardTitle className="text-3xl font-headline font-bold text-primary tracking-tight">AssetFlow</CardTitle>
          <CardDescription className="text-muted-foreground text-lg">IT Asset Management System</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6 pt-6">
          <div className="grid grid-cols-1 gap-4">
            <Button 
              size="lg" 
              className="h-16 text-lg font-medium transition-all hover:scale-[1.02]" 
              onClick={() => handleLogin('Admin')}
              disabled={isLoading}
            >
              <ShieldCheck className="mr-3 h-6 w-6" />
              Login as Administrator
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="h-16 text-lg font-medium border-primary/20 hover:bg-primary/5 transition-all hover:scale-[1.02]" 
              onClick={() => handleLogin('User')}
              disabled={isLoading}
            >
              <User className="mr-3 h-6 w-6" />
              Login as Guest User
            </Button>
          </div>
          <p className="text-center text-sm text-muted-foreground pt-4">
            Access to data is restricted based on your role.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}