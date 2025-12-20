"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export type VerificationAction = "verify" | "reject";

export interface VerifyBrandResult {
  success: boolean;
  error?: string;
}

async function isAdmin(): Promise<boolean> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return false;

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  return profile?.role === "admin";
}

export async function verifyBrand(
  brandId: number,
  action: VerificationAction
): Promise<VerifyBrandResult> {
  const supabase = await createClient();

  // Check admin status
  if (!(await isAdmin())) {
    return { success: false, error: "Admin access required" };
  }

  const updates = action === "verify"
    ? { verified: true, verification_status: "verified" }
    : { verified: false, verification_status: "rejected" };

  const { error } = await supabase
    .from("brands")
    .update(updates)
    .eq("id", brandId);

  if (error) {
    console.error("Error updating brand:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/admin/brands");
  revalidatePath("/brands");

  return { success: true };
}

export async function getPendingBrands() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("brands")
    .select("id, name, slug, logo_url, created_at, verification_status")
    .eq("verified", false)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending brands:", error);
    return [];
  }

  return data || [];
}
