import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-50">
      <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-lg">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-stone-900">Set New Password</h1>
          <p className="mt-2 text-sm text-stone-600">
            Enter your new password below
          </p>
        </div>

        <ResetPasswordForm />
      </div>
    </div>
  );
}
