import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SignUpForm } from "@/components/auth/signup-form";

export default async function SignUpPage() {
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
          <h1 className="text-3xl font-bold text-stone-900">Create Account</h1>
          <p className="mt-2 text-sm text-stone-600">
            Join the vintage clothing community
          </p>
        </div>

        <SignUpForm />

        <div className="text-center text-sm text-stone-600">
          Already have an account?{" "}
          <a href="/login" className="font-medium text-orange-600 hover:text-orange-700">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
