/* eslint-disable react-hooks/exhaustive-deps */
import { Note } from '@prisma/client';
import { SidebarMenuButton } from '@rt/components/ui/sidebar';
import useNote from '@rt/hooks/useNote';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useState } from 'react';

type Props = {
  note: Note;
};

function SelectNoteButton({ note }: Props) {
  console.log(note);

  const noteId = useSearchParams().get('noteId') || '';

  const { noteText: selectedNoteText } = useNote();
  const [localNoteText, setLocalNoteText] = useState(note.text);
  const [shouldUseGlobalNoteText, setShouldUseGlobalNoteText] = useState(false);

  useEffect(() => {
    if (noteId === note.id) {
      setLocalNoteText(note.text);
      setShouldUseGlobalNoteText(true);
    } else {
      setShouldUseGlobalNoteText(false);
    }
  }, [noteId, note.id]);

  useEffect(() => {
    if (shouldUseGlobalNoteText) {
      setLocalNoteText(selectedNoteText);
    }
  }, [selectedNoteText, shouldUseGlobalNoteText]);

  const blankNoteText = 'Empty note text';

  let noteText = localNoteText || blankNoteText;

  if (shouldUseGlobalNoteText) {
    noteText = selectedNoteText || blankNoteText;
  }

  return (
    <SidebarMenuButton
      asChild
      className={`items-start gap-0 pr-12 ${note.id === noteId && 'bg-sidebar-accent/50'}`}
    >
      <Link href={`/?noteId=${note.id}`} className="flex h-fit flex-col">
        <p className="w-full truncate overflow-hidden text-ellipsis whitespace-nowrap">
          {noteText}
        </p>
        <p className="text-muted-foreground text-xs">
          {note.updatedAt.toLocaleDateString()}
        </p>
      </Link>
    </SidebarMenuButton>
  );
}

export default SelectNoteButton;
