import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | ThreadDate",
  description: "How ThreadDate collects, uses, and protects your information.",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-stone-900 mb-2">Privacy Policy</h1>
        <p className="text-stone-500">Last updated: December 2024</p>
      </div>

      <div className="prose prose-stone max-w-none">
        <p className="text-lg text-stone-700 mb-8">
          ThreadDate ("we," "our," or "us") is committed to protecting your privacy.
          This policy explains how we collect, use, and safeguard your information when
          you use our vintage clothing identifier database.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">1. Information We Collect</h2>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Account Information</h3>
          <p className="text-stone-700 mb-4">
            When you create an account, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-700 mb-4">
            <li>Email address (for account access and notifications)</li>
            <li>Username (displayed publicly on your submissions)</li>
            <li>Avatar image (from OAuth provider or uploaded)</li>
          </ul>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">User-Generated Content</h3>
          <p className="text-stone-700 mb-4">
            When you contribute to ThreadDate, we collect:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-700 mb-4">
            <li>Tag/identifier images you upload</li>
            <li>Submission metadata (brand, era, category)</li>
            <li>Votes you cast on other submissions</li>
            <li>Any notes or comments you provide</li>
          </ul>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Usage Data</h3>
          <p className="text-stone-700 mb-4">
            We automatically collect:
          </p>
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            <li>Pages visited and features used (via Vercel Analytics)</li>
            <li>Device type and browser information</li>
            <li>General geographic location (country level)</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">2. How We Use Your Information</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li><strong>Provide the Service:</strong> Display your submissions, process votes, calculate reputation scores</li>
            <li><strong>Improve ThreadDate:</strong> Analyze usage patterns to enhance features</li>
            <li><strong>Communicate:</strong> Send important account notifications (password resets, security alerts)</li>
            <li><strong>Prevent Abuse:</strong> Detect spam, vote manipulation, and other violations</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">3. Information Sharing</h2>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Public Content</h3>
          <p className="text-stone-700 mb-4">
            Your submissions (images, metadata) and username are publicly visible. This is core
            to ThreadDate's community-driven model. Your email address is never publicly displayed.
          </p>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">Third-Party Services</h3>
          <p className="text-stone-700 mb-2">We use trusted third-party services:</p>
          <ul className="list-disc list-inside space-y-1 text-stone-700 mb-4">
            <li><strong>Supabase:</strong> Authentication, database, and image storage</li>
            <li><strong>Vercel:</strong> Website hosting and analytics</li>
            <li><strong>Google:</strong> OAuth authentication (if you sign in with Google)</li>
          </ul>

          <h3 className="text-xl font-semibold text-stone-800 mb-2">We Do Not</h3>
          <ul className="list-disc list-inside space-y-1 text-stone-700">
            <li>Sell your personal information to third parties</li>
            <li>Share your email address with marketers</li>
            <li>Use your data for targeted advertising</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">4. Affiliate Links Disclosure</h2>
          <p className="text-stone-700 mb-4">
            ThreadDate includes affiliate links to marketplaces including eBay, Amazon,
            Poshmark, and Depop. When you click these links and make a purchase, we may
            earn a small commission at no additional cost to you.
          </p>
          <p className="text-stone-700">
            These affiliate partnerships help support ThreadDate's operations. We only
            link to reputable marketplaces, and affiliate relationships do not influence
            our content or verification processes.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">5. Data Retention</h2>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li><strong>Account Data:</strong> Retained while your account is active</li>
            <li><strong>Submitted Content:</strong> Retained indefinitely as part of the community database (even after account deletion, unless specifically requested)</li>
            <li><strong>Usage Analytics:</strong> Aggregated and anonymized after 90 days</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">6. Your Rights</h2>
          <p className="text-stone-700 mb-4">You have the right to:</p>
          <ul className="list-disc list-inside space-y-2 text-stone-700">
            <li><strong>Access:</strong> Request a copy of your personal data</li>
            <li><strong>Correction:</strong> Update inaccurate information via your profile</li>
            <li><strong>Deletion:</strong> Request deletion of your account and associated data</li>
            <li><strong>Export:</strong> Download your submissions and data</li>
          </ul>
          <p className="text-stone-700 mt-4">
            To exercise these rights, contact us at the email below.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">7. Security</h2>
          <p className="text-stone-700">
            We implement industry-standard security measures including encrypted connections
            (HTTPS), secure authentication via Supabase, and access controls. However, no
            system is 100% secure. We encourage you to use a strong, unique password for
            your ThreadDate account.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">8. Children's Privacy</h2>
          <p className="text-stone-700">
            ThreadDate is not intended for users under 13 years of age. We do not knowingly
            collect information from children under 13. If you believe a child has provided
            us with personal information, please contact us.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">9. Changes to This Policy</h2>
          <p className="text-stone-700">
            We may update this privacy policy from time to time. We will notify you of
            significant changes by posting a notice on the site or sending an email.
            Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold text-stone-900 mb-4">10. Contact Us</h2>
          <p className="text-stone-700">
            For privacy-related questions or to exercise your data rights, contact us at:{" "}
            <a href="mailto:privacy@threaddate.com" className="text-orange-600 hover:underline">
              privacy@threaddate.com
            </a>
          </p>
        </section>

        <div className="mt-12 pt-6 border-t border-stone-200">
          <p className="text-stone-500">
            See also: <Link href="/terms" className="text-orange-600 hover:underline">Terms of Service</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
