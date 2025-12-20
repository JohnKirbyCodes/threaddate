import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | ThreadDate",
  description: "Terms and conditions for using ThreadDate, the vintage clothing identifier database.",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Terms of Service</h1>
        <p className="text-stone-500">Last updated: December 2024</p>
      </div>

      <div className="prose prose-stone max-w-none">
        <p className="text-lg text-stone-700 mb-8">
          Welcome to ThreadDate. By accessing or using our service, you agree to be bound
          by these Terms of Service. Please read them carefully.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Acceptance of Terms</h2>
          <p className="text-stone-700">
            By creating an account, submitting content, or otherwise using ThreadDate,
            you agree to these Terms of Service and our{" "}
            <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>.
            If you do not agree, please do not use our service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">2. User Accounts</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li><strong>Age Requirement:</strong> You must be at least 13 years old to create an account</li>
            <li><strong>Account Security:</strong> You are responsible for maintaining the security of your account and password</li>
            <li><strong>One Account:</strong> Each person may only maintain one account</li>
            <li><strong>Accurate Information:</strong> You agree to provide accurate account information</li>
            <li><strong>Account Termination:</strong> We reserve the right to suspend or terminate accounts that violate these terms</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">3. User Content</h2>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Your Rights</h3>
          <p className="text-stone-700 mb-4">
            You retain ownership of the content you submit (images, metadata, notes).
            However, by submitting content to ThreadDate, you grant us a worldwide,
            non-exclusive, royalty-free license to display, reproduce, and distribute
            your content as part of the service.
          </p>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Content Guidelines</h3>
          <ul className="list-disc list-inside space-y-1 text-stone-700 mb-4">
            <li>Submissions must be relevant to vintage clothing identification</li>
            <li>Images should clearly show the identifier (tag, button, zipper, etc.)</li>
            <li>You must have the right to upload any images you submit</li>
            <li>Do not submit content that infringes on others' intellectual property</li>
          </ul>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Community Verification</h3>
          <p className="text-stone-700">
            Submitted content is subject to community voting and verification. Other users
            may upvote, downvote, or flag submissions. High-quality, accurate submissions
            earn reputation points.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Prohibited Conduct</h2>
          <p className="text-stone-700 mb-2">You agree not to:</p>
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            <li>Submit spam, duplicate, or intentionally inaccurate content</li>
            <li>Manipulate votes using multiple accounts or coordinated efforts</li>
            <li>Harass, threaten, or abuse other users</li>
            <li>Scrape, crawl, or use automated tools to access the service without permission</li>
            <li>Attempt to gain unauthorized access to accounts or systems</li>
            <li>Use the service for any illegal purpose</li>
            <li>Impersonate other users or entities</li>
            <li>Upload malware, viruses, or malicious content</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Intellectual Property</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li><strong>ThreadDate:</strong> The ThreadDate name, logo, website design, and code are our property</li>
            <li><strong>User Content:</strong> You retain rights to your submissions as described above</li>
            <li><strong>Brand Names & Logos:</strong> Brand names and logos referenced on ThreadDate belong to their respective owners. ThreadDate does not claim ownership of third-party trademarks</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Affiliate Links</h2>
          <p className="text-stone-700 mb-4">
            ThreadDate includes affiliate links to third-party marketplaces (eBay, Amazon,
            Poshmark, Depop). When you click these links and make a purchase, we may earn
            a commission.
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            <li>We do not guarantee pricing, availability, or authenticity of items on external sites</li>
            <li>Transactions on third-party sites are governed by their terms</li>
            <li>We are not responsible for disputes with third-party sellers</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">7. Disclaimers</h2>
          <div className="bg-stone-50 p-4 rounded-lg border border-stone-200">
            <p className="text-stone-700 mb-4">
              <strong>ThreadDate is a community-sourced reference tool.</strong> The dating
              information, era classifications, and authenticity indicators provided are
              contributed by community members and are not guaranteed to be accurate.
            </p>
            <ul className="list-disc list-inside space-y-1 text-stone-700">
              <li>Do not rely solely on ThreadDate for authentication or purchasing decisions</li>
              <li>Always verify important information through multiple sources</li>
              <li>We make no warranties about the completeness or accuracy of the database</li>
              <li>The service is provided "as is" without warranties of any kind</li>
            </ul>
          </div>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">8. Limitation of Liability</h2>
          <p className="text-stone-700">
            To the maximum extent permitted by law, ThreadDate and its operators shall not
            be liable for any indirect, incidental, special, consequential, or punitive
            damages arising from your use of the service, including but not limited to
            purchasing decisions based on information found on ThreadDate, loss of profits,
            or data loss.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">9. Indemnification</h2>
          <p className="text-stone-700">
            You agree to indemnify and hold harmless ThreadDate, its operators, and
            contributors from any claims, damages, or expenses arising from your use
            of the service, your content, or your violation of these terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">10. Changes to Terms</h2>
          <p className="text-stone-700">
            We may modify these terms at any time. We will provide notice of significant
            changes by posting on the site or via email. Your continued use of ThreadDate
            after changes take effect constitutes acceptance of the new terms.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">11. Governing Law</h2>
          <p className="text-stone-700">
            These terms shall be governed by and construed in accordance with applicable
            laws, without regard to conflict of law principles.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">12. Contact</h2>
          <p className="text-stone-700">
            For questions about these Terms of Service, contact us at:{" "}
            <a href="mailto:hello@threaddate.com" className="text-orange-600 hover:underline">
              hello@threaddate.com
            </a>
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <p className="text-stone-500">
            See also: <Link href="/privacy" className="text-orange-600 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
