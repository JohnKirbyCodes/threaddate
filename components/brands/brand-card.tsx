import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Building2 } from "lucide-react";

interface BrandCardProps {
  id: number;
  name: string;
  slug: string;
  logoUrl?: string | null;
  tagCount?: number;
}

export function BrandCard({ name, slug, logoUrl, tagCount }: BrandCardProps) {
  return (
    <Link href={`/brands/${slug}`}>
      <Card className="group overflow-hidden transition-all hover:shadow-lg hover:ring-2 hover:ring-orange-500">
        <CardContent className="p-6">
          <div className="flex items-center gap-4">
            {/* Logo or Icon */}
            <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-stone-100">
              {logoUrl ? (
                <img
                  src={logoUrl}
                  alt={`${name} logo`}
                  className="h-full w-full object-contain"
                />
              ) : (
                <Building2 className="h-8 w-8 text-stone-400" />
              )}
            </div>

            {/* Brand Info */}
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-semibold text-stone-900 truncate group-hover:text-orange-600 transition-colors">
                {name}
              </h3>
              {tagCount !== undefined && (
                <p className="text-sm text-stone-600 mt-1">
                  {tagCount} {tagCount === 1 ? "identifier" : "identifiers"}
                </p>
              )}
            </div>

            {/* Arrow Icon */}
            <div className="shrink-0">
              <svg
                className="h-5 w-5 text-stone-400 transition-transform group-hover:translate-x-1 group-hover:text-orange-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
