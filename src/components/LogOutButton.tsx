import { Button } from '@rt/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';

const LogOutButton = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const handleLogout = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    const errorMessage = null;

    if (!errorMessage) {
      toast.success('Logged out successfully', {
        description: 'You have been logged out successfully.',
      });
      router.push('/');
    } else {
      toast.error('Logout failed', {
        description: errorMessage,
      });
    }
  };

  return (
    <>
      <Button
        variant={'outline'}
        className="w-24"
        onClick={handleLogout}
        disabled={loading}
      >
        {loading ? <Loader2 className="animate-spin" /> : 'Log Out'}
      </Button>
    </>
  );
};

export default LogOutButton;
