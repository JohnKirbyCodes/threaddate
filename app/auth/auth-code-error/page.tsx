import Link from "next/link";
import { XCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AuthCodeErrorPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="rounded-full bg-red-100 p-3">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
              <CardTitle>Authentication Error</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-stone-600">
              There was a problem signing you in. This could be due to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-stone-600">
              <li>The authentication link has expired</li>
              <li>The link has already been used</li>
              <li>There was a network issue during sign-in</li>
            </ul>
            <div className="pt-4">
              <Link
                href="/login"
                className="block w-full text-center bg-orange-600 text-white px-4 py-2 rounded-md hover:bg-orange-700 transition-colors"
              >
                Try Again
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
