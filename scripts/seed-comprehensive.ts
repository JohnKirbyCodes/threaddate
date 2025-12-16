import { createClient } from "@supabase/supabase-js";
import type { Database } from "../lib/supabase/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient<Database>(supabaseUrl, supabaseServiceKey);

// Comprehensive brand list
const BRANDS = [
  "Abercrombie & Fitch", "Adidas", "Admiral", "Aeropostale", "Airwalk", "Alstyle (AAA)",
  "American Apparel", "American Eagle", "Anvil", "Apex One", "Aramark", "Arc'teryx",
  "Armani", "Arrow", "Artex", "Asics", "Athletic Works", "Avia", "BAPE", "Baby Phat",
  "Balenciaga", "Banana Republic", "Bantam", "Bass Pro Shops", "Bella+Canvas", "Ben Davis",
  "Big Mac", "Big Smith", "Billabong", "Boy Scouts of America", "Brahma", "Brent",
  "Brockum", "Brooks Brothers", "Budweiser", "Bugle Boy", "Burberry", "Cabela's",
  "Calvin Klein", "Camel", "Carhartt", "Chalk Line", "Champion", "Chanel", "Chaps",
  "Cheddar", "Cherokee", "Chic", "Cintas", "Coca-Cola", "Columbia", "Comfort Colors",
  "Comme des Garcons", "Converse", "CP Company", "Croft & Barrow", "Cross Colours",
  "DC Shoes", "Danskin", "Delta", "Diadora", "Dickies", "Diesel", "Dior", "Disney",
  "Dockers", "Dolce & Gabbana", "ENYCE", "Eastpak", "Ecko Unltd", "Ed Hardy",
  "Eddie Bauer", "Ellesse", "Etnies", "Evisu", "FUBU", "Faded Glory", "Fendi", "Fila",
  "Filson", "Five Brother", "Fred Perry", "Fruit of the Loom", "Gant", "Gap", "George",
  "Giant", "Gildan", "Girbaud", "Givenchy", "Gloria Vanderbilt", "Gotcha", "Gucci",
  "Guess", "H Bar C", "H&M", "Hang Ten", "Hanes", "Hard Rock Cafe", "Harley-Davidson",
  "Healthknit", "Helly Hansen", "Helmut Lang", "Hercules", "Hermes", "Hollister",
  "Hummel", "Hurley", "Issey Miyake", "Izod", "J.Crew", "JCPenney", "JNCO", "JanSport",
  "Jean Paul Gaultier", "Jerzees", "Jimmy'Z", "Jordache", "Juicy Couture", "Justin",
  "Kappa", "Karl Kani", "Karman", "Keen", "Kelty", "Key", "Kikwear", "LL Bean",
  "Lacoste", "Lands' End", "Le Coq Sportif", "Lee", "Levi's", "Lightning Bolt",
  "Logo 7", "Looney Tunes", "Lotto", "Louis Vuitton", "Lucchese", "Lucky Brand", "Lugz",
  "Lululemon", "M&O", "Magic Johnson Ts", "Maison Margiela", "Majestic", "Marlboro",
  "Marmot", "Maurice Malone", "Mayo Spruce", "McDonald's", "Mecca", "Merona", "Merrell",
  "Mickey & Co", "Missoni", "Mitchell & Ness", "Mizuno", "Moncler", "Montgomery Ward",
  "Moschino", "Mossimo", "Mountain Hardwear", "NASA", "Nautica", "New Balance", "Nike",
  "No Boundaries", "Nutmeg", "O'Neill", "Ocean Pacific (OP)", "Old Navy", "Oneita",
  "Orvis", "OshKosh B'gosh", "Palace", "Panhandle Slim", "Patagonia", "Pelle Pelle",
  "Pendelton", "Pepsi", "Phat Farm", "Pilgrim", "Planet Hollywood", "Playboy",
  "Pointer Brand", "Pony", "Powell Peralta", "Power House", "Prada", "Pro Player",
  "Puma", "Quiksilver", "REI", "Ralph Lauren", "Red Kap", "Red Wing", "Reebok", "Replay",
  "Resistol", "Rip Curl", "Rocawear", "Rockmount", "Roper", "Round House",
  "Russell Athletic", "Rusty", "Santa Cruz", "Sasson", "Saucony", "Screen Stars",
  "Sean John", "Sears", "Sergio Tacchini", "Sierra Designs", "Signal", "Sonoma",
  "Southpole", "Sportswear", "Spring Ford", "St. John's Bay", "Stan Ray", "Starter",
  "Stedman", "Stetson", "Stone Island", "Stussy", "Supreme", "Tee Jays", "Terra",
  "The North Face", "Thrasher", "Timberland", "Tommy Hilfiger", "Tony Lama",
  "Town & Country", "Towncraft", "Trench", "Tultex", "US Air Force", "US Army",
  "US Navy", "USMC", "Umbro", "Under Armour", "Uniqlo", "Van Heusen", "Vans",
  "Velva Sheen", "Versace", "Vision Street Wear", "Volcom", "Von Dutch", "Walls",
  "Warner Bros", "Washington Dee Cee", "White Stag", "Wolverine", "Woolrich",
  "Wrangler", "YSL", "Yohji Yamamoto", "Zara"
];

// Create slug from brand name
function createSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function seed() {
  console.log("🌱 Starting comprehensive brand seed...\n");

  // Check if brands already exist
  const { data: existingBrands, count } = await supabase
    .from("brands")
    .select("*", { count: "exact" });

  if (count && count > 10) {
    console.log(`⚠️  Database already has ${count} brands. Skipping...`);
    return;
  }

  // Prepare brands with slugs
  console.log(`📦 Preparing ${BRANDS.length} brands...`);
  const brandsToInsert = BRANDS.map((name) => ({
    name,
    slug: createSlug(name),
    logo_url: null,
    founded_year: null,
  }));

  // Insert brands in batches
  const BATCH_SIZE = 100;
  let insertedCount = 0;

  for (let i = 0; i < brandsToInsert.length; i += BATCH_SIZE) {
    const batch = brandsToInsert.slice(i, i + BATCH_SIZE);
    const { error: brandsError } = await supabase
      .from("brands")
      .upsert(batch, { onConflict: "slug", ignoreDuplicates: true });

    if (brandsError) {
      console.error("❌ Error inserting brands batch:", brandsError);
      throw brandsError;
    }

    insertedCount += batch.length;
    console.log(`  ✓ Processed ${insertedCount}/${brandsToInsert.length} brands`);
  }

  console.log(`\n✅ Inserted all ${insertedCount} brands\n`);
  console.log("🎉 Brand seeding completed successfully!");
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
