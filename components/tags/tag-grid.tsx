import { TagCard } from "./tag-card";

interface Tag {
  id: number;
  image_url: string;
  category: string;
  era: string;
  verification_score: number;
  status: "pending" | "verified" | "rejected";
  brands: {
    name: string;
  };
}

interface TagGridProps {
  tags: Tag[];
}

export function TagGrid({ tags }: TagGridProps) {
  if (tags.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="rounded-full bg-stone-100 p-6">
          <svg
            className="h-12 w-12 text-stone-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
            />
          </svg>
        </div>
        <h3 className="mt-4 text-lg font-semibold text-stone-900">
          No tags found
        </h3>
        <p className="mt-2 text-sm text-stone-600 max-w-sm">
          Be the first to contribute! Submit a tag to help build the database.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
      {tags.map((tag) => (
        <TagCard
          key={tag.id}
          id={tag.id}
          imageUrl={tag.image_url}
          brandName={tag.brands.name}
          category={tag.category}
          era={tag.era}
          verificationScore={tag.verification_score}
          status={tag.status}
        />
      ))}
    </div>
  );
}
