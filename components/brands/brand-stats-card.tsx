import { LucideIcon } from "lucide-react";

interface BrandStatsCardProps {
  icon: LucideIcon;
  label: string;
  value: number;
}

export function BrandStatsCard({ icon: Icon, label, value }: BrandStatsCardProps) {
  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-6 text-center">
      <div className="flex justify-center mb-2">
        <div className="bg-orange-100 rounded-full p-3">
          <Icon className="h-6 w-6 text-orange-600" />
        </div>
      </div>
      <p className="text-2xl md:text-3xl font-bold text-stone-900">{value}</p>
      <p className="text-sm text-stone-600 mt-1">{label}</p>
    </div>
  );
}
