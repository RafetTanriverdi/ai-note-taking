'use client';

import { loginAction, signUpAction } from '@rt/actions/users';
import { Button } from '@rt/components/ui/button';
import { CardContent, CardFooter } from '@rt/components/ui/card';
import { Input } from '@rt/components/ui/input';
import { Label } from '@rt/components/ui/label';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useTransition } from 'react';
import { toast } from 'sonner';

interface AuthFormProps {
  type?: 'login' | 'signup';
}

export const AuthForm: React.FC<AuthFormProps> = ({ type }) => {
  const isLoginForm = type === 'login';
  const router = useRouter();

  const [isPending, startTransition] = useTransition();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      const email = formData.get('email') as string;
      const password = formData.get('password') as string;
      let errorMessage;
      let title;
      let description;

      if (isLoginForm) {
        errorMessage = (await loginAction(email, password)).errorMessage;
        title = 'Logged in successfully';
        description = 'You have been logged in successfully.';
      } else {
        errorMessage = (await signUpAction(email, password)).errorMessage;
        title = 'Account created successfully';
        description = 'You have been signed up successfully.';
      }

      if (!errorMessage) {
        toast(title, {
          description,
        });
        router.push('/');
      } else {
        toast(title, {
          description,
        });
      }
    });
  };
  return (
    <form action={handleSubmit} className="">
      <CardContent className="grid w-full items-center gap-4">
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="Enter your email"
            type="email"
            required
            disabled={isPending}
          />
        </div>
        <div className="flex flex-col space-y-1.5">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            placeholder="Enter your password"
            type="password"
            required
            disabled={isPending}
          />
        </div>
      </CardContent>
      <CardFooter className="mt-4 flex flex-col gap-6">
        <Button className="w-full" type="submit" disabled={isPending}>
          {isPending ? (
            <Loader2 className="animate-spin" />
          ) : isLoginForm ? (
            'Login'
          ) : (
            'Sign Up'
          )}
        </Button>
        <p className="text-xs">
          {isLoginForm
            ? "Don't have an acount yet?  "
            : 'Already have an account?'}
          <Link
            href={isLoginForm ? '/sign-up' : '/login'}
            className={`text-blue-500 underline ${isPending ? 'pointer-events-none' : ''}`}
          >
            {isLoginForm ? 'Sign up' : 'Login'}
          </Link>
        </p>
      </CardFooter>
    </form>
  );
};
