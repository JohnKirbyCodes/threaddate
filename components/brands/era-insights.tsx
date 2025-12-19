import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { TrendingUp, Award, Clock, Sparkles } from "lucide-react";
import { getBrandEraInsights } from "@/lib/queries/brand-analytics";

interface EraInsightsProps {
  brandId: number;
  brandName: string;
}

export async function EraInsights({ brandId, brandName }: EraInsightsProps) {
  const insights = await getBrandEraInsights(brandId);

  if (!insights.mostCommonEra && !insights.highestVerifiedEra) {
    return null;
  }

  return (
    <Card className="bg-gradient-to-br from-blue-50 to-stone-50 border-blue-100">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-blue-600" />
          <h2 className="text-2xl font-bold text-stone-900">
            Era Insights
          </h2>
        </div>
        <p className="text-stone-600 mt-2">
          What collectors know about {brandName} identifiers
        </p>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Most Common Era */}
          {insights.mostCommonEra && (
            <Card className="border-stone-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0">
                    <TrendingUp className="h-5 w-5 text-orange-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-600 mb-1">
                      Most Common Era
                    </p>
                    <p className="text-lg font-bold text-stone-900 truncate">
                      {insights.mostCommonEra.era}
                    </p>
                    <p className="text-xs text-stone-500">
                      {insights.mostCommonEra.count} identifier{insights.mostCommonEra.count !== 1 ? 's' : ''}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Highest Verified Era */}
          {insights.highestVerifiedEra && (
            <Card className="border-stone-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                    <Award className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-600 mb-1">
                      Best for Dating
                    </p>
                    <p className="text-lg font-bold text-stone-900 truncate">
                      {insights.highestVerifiedEra.era}
                    </p>
                    <p className="text-xs text-stone-500">
                      Avg. score: {insights.highestVerifiedEra.avgScore}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Total Eras */}
          <Card className="border-stone-200 bg-white">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Clock className="h-5 w-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-stone-600 mb-1">
                    Eras Covered
                  </p>
                  <p className="text-lg font-bold text-stone-900">
                    {insights.totalEras}
                  </p>
                  <p className="text-xs text-stone-500">
                    Time periods
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Newest Addition */}
          {insights.newestIdentifier && (
            <Card className="border-stone-200 bg-white">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="h-5 w-5 text-purple-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-stone-600 mb-1">
                      Latest Addition
                    </p>
                    <p className="text-lg font-bold text-stone-900 truncate">
                      {insights.newestIdentifier.era}
                    </p>
                    <p className="text-xs text-stone-500">
                      Recently added
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <p className="text-sm text-stone-700">
            <span className="font-semibold">Collector Tip:</span> The "Most Common Era" typically indicates the period when this brand was most widely produced. The "Best for Dating" era has the most verified identifiers, making it easiest to date your pieces accurately.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
