'use client';
import { User } from '@prisma/client';
import { createNoteAction } from '@rt/actions/notes';
import { Button } from '@rt/components/ui/button';
import { Loader2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';

type Props = {
  user: Partial<User> | null;
};

function NewNoteButton({ user }: Props) {
  console.log('NewNoteButton', user?.email);
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const handleClickNewNoteButton = async () => {
    if (!user) {
      return router.push('/login');
    } else {
      setLoading(true);
      const uuid = uuidv4();
      await createNoteAction(uuid);

      router.push(`/?noteId=${uuid}`);

      toast.success('New note created!');
    }

    setLoading(false);
  };
  return (
    <Button
      onClick={handleClickNewNoteButton}
      variant={'secondary'}
      className="w-24"
      disabled={loading}
    >
      {loading ? <Loader2 /> : 'New Note'}
    </Button>
  );
}

export default NewNoteButton;
