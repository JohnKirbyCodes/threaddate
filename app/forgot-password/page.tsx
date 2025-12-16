import { ForgotPasswordForm } from "@/components/auth/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">Reset Password</h1>
          <p className="mt-2 text-sm text-stone-600">
            Enter your email to receive a password reset link
          </p>
        </div>

        <ForgotPasswordForm />

        <div className="text-center text-sm text-stone-600">
          Remember your password?{" "}
          <a href="/login" className="font-medium text-orange-600 hover:text-orange-700">
            Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
