import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

const BIG_SIX_BRANDS = [
  {
    name: "Nike",
    slug: "nike",
    founded_year: 1964,
    logo_url: "https://logo.clearbit.com/nike.com",
  },
  {
    name: "Adidas",
    slug: "adidas",
    founded_year: 1949,
    logo_url: "https://logo.clearbit.com/adidas.com",
  },
  {
    name: "Champion",
    slug: "champion",
    founded_year: 1919,
    logo_url: "https://logo.clearbit.com/champion.com",
  },
  {
    name: "Levi's",
    slug: "levis",
    founded_year: 1853,
    logo_url: "https://logo.clearbit.com/levis.com",
  },
  {
    name: "Wrangler",
    slug: "wrangler",
    founded_year: 1947,
    logo_url: "https://logo.clearbit.com/wrangler.com",
  },
  {
    name: "Carhartt",
    slug: "carhartt",
    founded_year: 1889,
    logo_url: "https://logo.clearbit.com/carhartt.com",
  },
];

async function seed() {
  console.log("🌱 Starting database seed...\n");

  // Check if brands already exist
  const { data: existingBrands } = await supabase
    .from("brands")
    .select("id")
    .limit(1);

  if (existingBrands && existingBrands.length > 0) {
    console.log("⚠️  Database already seeded. Skipping...");
    return;
  }

  // Insert The Big 6 Brands
  console.log("📦 Inserting brands...");
  const { data: brands, error: brandsError } = await supabase
    .from("brands")
    .insert(BIG_SIX_BRANDS)
    .select();

  if (brandsError) {
    console.error("❌ Error inserting brands:", brandsError);
    throw brandsError;
  }

  console.log(`✅ Inserted ${brands?.length} brands\n`);

  // Create sample tags for each brand
  console.log("🏷️  Creating sample tags...");

  const sampleTags = [
    // Nike tags
    {
      brand_id: brands?.find((b) => b.slug === "nike")?.id,
      category: "Neck Tag" as const,
      era: "1980s" as const,
      year_start: 1980,
      year_end: 1989,
      stitch_type: "Single" as const,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 15,
      image_url: "https://placehold.co/400x400/ea580c/white?text=Nike+80s+Tag",
      submission_notes: "Classic Nike orange tag with pinwheel logo",
    },
    {
      brand_id: brands?.find((b) => b.slug === "nike")?.id,
      category: "Care Tag" as const,
      era: "1990s" as const,
      year_start: 1990,
      year_end: 1999,
      origin_country: "China",
      status: "verified" as const,
      verification_score: 12,
      image_url: "https://placehold.co/400x400/ea580c/white?text=Nike+90s+Care",
      submission_notes: "Nike care tag with barcode, Made in China",
    },
    // Adidas tags
    {
      brand_id: brands?.find((b) => b.slug === "adidas")?.id,
      category: "Neck Tag" as const,
      era: "1970s" as const,
      year_start: 1970,
      year_end: 1979,
      stitch_type: "Double" as const,
      origin_country: "West Germany",
      status: "verified" as const,
      verification_score: 20,
      image_url:
        "https://placehold.co/400x400/0066cc/white?text=Adidas+70s+Tag",
      submission_notes: "Trefoil logo, Made in West Germany",
    },
    {
      brand_id: brands?.find((b) => b.slug === "adidas")?.id,
      category: "Button/Snap" as const,
      era: "1980s" as const,
      year_start: 1980,
      year_end: 1989,
      origin_country: "Germany",
      status: "verified" as const,
      verification_score: 8,
      image_url:
        "https://placehold.co/400x400/0066cc/white?text=Adidas+Button",
      submission_notes: "Metal snap button with trefoil embossing",
    },
    // Champion tags
    {
      brand_id: brands?.find((b) => b.slug === "champion")?.id,
      category: "Neck Tag" as const,
      era: "1990s" as const,
      year_start: 1990,
      year_end: 1999,
      stitch_type: "Single" as const,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 18,
      image_url:
        "https://placehold.co/400x400/cc0000/white?text=Champion+90s",
      submission_notes: "Champion Reverse Weave tag, Made in USA",
    },
    {
      brand_id: brands?.find((b) => b.slug === "champion")?.id,
      category: "Tab" as const,
      era: "2000s (Y2K)" as const,
      year_start: 2000,
      year_end: 2009,
      origin_country: "Mexico",
      status: "verified" as const,
      verification_score: 6,
      image_url: "https://placehold.co/400x400/cc0000/white?text=Champion+Tab",
      submission_notes: "Side seam Champion C logo tab",
    },
    // Levi's tags
    {
      brand_id: brands?.find((b) => b.slug === "levis")?.id,
      category: "Tab" as const,
      era: "1950s" as const,
      year_start: 1950,
      year_end: 1959,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 25,
      image_url: "https://placehold.co/400x400/003366/white?text=Levi's+Big+E",
      submission_notes: "Big E red tab - highly collectible",
    },
    {
      brand_id: brands?.find((b) => b.slug === "levis")?.id,
      category: "Care Tag" as const,
      era: "1980s" as const,
      year_start: 1980,
      year_end: 1989,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 14,
      image_url:
        "https://placehold.co/400x400/003366/white?text=Levi's+Care+Tag",
      submission_notes: "Small e tab, orange tab variant",
    },
    // Wrangler tags
    {
      brand_id: brands?.find((b) => b.slug === "wrangler")?.id,
      category: "Neck Tag" as const,
      era: "1970s" as const,
      year_start: 1970,
      year_end: 1979,
      stitch_type: "Chain" as const,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 11,
      image_url:
        "https://placehold.co/400x400/996633/white?text=Wrangler+70s",
      submission_notes: "Blue Bell era Wrangler tag",
    },
    {
      brand_id: brands?.find((b) => b.slug === "wrangler")?.id,
      category: "Button/Snap" as const,
      era: "1960s" as const,
      year_start: 1960,
      year_end: 1969,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 9,
      image_url:
        "https://placehold.co/400x400/996633/white?text=Wrangler+Button",
      submission_notes: "Vintage Wrangler shank button",
    },
    // Carhartt tags
    {
      brand_id: brands?.find((b) => b.slug === "carhartt")?.id,
      category: "Neck Tag" as const,
      era: "1990s" as const,
      year_start: 1990,
      year_end: 1999,
      stitch_type: "Double" as const,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 16,
      image_url:
        "https://placehold.co/400x400/663300/white?text=Carhartt+90s",
      submission_notes: "Union made in USA tag with heart logo",
    },
    {
      brand_id: brands?.find((b) => b.slug === "carhartt")?.id,
      category: "Hardware" as const,
      era: "1980s" as const,
      year_start: 1980,
      year_end: 1989,
      origin_country: "USA",
      status: "verified" as const,
      verification_score: 7,
      image_url:
        "https://placehold.co/400x400/663300/white?text=Carhartt+Zipper",
      submission_notes: "Talon zipper with Carhartt pull",
    },
  ];

  // We need to create a user first to assign tags to
  // For seeding purposes, we'll create a system user
  const { data: authUser, error: authError } = await supabase.auth.admin.createUser({
    email: "system@threaddate.local",
    email_confirm: true,
    user_metadata: {
      full_name: "System",
      avatar_url: null,
    },
  });

  if (authError) {
    console.error("❌ Error creating system user:", authError);
    throw authError;
  }

  console.log("✅ Created system user");

  // Create profile for system user
  const { error: profileError } = await supabase.from("profiles").insert({
    id: authUser.user.id,
    username: "system",
    role: "admin",
  });

  if (profileError) {
    console.error("❌ Error creating system profile:", profileError);
    throw profileError;
  }

  console.log("✅ Created system profile");

  // Insert tags with system user as submitter
  const tagsWithUser = sampleTags.map((tag) => ({
    ...tag,
    user_id: authUser.user.id,
  }));

  const { data: insertedTags, error: tagsError } = await supabase
    .from("tags")
    .insert(tagsWithUser)
    .select();

  if (tagsError) {
    console.error("❌ Error inserting tags:", tagsError);
    throw tagsError;
  }

  console.log(`✅ Inserted ${insertedTags?.length} sample tags\n`);

  console.log("🎉 Seeding completed successfully!");
  console.log("\nSummary:");
  console.log(`  - ${brands?.length} brands`);
  console.log(`  - ${insertedTags?.length} verified tags`);
  console.log(`  - 1 system user\n`);
}

seed()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Seed failed:", error);
    process.exit(1);
  });
