import Link from "next/link";
import {
  Upload,
  Image as ImageIcon,
  Tag,
  Calendar,
  FileText,
  CheckCircle2,
  ArrowUp,
  ArrowDown,
  TrendingUp,
  Shield,
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HowItWorksPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-stone-900 mb-4">
          How ThreadDate Works
        </h1>
        <p className="text-xl text-stone-600">
          A step-by-step guide to contributing and using the database
        </p>
      </div>

      {/* The 3-Step Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-8 text-center">
          The Core Process
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Step 1 */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white font-bold text-2xl mb-4">
              1
            </div>
            <Upload className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Submit
            </h3>
            <p className="text-stone-600">
              Upload photos of vintage clothing tags, buttons, zippers, or other
              identifiers
            </p>
          </div>

          {/* Step 2 */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white font-bold text-2xl mb-4">
              2
            </div>
            <CheckCircle2 className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Verify
            </h3>
            <p className="text-stone-600">
              Community votes on accuracy using catalogs, copyright dates, and
              evidence
            </p>
          </div>

          {/* Step 3 */}
          <div className="text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-orange-600 text-white font-bold text-2xl mb-4">
              3
            </div>
            <TrendingUp className="h-12 w-12 text-orange-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Reference
            </h3>
            <p className="text-stone-600">
              Use the database to date your vintage finds and authenticate pieces
            </p>
          </div>
        </div>
      </div>

      {/* Detailed Submission Guide */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-8">
          Submitting an Identifier
        </h2>

        <div className="space-y-8">
          {/* Upload Step */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <ImageIcon className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                1. Upload Clear Photos
              </h3>
              <p className="text-stone-600 mb-3">
                Take high-resolution photos of your identifier. Make sure the
                text is readable and the image is well-lit. We'll crop it to a
                square aspect ratio.
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                <li>Use natural lighting or a bright lamp</li>
                <li>Avoid shadows and glare</li>
                <li>Get close enough to read small text</li>
                <li>Include the entire tag/identifier in frame</li>
              </ul>
            </div>
          </div>

          {/* Classification Step */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Tag className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                2. Classify the Identifier
              </h3>
              <p className="text-stone-600 mb-3">
                Tell us what brand it's from and what type of identifier it is.
              </p>
              <div className="grid grid-cols-2 gap-2 text-sm text-stone-600">
                <div className="bg-stone-50 p-2 rounded">Neck Tag</div>
                <div className="bg-stone-50 p-2 rounded">Care Tag</div>
                <div className="bg-stone-50 p-2 rounded">Button/Snap</div>
                <div className="bg-stone-50 p-2 rounded">Zipper</div>
                <div className="bg-stone-50 p-2 rounded">Tab</div>
                <div className="bg-stone-50 p-2 rounded">Stitching</div>
                <div className="bg-stone-50 p-2 rounded">Print/Graphic</div>
                <div className="bg-stone-50 p-2 rounded">Hardware</div>
              </div>
            </div>
          </div>

          {/* Details Step */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <Calendar className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                3. Add Dating Details
              </h3>
              <p className="text-stone-600 mb-3">
                Provide as much dating information as you know:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                <li>
                  <strong>Era:</strong> Broad decade (1970s, 1980s, etc.)
                </li>
                <li>
                  <strong>Year Range:</strong> Specific years if known (1985-1989)
                </li>
                <li>
                  <strong>Stitch Type:</strong> Single, double, chain stitch
                </li>
                <li>
                  <strong>Origin:</strong> Country of manufacture
                </li>
              </ul>
            </div>
          </div>

          {/* Evidence Step */}
          <div className="flex gap-6 items-start">
            <div className="flex-shrink-0">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 text-orange-600">
                <FileText className="h-6 w-6" />
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-semibold text-stone-900 mb-2">
                4. Provide Evidence (Optional but Recommended)
              </h3>
              <p className="text-stone-600 mb-3">
                Upload supporting evidence to strengthen your submission:
              </p>
              <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
                <li>
                  <strong>Copyright dates:</strong> Text on the tag itself
                </li>
                <li>
                  <strong>Care tags:</strong> Dating codes and RN numbers
                </li>
                <li>
                  <strong>Catalog scans:</strong> Historical brand catalogs
                </li>
                <li>
                  <strong>Comparison photos:</strong> Multiple examples of the
                  same tag
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Voting System */}
      <section className="mb-16">
        <h2 className="text-3xl font-bold text-stone-900 mb-8">
          The Verification System
        </h2>

        <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-8 rounded-lg border border-orange-200 mb-6">
          <h3 className="text-xl font-semibold text-stone-900 mb-4">
            How Voting Works
          </h3>
          <p className="text-stone-700 mb-4">
            Every submission starts as "Pending." Community members vote on
            accuracy:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowUp className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-stone-900">Upvote</span>
              </div>
              <p className="text-sm text-stone-600">
                "This dating looks accurate based on my knowledge or evidence"
              </p>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <ArrowDown className="h-5 w-5 text-red-600" />
                <span className="font-semibold text-stone-900">Downvote</span>
              </div>
              <p className="text-sm text-stone-600">
                "This dating appears incorrect or needs more evidence"
              </p>
            </div>
          </div>

          <div className="space-y-3 text-stone-700">
            <p>
              <strong>Verification Score:</strong> Net upvotes minus downvotes
            </p>
            <p>
              <strong>Verified Status:</strong> Granted when score reaches a
              threshold
            </p>
            <p>
              <strong>Rejected Status:</strong> Applied if score drops too low
            </p>
          </div>
        </div>

        <div className="flex gap-6 items-start">
          <div className="flex-shrink-0">
            <Shield className="h-12 w-12 text-orange-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-xl font-semibold text-stone-900 mb-2">
              Reputation System
            </h3>
            <p className="text-stone-600 mb-4">
              Earn reputation by contributing accurate identifiers and casting
              informed votes. Higher reputation = more credibility in the
              community.
            </p>
            <ul className="list-disc list-inside text-stone-600 space-y-1 ml-4">
              <li>Earn points when your submissions get verified</li>
              <li>Earn points when your votes align with the consensus</li>
              <li>Unlock moderator privileges at high reputation levels</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Best Practices */}
      <section className="mb-16 bg-stone-50 p-8 rounded-lg">
        <h2 className="text-2xl font-bold text-stone-900 mb-6">
          Best Practices
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-green-700 mb-2">✓ DO</h3>
            <ul className="space-y-1 text-stone-600">
              <li>• Upload clear, high-quality photos</li>
              <li>• Provide evidence when possible</li>
              <li>• Be honest about uncertainty</li>
              <li>• Vote based on evidence, not gut feeling</li>
              <li>• Add notes explaining your dating logic</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-red-700 mb-2">✗ DON'T</h3>
            <ul className="space-y-1 text-stone-600">
              <li>• Submit blurry or dark photos</li>
              <li>• Guess wildly on dates</li>
              <li>• Vote on things you don't know</li>
              <li>• Upload copyrighted catalog pages</li>
              <li>• Submit modern reproductions</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CTA */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">
          Ready to Get Started?
        </h2>
        <p className="text-stone-600">
          Join the community and start contributing today
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center mt-6">
          <Link href="/contribute">
            <Button variant="outline" size="lg">
              Contribution Guidelines
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
