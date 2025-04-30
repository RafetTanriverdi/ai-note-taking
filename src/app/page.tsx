import { getUser } from '@rt/auth/server';
import AskAIButton from '@rt/components/AskAIButton';
import NewNoteButton from '@rt/components/NewNoteButton';
import NoteTextInput from '@rt/components/NoteTextInput';
import { prisma } from '@rt/db/prisma';
import React from 'react';

type Props = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

async function HomePage({ searchParams }: Props) {
  const noteIdParam = (await searchParams).noteId;
  const user = await getUser();

  const noteId = Array.isArray(noteIdParam)
    ? noteIdParam[0]
    : noteIdParam || '';

  const note = await prisma.note.findUnique({
    where: {
      id: noteId,
      authorId: user?.id,
    },
  });

  return (
    <div className="flex h-full flex-col items-center gap-4">
      <div className="max-4-4xl flex w-full justify-end gap-2">
        <AskAIButton user={user} />
        <NewNoteButton user={user} />
      </div>
      <NoteTextInput noteId={noteId} startingNoteText={note?.text || ''} />
    </div>
  );
}

export default HomePage;
