import AuthForm from '@rt/components/AuthForm';
import { Card, CardHeader, CardTitle } from '@rt/components/ui/card';
import React from 'react';

const SignUp = () => {
  return (
    <div className="mt-20 flex flex-1 flex-col items-center">
      <Card className="w-full max-w-md">
        <CardHeader className="mb-4">
          <CardTitle className="text-center text-3xl">Login</CardTitle>
        </CardHeader>
        <AuthForm type="signup" />
      </Card>
    </div>
  );
};

export default SignUp;
