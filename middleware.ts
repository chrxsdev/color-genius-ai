import { NextResponse, type NextRequest } from 'next/server';
import { getUser, updateSession } from './lib/supabase/middleware';

export const middleware = async (request: NextRequest) => {
  const protectedRoutes = ['/dashboard', '/profile', '/likes'];
  const publicRoutes = ['/auth/sign-in'];
  const path = new URL(request.url).pathname;

  const user = await getUser(request);

  if (protectedRoutes.includes(path) && !user) return NextResponse.redirect(new URL('/auth/sign-in', request.url));
  if (publicRoutes.includes(path) && user) return NextResponse.redirect(new URL('/dashboard', request.url));

  // Update user's auth session
  return await updateSession(request);
};

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};
