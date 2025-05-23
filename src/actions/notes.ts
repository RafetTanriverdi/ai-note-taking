'use server';

import { getUser } from '@rt/auth/server';
import { prisma } from '@rt/db/prisma';
import { handleError } from '@rt/lib/utils';
import openai from '@rt/openai';
import { ChatCompletionMessageParam } from 'openai/resources/index.mjs';

export const updateNoteAction = async (noteId: string, text: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error('User not found');

    await prisma.note.update({
      where: {
        id: noteId,
      },
      data: {
        text: text,
      },
    });
    return { errorMessage: null };
  } catch (e) {
    return handleError(e);
  }
};

export const createNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error('User not found');

    await prisma.note.create({
      data: {
        id: noteId,
        text: '',
        authorId: user.id,
      },
    });
    return { errorMessage: null };
  } catch (e) {
    return handleError(e);
  }
};

export const deleteNoteAction = async (noteId: string) => {
  try {
    const user = await getUser();
    if (!user) throw new Error('User not found');

    await prisma.note.delete({
      where: {
        id: noteId,
      },
    });
    return { errorMessage: null };
  } catch (e) {
    return handleError(e);
  }
};

export const askAIAboutNotesAction = async (
  newQuestions: string[],
  responses: string[]
) => {
  const user = await getUser();
  if (!user) throw new Error('You must be logged in to ask AI questions');

  const notes = await prisma.note.findMany({
    where: { authorId: user.id },
    orderBy: { createdAt: 'desc' },
    select: { text: true, createdAt: true, updatedAt: true },
  });

  if (notes.length === 0) {
    return "You don't have any notes yet.";
  }

  const formattedNotes = notes
    .map(note =>
      `
      Text: ${note.text}
      Created at: ${note.createdAt}
      Last updated: ${note.updatedAt}
      `.trim()
    )
    .join('\n');

  const messages: ChatCompletionMessageParam[] = [
    {
      role: 'developer',
      content: `
          You are a helpful assistant that answers questions about a user's notes. 
          Assume all questions are related to the user's notes. 
          Make sure that your answers are not too verbose and you speak succinctly. 
          Your responses MUST be formatted in clean, valid HTML with proper structure. 
          Use tags like <p>, <strong>, <em>, <ul>, <ol>, <li>, <h1> to <h6>, and <br> when appropriate. 
          Do NOT wrap the entire response in a single <p> tag unless it's a single paragraph. 
          Avoid inline styles, JavaScript, or custom attributes.
          
          Rendered like this in JSX:
          <p dangerouslySetInnerHTML={{ __html: YOUR_RESPONSE }} />
    
          Here are the user's notes:
          ${formattedNotes}
          `,
    },
  ];

  for (let i = 0; i < newQuestions.length; i++) {
    messages.push({ role: 'user', content: newQuestions[i] });
    if (responses.length > i) {
      messages.push({ role: 'assistant', content: responses[i] });
    }
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4.1',
    messages,
  });

  return completion.choices[0].message.content || 'A problem has occurred';
};
