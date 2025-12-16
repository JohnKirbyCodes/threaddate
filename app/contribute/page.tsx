import Link from "next/link";
import {
  CheckCircle2,
  XCircle,
  AlertTriangle,
  BookOpen,
  Camera,
  FileSearch,
  Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ContributePage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-900 mb-4">
          Contribution Guidelines
        </h1>
        <p className="text-xl text-stone-600">
          Help us build the most accurate vintage clothing database
        </p>
      </div>

      {/* Core Principles */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Core Principles
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <BookOpen className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Evidence-Based
            </h3>
            <p className="text-stone-700">
              All dating should be backed by evidence: copyright dates, catalog
              scans, RN numbers, or multiple corroborating examples.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <Camera className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Quality Photos
            </h3>
            <p className="text-stone-700">
              Clear, well-lit, high-resolution images are essential. Blurry or
              dark photos cannot be accurately verified.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <FileSearch className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Honesty About Uncertainty
            </h3>
            <p className="text-stone-700">
              It's better to give a broad date range than a wildly inaccurate
              specific date. Use the notes field to explain your reasoning.
            </p>
          </div>

          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <Users className="h-8 w-8 text-blue-600 mb-3" />
            <h3 className="text-lg font-semibold text-stone-900 mb-2">
              Community First
            </h3>
            <p className="text-stone-700">
              Vote based on evidence, not ego. We're building this together—no
              one person has all the answers.
            </p>
          </div>
        </div>
      </section>

      {/* Photo Guidelines */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Photo Guidelines
        </h2>

        <div className="space-y-6">
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <div className="flex items-start gap-3 mb-3">
              <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  Good Photos Include:
                </h3>
                <ul className="space-y-1 text-stone-700">
                  <li>• Clear focus with readable text</li>
                  <li>• Even, natural lighting</li>
                  <li>• Entire tag/identifier visible in frame</li>
                  <li>• Neutral background (white or light gray ideal)</li>
                  <li>• Multiple angles if details are on both sides</li>
                  <li>• Close-up of any copyright dates or codes</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-start gap-3 mb-3">
              <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  Avoid These Issues:
                </h3>
                <ul className="space-y-1 text-stone-700">
                  <li>• Blurry or out-of-focus images</li>
                  <li>• Harsh shadows or glare obscuring text</li>
                  <li>• Tag partially cut off by frame edge</li>
                  <li>• Busy backgrounds that distract from tag</li>
                  <li>• Photos taken in dim lighting</li>
                  <li>• Extreme angles that distort the tag</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Dating Guidelines */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Dating Guidelines
        </h2>

        <div className="space-y-6">
          {/* Primary Evidence */}
          <div>
            <h3 className="text-xl font-semibold text-stone-900 mb-3">
              Primary Evidence (Most Reliable)
            </h3>
            <div className="bg-stone-50 p-6 rounded-lg space-y-3 text-stone-700">
              <p>
                <strong>Copyright Dates:</strong> © 1985 on a tag means it can't
                be older than 1985
              </p>
              <p>
                <strong>RN Numbers:</strong> Registered numbers can be dated via
                FTC records
              </p>
              <p>
                <strong>CA Numbers:</strong> Canadian registration numbers,
                similar to RN
              </p>
              <p>
                <strong>Union Labels:</strong> ILGWU and other union tags changed
                over specific years
              </p>
              <p>
                <strong>Country Tags:</strong> "Made in USA" vs "Made in China"
                can narrow date ranges
              </p>
            </div>
          </div>

          {/* Secondary Evidence */}
          <div>
            <h3 className="text-xl font-semibold text-stone-900 mb-3">
              Secondary Evidence (Supportive)
            </h3>
            <div className="bg-stone-50 p-6 rounded-lg space-y-3 text-stone-700">
              <p>
                <strong>Catalog Scans:</strong> Brand catalogs showing the
                specific tag
              </p>
              <p>
                <strong>Multiple Examples:</strong> Several identical tags from
                dated garments
              </p>
              <p>
                <strong>Logo Evolution:</strong> Known changes in brand logo
                design
              </p>
              <p>
                <strong>Care Symbols:</strong> Care label symbology changed in
                specific years
              </p>
              <p>
                <strong>Font Changes:</strong> Documented font/typography shifts
              </p>
            </div>
          </div>

          {/* Warning */}
          <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-semibold text-stone-900 mb-2">
                  Be Cautious With:
                </h3>
                <ul className="space-y-1 text-stone-700">
                  <li>
                    • <strong>Hearsay:</strong> "Someone on Instagram said..."
                    isn't evidence
                  </li>
                  <li>
                    • <strong>Assumptions:</strong> "This looks 80s" without
                    supporting facts
                  </li>
                  <li>
                    • <strong>Style-based dating:</strong> Trends overlapped and
                    revival pieces exist
                  </li>
                  <li>
                    • <strong>Single examples:</strong> One outlier doesn't prove
                    a date range
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Voting Guidelines */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-6">
          Voting Guidelines
        </h2>

        <div className="space-y-4">
          <div className="bg-stone-50 p-6 rounded-lg">
            <h3 className="font-semibold text-stone-900 mb-2">When to Upvote</h3>
            <ul className="space-y-1 text-stone-700">
              <li>
                • The dating is supported by clear evidence in the photo
                (copyright date, RN number, etc.)
              </li>
              <li>
                • You have personal knowledge/examples confirming the date range
              </li>
              <li>
                • The submission includes supporting evidence (catalogs, care
                tags, etc.)
              </li>
              <li>• The date range is appropriately broad given the evidence</li>
            </ul>
          </div>

          <div className="bg-stone-50 p-6 rounded-lg">
            <h3 className="font-semibold text-stone-900 mb-2">
              When to Downvote
            </h3>
            <ul className="space-y-1 text-stone-700">
              <li>
                • The dating contradicts visible evidence (copyright date says
                1995, submission says 1985)
              </li>
              <li>
                • You have documented proof the date is wrong (catalog scans,
                etc.)
              </li>
              <li>
                • The photo quality is too poor to verify the dating
              </li>
              <li>• The submission is clearly a modern reproduction</li>
            </ul>
          </div>

          <div className="bg-stone-50 p-6 rounded-lg">
            <h3 className="font-semibold text-stone-900 mb-2">
              When NOT to Vote
            </h3>
            <ul className="space-y-1 text-stone-700">
              <li>• You're not familiar with the brand or era</li>
              <li>• You're just guessing based on aesthetics</li>
              <li>• You have a conflict of interest (it's your submission)</li>
              <li>• You're voting based on the submitter, not the content</li>
            </ul>
          </div>
        </div>
      </section>

      {/* What NOT to Submit */}
      <section className="mb-16 bg-red-50 p-8 rounded-lg border border-red-200">
        <h2 className="text-2xl font-bold text-stone-900 mb-6 flex items-center gap-2">
          <XCircle className="h-6 w-6 text-red-600" />
          What NOT to Submit
        </h2>
        <ul className="space-y-2 text-stone-700">
          <li>
            <strong>Modern reproductions or fast fashion:</strong> We catalog
            vintage, not contemporary
          </li>
          <li>
            <strong>Counterfeit items:</strong> No fake vintage or bootlegs
          </li>
          <li>
            <strong>Obscured or damaged tags:</strong> If it's illegible, it
            can't be verified
          </li>
          <li>
            <strong>Copyrighted material:</strong> Don't upload entire catalog
            pages you don't own
          </li>
          <li>
            <strong>Duplicate submissions:</strong> Check if the tag already
            exists in the database
          </li>
          <li>
            <strong>Personal information:</strong> Crop out any handwritten
            names, addresses, etc.
          </li>
        </ul>
      </section>

      {/* Respect and Community */}
      <section className="mb-16 bg-gradient-to-r from-orange-600 to-orange-500 p-8 rounded-lg text-white">
        <h2 className="text-2xl font-bold mb-4">Respect and Community</h2>
        <p className="mb-4">
          ThreadDate is built on mutual respect and shared knowledge. We're all
          here to learn and contribute.
        </p>
        <ul className="space-y-2">
          <li>
            • <strong>Be kind:</strong> Disagree respectfully, correct politely
          </li>
          <li>
            • <strong>Assume good intent:</strong> Most mistakes are honest
            errors, not malicious
          </li>
          <li>
            • <strong>Share knowledge:</strong> Explain your reasoning in notes
          </li>
          <li>
            • <strong>Welcome newcomers:</strong> Everyone starts somewhere
          </li>
          <li>
            • <strong>No gatekeeping:</strong> This information belongs to
            everyone
          </li>
        </ul>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">
          Ready to Make Your First Contribution?
        </h2>
        <p className="text-stone-600">
          Follow these guidelines and help us build something amazing
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/how-it-works">
            <Button variant="outline" size="lg">
              Learn the Process
            </Button>
          </Link>
          <Link href="/submit">
            <Button size="lg">Submit an Identifier</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
