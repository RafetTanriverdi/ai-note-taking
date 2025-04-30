'use client';
import { updateNoteAction } from '@rt/actions/notes';
import { Textarea } from '@rt/components/ui/textarea';
import useNote from '@rt/hooks/useNote';
import { debounceTimeout } from '@rt/lib/constants';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, useEffect } from 'react';

type Props = {
  noteId: string;
  startingNoteText: string;
};

let updateTimeout: NodeJS.Timeout;

function NoteTextInput({ noteId, startingNoteText }: Props) {
  console.log('NoteTextInput', noteId, startingNoteText);

  const noteIdParam = useSearchParams().get('noteId') || '';
  const { noteText, setNoteText } = useNote();

  useEffect(() => {
    if (noteId === noteIdParam) {
      setNoteText(startingNoteText);
    }
  }, [startingNoteText, noteIdParam, noteId, setNoteText]);

  const handleUpdateNote = (e: ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    setNoteText(text);

    clearTimeout(updateTimeout);

    updateTimeout = setTimeout(() => {
      updateNoteAction(noteId, text);
    }, debounceTimeout);
  };

  return (
    <Textarea
      value={noteText}
      onChange={handleUpdateNote}
      placeholder="Type your notes here..."
      className="custom-scrollbar placeholder:text-muted-foreground mb-4 h-full max-w-4xl resize-none border p-4 focus-visible:ring-0 focus-visible:ring-offset-0"
    />
  );
}

export default NoteTextInput;
