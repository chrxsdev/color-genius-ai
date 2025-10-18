import { NextResponse, type NextRequest } from 'next/server';
import { getUser, updateSession } from '@/lib/supabase/middleware';

export async function middleware(request: NextRequest, response: NextResponse) {
  const protectedRoutes = ['/dashboard']; // TODO: Add profile route when implemented
  const path = new URL(request.url).pathname;
  const user = await getUser(request, response);

  if (protectedRoutes.includes(path) && !user) return NextResponse.redirect(new URL('/auth/sign-in', request.url));

  // Update user's auth session
  return await updateSession(request);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
