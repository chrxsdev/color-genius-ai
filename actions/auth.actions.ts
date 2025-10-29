'use server';

import { Provider } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/lib/supabase/server';
import { ROUTES } from '@/utils/constants/routes';

const signInWith =
  (provider: Provider) =>
  async (next: string = ROUTES.dashboard) => {
    const supabase = await createClient();

    const authCallbackUrl = `${process.env.URI}/api/auth/callback?next=${next}`;

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: { redirectTo: authCallbackUrl },
    });

    if (error) {
      console.error('Error during sign-in:', error.message);
      throw new Error('Sign-in failed');
    }

    redirect(data.url);
  };

const signOut = async () => {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath('/dashboard', 'layout');
  redirect('/');
};

const signInWithGoogle = (next?: string) => signInWith('google')(next);

const getCurrentUser = async () => {
  const supabase = await createClient();

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) return null;

  return user;
};

export { signInWithGoogle, signOut, getCurrentUser };
