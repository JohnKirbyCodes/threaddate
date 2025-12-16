import Link from "next/link";
import { Tag, Users, CheckCircle2, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-900 mb-4">
          What is ThreadDate?
        </h1>
        <p className="text-xl text-stone-600">
          The world's first crowdsourced database for dating vintage clothing
          identifiers
        </p>
      </div>

      {/* Main Content */}
      <div className="prose prose-stone max-w-none">
        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">The Problem</h2>
          <p className="text-lg text-stone-700 leading-relaxed mb-4">
            Vintage clothing authentication is fragmented. Information about
            dating tags, buttons, zippers, and stitching is scattered across
            forum posts, Instagram stories, and word-of-mouth knowledge. This
            makes it difficult for:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
            <li>
              <strong>Resellers</strong> to accurately date and price vintage
              pieces
            </li>
            <li>
              <strong>Collectors</strong> to verify authenticity and era
            </li>
            <li>
              <strong>Archivists</strong> to catalog historical garments
            </li>
            <li>
              <strong>Enthusiasts</strong> to learn about vintage clothing
              history
            </li>
          </ul>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Our Solution
          </h2>
          <p className="text-lg text-stone-700 leading-relaxed mb-6">
            ThreadDate brings this knowledge together into a searchable,
            verifiable database. Think Wikipedia meets Discogs, but for vintage
            clothing identifiers.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <Tag className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Comprehensive Coverage
              </h3>
              <p className="text-stone-700">
                Not just neck tags. We catalog care tags, buttons, snaps,
                zippers, tabs, stitching patterns, and hardware.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <Users className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Community Driven
              </h3>
              <p className="text-stone-700">
                Built by vintage enthusiasts, verified by the community. No
                single source of truth—crowdsourced accuracy.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <CheckCircle2 className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Evidence-Based
              </h3>
              <p className="text-stone-700">
                Submissions supported by catalog scans, copyright dates, and
                primary sources. Verifiable, not speculative.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
              <TrendingUp className="h-8 w-8 text-orange-600 mb-3" />
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                Always Growing
              </h3>
              <p className="text-stone-700">
                New brands, new eras, new identifier types. The database
                expands with every contribution.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Who It's For
          </h2>
          <div className="space-y-4 text-stone-700">
            <div className="p-4 bg-stone-50 rounded-lg">
              <h3 className="font-semibold text-stone-900 mb-1">
                Vintage Resellers
              </h3>
              <p>
                Date your inventory accurately. "1980s Nike" vs "1990s Nike" can
                mean a 3x price difference.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-lg">
              <h3 className="font-semibold text-stone-900 mb-1">
                Serious Collectors
              </h3>
              <p>
                Verify authenticity before purchasing rare pieces. Catch
                reproductions and misattributed eras.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-lg">
              <h3 className="font-semibold text-stone-900 mb-1">
                Thrift Store Diggers
              </h3>
              <p>
                Quickly identify valuable pieces in the wild. Your smartphone +
                ThreadDate = portable authentication.
              </p>
            </div>
            <div className="p-4 bg-stone-50 rounded-lg">
              <h3 className="font-semibold text-stone-900 mb-1">
                Fashion Archivists
              </h3>
              <p>
                Build comprehensive catalogs with accurate dating. Reference
                primary sources.
              </p>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-3xl font-bold text-stone-900 mb-4">
            Why Crowdsourcing Works
          </h2>
          <p className="text-lg text-stone-700 leading-relaxed mb-4">
            No single expert knows every brand, every era, every tag variation.
            But the collective knowledge of thousands of vintage enthusiasts?
            That's powerful.
          </p>
          <p className="text-lg text-stone-700 leading-relaxed mb-4">
            Our reputation-based verification system ensures quality:
          </p>
          <ul className="list-disc list-inside space-y-2 text-stone-700 ml-4">
            <li>Multiple users verify each submission</li>
            <li>Evidence is required for contentious dates</li>
            <li>High-reputation contributors have more weight</li>
            <li>The community self-corrects over time</li>
          </ul>
        </section>

        <section className="mb-12 bg-gradient-to-r from-orange-600 to-orange-500 p-8 rounded-lg text-white">
          <h2 className="text-3xl font-bold mb-4">Our Mission</h2>
          <p className="text-lg leading-relaxed mb-6">
            To preserve and democratize knowledge about vintage clothing
            authentication. We believe this information should be free, open,
            and accessible to everyone—from the casual thrifter to the museum
            curator.
          </p>
          <p className="text-lg leading-relaxed">
            ThreadDate is a public good. No paywalls. No gatekeeping. Just a
            community building something valuable together.
          </p>
        </section>
      </div>

      {/* CTA */}
      <div className="text-center mt-12 space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Ready to Contribute?</h2>
        <p className="text-stone-600">
          Help us build the definitive vintage clothing identifier database
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/how-it-works">
            <Button variant="outline" size="lg">
              Learn How It Works
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg">Submit Your First Identifier</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
