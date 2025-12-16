import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { LoginForm } from "@/components/auth/login-form";

export default async function LoginPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // If already logged in, redirect to home
  if (user) {
    redirect("/");
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">Welcome Back</h1>
          <p className="mt-2 text-sm text-stone-600">
            Sign in to contribute to ThreadDate
          </p>
        </div>

        <LoginForm />

        <div className="text-center text-sm text-stone-600">
          Don't have an account?{" "}
          <a href="/signup" className="font-medium text-orange-600 hover:text-orange-700">
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
