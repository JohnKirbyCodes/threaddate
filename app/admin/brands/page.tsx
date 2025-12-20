import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getPendingBrands } from "@/lib/actions/verify-brand";
import { AdminBrandsList } from "./admin-brands-list";

export const metadata = {
  title: "Admin: Pending Brands | ThreadDate",
};

export default async function AdminBrandsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?redirect=/admin/brands");
  }

  // Check admin role
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    redirect("/");
  }

  const pendingBrands = await getPendingBrands();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-stone-900">Brand Verification</h1>
        <p className="text-stone-600 mt-2">
          Review and verify user-submitted brands
        </p>
      </div>

      <AdminBrandsList brands={pendingBrands} />
    </div>
  );
}
