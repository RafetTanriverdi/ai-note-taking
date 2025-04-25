'use server';

import { createClient } from '@rt/auth/server';
import { prisma } from '@rt/db/prisma';
import { handleError } from '@rt/lib/utils';

export const loginAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};

export const signUpAction = async (email: string, password: string) => {
  try {
    const { auth } = await createClient();

    const { data, error } = await auth.signUp({
      email,
      password,
    });

    console.log('Sign up data:', data, error);
    if (error) {
      return { errorMessage: error.message };
    }

    const userId = data.user?.id;
    if (!userId) {
      return { errorMessage: 'Error signing up' };
    }

    await prisma.user.create({
      data: {
        id: userId,
        email,
      },
    });

    return { errorMessage: null };
  } catch (error) {
    console.error('Error in signUpAction:', error);
    return handleError(error);
  }
};

export const logOutAction = async () => {
  try {
    const { auth } = await createClient();
    const { error } = await auth.signOut();
    if (error) throw error;
    return { errorMessage: null };
  } catch (error) {
    return handleError(error);
  }
};
