import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export const createClient = async () => {
  const cookieStore = await cookies();
  return createServerClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!, {
    db: {
      schema: process.env.SUPABASE_DB_SCHEMA,
    },
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach((cookie) => {
            cookieStore.set(cookie);
          });
        } catch {
          // The `setAll` helper was called from a Server Component.
          // This can be ignored if middleware keeps sessions in sync.
        }
      },
    },
  });
};
