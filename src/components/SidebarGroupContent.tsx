'use client';
import React, { useEffect, useMemo, useState } from 'react';
import { Note } from '@prisma/client';
import {
  SidebarGroupContent as SidebarGroupContentShadcn,
  SidebarMenu,
  SidebarMenuItem,
} from '@rt/components/ui/sidebar';
import { SearchIcon } from 'lucide-react';
import { Input } from '@rt/components/ui/input';
import Fuse from 'fuse.js';
import SelectNoteButton from '@rt/components/SelectNoteButton';
import DeleteNoteButton from '@rt/components/DeleteNoteButton';

type Props = {
  notes: Note[];
};

const SidebarGroupContent = ({ notes }: Props) => {
  const [searchText, setSearchText] = useState<string>('');
  const [localNotes, setLocalNotes] = useState<Note[]>(notes);

  useEffect(() => {
    setLocalNotes(notes);
  }, [notes, searchText]);

  const fuse = useMemo(() => {
    return new Fuse(localNotes, {
      keys: ['text'],
      threshold: 0.4,
    });
  }, [localNotes]);

  const filteredNotes = searchText
    ? fuse.search(searchText).map(result => result.item)
    : localNotes;

  const deleteNoteLocally = (noteId: string) => {
    setLocalNotes(prevNotes => prevNotes.filter(note => note.id !== noteId));
  };

  return (
    <>
      <SidebarGroupContentShadcn>
        <div className="relative flex items-center">
          <SearchIcon className="absolute left-2 size-4" />
          <Input
            className="bg-muted pl-8"
            placeholder="Search notes..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
        </div>
        <SidebarMenu className="mt-4">
          {filteredNotes.map(note => (
            <SidebarMenuItem key={note.id} className="group/item">
              <SelectNoteButton note={note} />
              <DeleteNoteButton
                noteId={note.id}
                deleteNoteLocally={deleteNoteLocally}
              />
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContentShadcn>
    </>
  );
};

export default SidebarGroupContent;
