import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Brand descriptions for The Big 6
const brandDescriptions = [
  {
    slug: "nike",
    description: "Founded by Bill Bowerman and Phil Knight, Nike became the world's largest athletic footwear and apparel company. Known for the iconic Swoosh logo and 'Just Do It' slogan.",
  },
  {
    slug: "adidas",
    description: "German sportswear giant founded by Adolf Dassler in 1949. Famous for the Three Stripes logo and its deep roots in both athletic performance and street culture.",
  },
  {
    slug: "champion",
    description: "American heritage athletic brand founded in 1919. Pioneered the reverse weave sweatshirt and became a staple of vintage sportswear collectors.",
  },
  {
    slug: "levis",
    description: "Iconic American denim brand founded in 1853. Invented the blue jean and revolutionized workwear. The 501 is one of the most recognizable garments in fashion history.",
  },
  {
    slug: "wrangler",
    description: "American denim brand established in 1947, known for its Western heritage and association with rodeo culture. A staple of authentic American workwear.",
  },
  {
    slug: "carhartt",
    description: "Detroit-based workwear brand founded in 1889. Built a reputation for durable, functional clothing for blue-collar workers before becoming a streetwear icon.",
  },
];

async function addDescriptions() {
  console.log("📝 Adding brand descriptions...\n");

  for (const brand of brandDescriptions) {
    const { error } = await supabase
      .from("brands")
      .update({ description: brand.description })
      .eq("slug", brand.slug);

    if (error) {
      console.error(`❌ Error updating ${brand.slug}:`, error);
    } else {
      console.log(`✓ Updated ${brand.slug}`);
    }
  }

  console.log("\n✅ Brand descriptions added successfully!");
}

addDescriptions()
  .then(() => {
    console.log("✨ Done!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("💥 Failed:", error);
    process.exit(1);
  });
