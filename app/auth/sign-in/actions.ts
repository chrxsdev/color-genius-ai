'use server';

import { createClient } from '@/lib/supabase/supabase';
import { Provider } from '@supabase/supabase-js';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const signInWith = (provider: Provider) => async () => {
  const supabase = await createClient();

  const authCallbackUrl = `${process.env.URI}/api/auth/callback`;

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

const signInWithGoogle = signInWith('google');

export { signInWithGoogle, signOut };
