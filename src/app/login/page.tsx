
'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/firebase';
import { initiateEmailSignIn, initiateEmailSignUp } from '@/firebase/non-blocking-login';
import { Recycle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const router = useRouter();
  const auth = useAuth();

  const handleAuthAction = () => {
    if (isSignUp) {
      initiateEmailSignUp(auth, email, password);
    } else {
      initiateEmailSignIn(auth, email, password);
    }
    router.push('/');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="flex flex-col items-center">
        <Link href="/" className="flex items-center gap-3 mb-8">
          <Recycle className="h-8 w-8 text-primary" />
          <h1 className="text-2xl md:text-3xl font-bold font-headline text-foreground tracking-tight">
            WasteWise
          </h1>
        </Link>
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle>{isSignUp ? 'Create an Account' : 'Welcome Back'}</CardTitle>
            <CardDescription>
              {isSignUp ? 'Enter your details to get started.' : 'Sign in to your account to continue.'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <Button onClick={handleAuthAction} className="w-full">
                {isSignUp ? 'Sign Up' : 'Sign In'}
              </Button>
            </div>
            <div className="mt-4 text-center text-sm">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <Button variant="link" onClick={() => setIsSignUp(!isSignUp)}>
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
