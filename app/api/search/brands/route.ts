import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const limit = parseInt(searchParams.get("limit") || "5");

  if (!query || query.length < 2) {
    return NextResponse.json([]);
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url, verified")
    .ilike("name", `%${query}%`)
    .order("verified", { ascending: false })
    .order("name", { ascending: true })
    .limit(limit);

  if (error) {
    console.error("Error searching brands:", error);
    return NextResponse.json([]);
  }

  return NextResponse.json(data || []);
}
