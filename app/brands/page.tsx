import Link from "next/link";
import { BrandGrid } from "@/components/home/brand-grid";
import { getBrands } from "@/lib/queries/brands";

export default async function BrandsPage() {
  const brands = await getBrands();

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900">All Brands</h1>
        <p className="mt-2 text-lg text-stone-600">
          Browse {brands.length} catalogued brands
        </p>
      </div>

      {/* Brands Grid */}
      <BrandGrid brands={brands} />

      {brands.length === 0 && (
        <div className="text-center py-12">
          <p className="text-stone-600">No brands found.</p>
          <Link
            href="/submit"
            className="mt-4 inline-block text-orange-600 hover:text-orange-700 font-medium"
          >
            Submit the first brand →
          </Link>
        </div>
      )}
    </div>
  );
}
