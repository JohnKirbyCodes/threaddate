import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { type CookieOptions } from "@supabase/ssr";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  // if "next" is in param, use it as the redirect URL
  const next = searchParams.get("next") ?? "/";

  console.log("[OAuth Callback] Request received", {
    hasCode: !!code,
    next,
    origin,
    requestCookies: request.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
  });

  if (code) {
    let response = NextResponse.redirect(`${origin}${next}`);

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            const cookies = request.cookies.getAll();
            console.log("[OAuth Callback getAll]", { count: cookies.length });
            return cookies;
          },
          setAll(cookiesToSet) {
            console.log("[OAuth Callback setAll]", {
              count: cookiesToSet.length,
              cookies: cookiesToSet.map(c => ({
                name: c.name,
                hasValue: !!c.value,
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

    const { error, data } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("[OAuth Callback Error]", {
        message: error.message,
        code: code.substring(0, 10) + "...",
        origin,
      });
      return NextResponse.redirect(`${origin}/auth/auth-code-error`);
    }

    console.log("[OAuth Callback Success]", {
      hasSession: !!data.session,
      hasUser: !!data.user,
      userId: data.user?.id,
      redirectingTo: next,
      responseCookies: response.cookies.getAll().map(c => ({ name: c.name, hasValue: !!c.value }))
    });
    return response;
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
