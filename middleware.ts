import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  const startTime = Date.now();
  const pathname = request.nextUrl.pathname;

  console.log(`[Middleware Start] ${pathname}`, {
    hasCookies: request.cookies.getAll().length > 0,
    cookieCount: request.cookies.getAll().length,
    cookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  });

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          const cookies = request.cookies.getAll();
          console.log(`[Middleware getAll] Called for ${pathname}`, {
            count: cookies.length
          });
          return cookies;
        },
        setAll(cookiesToSet) {
          console.log(`[Middleware setAll] Called for ${pathname}`, {
            count: cookiesToSet.length,
            cookies: cookiesToSet.map(c => ({
              name: c.name,
              hasValue: !!c.value,
              hasOptions: !!c.options,
              sameSite: c.options?.sameSite,
              secure: c.options?.secure,
              httpOnly: c.options?.httpOnly,
              path: c.options?.path
            }))
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Refresh session if expired
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log(`[Middleware getUser] ${pathname}`, {
    hasUser: !!user,
    userId: user?.id,
    duration: Date.now() - startTime
  });

  // Protected routes - redirect to login if not authenticated
  const protectedRoutes = ["/submit", "/profile", "/settings"];
  const isProtectedRoute = protectedRoutes.some((route) =>
    request.nextUrl.pathname.startsWith(route)
  );

  if (isProtectedRoute && !user) {
    console.log(`[Middleware Redirect] ${pathname} - No user, redirecting to login`);
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = "/login";
    redirectUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  console.log(`[Middleware End] ${pathname}`, {
    hasUser: !!user,
    responseCookies: response.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value })),
    totalDuration: Date.now() - startTime
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
