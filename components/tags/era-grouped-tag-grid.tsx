import { TagCard } from "./tag-card";

interface Tag {
  id: number;
  image_url: string;
  category: string;
  era: string;
  verification_score: number | null;
  status: "pending" | "verified" | "rejected";
  brands: {
    id: number;
    name: string;
    slug: string;
    logo_url: string | null;
  } | null;
}

interface EraGroupedTagGridProps {
  tags: Tag[];
}

// Define era chronological order (newest to oldest)
const ERA_ORDER = [
  "Modern",
  "2020s",
  "2010s",
  "2000s (Y2K)",
  "1990s",
  "1980s",
  "1970s",
  "1960s",
  "1950s",
  "1940s",
  "1930s",
  "1920s",
  "1910s",
  "1900s",
  "Pre-1900s",
];

export function EraGroupedTagGrid({ tags }: EraGroupedTagGridProps) {
  // Group tags by era
  const groupedByEra = tags.reduce((acc, tag) => {
    if (!acc[tag.era]) {
      acc[tag.era] = [];
    }
    acc[tag.era].push(tag);
    return acc;
  }, {} as Record<string, Tag[]>);

  // Get eras that have tags, in chronological order
  const erasWithTags = ERA_ORDER.filter((era) => groupedByEra[era]);

  if (erasWithTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-8">
      {erasWithTags.map((era) => (
        <div key={era} className="space-y-4">
          {/* Era Header */}
          <div className="border-b border-stone-200 pb-2">
            <h2 className="text-lg font-semibold text-stone-900">{era}</h2>
            <p className="text-sm text-stone-500">
              {groupedByEra[era].length}{" "}
              {groupedByEra[era].length === 1 ? "identifier" : "identifiers"}
            </p>
          </div>

          {/* Tags Grid for this Era */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
            {groupedByEra[era].map((tag) => (
              <TagCard
                key={tag.id}
                id={tag.id}
                imageUrl={tag.image_url}
                brandName={tag.brands?.name || "Unknown"}
                category={tag.category}
                era={tag.era}
                verificationScore={tag.verification_score}
                status={tag.status}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
