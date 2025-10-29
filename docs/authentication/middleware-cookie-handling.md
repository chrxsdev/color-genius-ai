# Supabase Auth Callback & Cookie Handling Fix

## What Happened
- Google OAuth sign-in began redirecting to `/api/auth/callback` with a valid `code`.
- Supabase responded with `invalid request: both auth code and code verifier should be non-empty`.
- The PKCE code verifier lives in Supabase cookies; the middleware SSR client was not persisting those cookies correctly.
- Supabase recently updated their App Router docs to require `cookies.getAll()` / `cookies.setAll()` instead of the older `get`/`set`/`remove` helpers. The mismatch prevented the verifier from being sent back during the callback exchange.

## The Applied Solution
1. **Middleware Client Update**
   ```ts
   const supabase = createServerClient(url, key, {
     cookies: {
       getAll() {
         return request.cookies.getAll();
       },
       setAll(cookiesToSet) {
         supabaseResponse = NextResponse.next({ request });
         cookiesToSet.forEach(({ name, value, options }) => {
           request.cookies.set(name, value);
           supabaseResponse.cookies.set(name, value, options);
         });
       },
     },
   });
   ```
   - `getAll` exposes the incoming cookies (including the code verifier).
   - `setAll` mirrors Supabase-issued cookies onto the outgoing `NextResponse` so the browser stays in sync.

2. **Server Action Helper Update**
   ```ts
   const cookieStore = await cookies();
   const supabase = createServerClient(url, key, {
     cookies: {
       getAll() {
         return cookieStore.getAll();
       },
       setAll(cookiesToSet) {
         cookiesToSet.forEach((cookie) => {
           cookieStore.set(cookie);
         });
       },
     },
   });
   ```
   - Aligns the server-side helper with the same interface so route handlers and server actions remain compatible.

## Why It Works
- Supabase expects the same cookie storage interface in middleware and server actions.
- Without `setAll`, the regenerated PKCE verifier cookie never reached the browser, so the callback lacked the data required to complete the exchange.
- Using `getAll`/`setAll` keeps session cookies symmetrical and future-proof for Supabase SSR SDK changes.

## Reproducing the Original Issue (Before Fix)
1. Trigger Google sign-in from `/auth/sign-in`.
2. Supabase creates a PKCE verifier cookie; middleware fails to forward it.
3. Callback to `/api/auth/callback` attempts `exchangeCodeForSession` and throws `AuthApiError` (HTTP 400).

## Expected Behaviour After Fix
1. Initiate Google sign-in.
2. Middleware forwards cookies via `getAll`; Supabase writes new cookies through `setAll`.
3. Callback includes the PKCE verifier, allowing `exchangeCodeForSession` to succeed.
4. User is redirected to `/dashboard` (or the requested `next` route).

## Testing Checklist
- ✅ Sign in with Google on localhost: user redirected to dashboard without error.
- ✅ Repeat sign-in on fresh incognito session: cookies populate correctly.
- ✅ Supabase session persists across protected routes (`/dashboard`, `/profile`).

## Troubleshooting Tips
- If errors persist, open DevTools → Application → Cookies and confirm that `sb-...-auth-token` and PKCE cookies appear after redirect.
- Confirm `.env` values (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY`, `SUPABASE_DB_SCHEMA`) match the Supabase project.
- Middleware must return the exact `supabaseResponse`; avoid creating a new `NextResponse` after calling `updateSession`.
