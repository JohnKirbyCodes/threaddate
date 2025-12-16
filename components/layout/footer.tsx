import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* About */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-900">About</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/about" className="hover:text-orange-600">
                  What is ThreadDate?
                </Link>
              </li>
              <li>
                <Link href="/how-it-works" className="hover:text-orange-600">
                  How it Works
                </Link>
              </li>
              <li>
                <Link href="/contribute" className="hover:text-orange-600">
                  Contribute
                </Link>
              </li>
            </ul>
          </div>

          {/* Browse */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-900">Browse</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/brands" className="hover:text-orange-600">
                  All Brands
                </Link>
              </li>
              <li>
                <Link href="/search?category=Neck+Tag" className="hover:text-orange-600">
                  Neck Tags
                </Link>
              </li>
              <li>
                <Link href="/search?category=Care+Tag" className="hover:text-orange-600">
                  Care Tags
                </Link>
              </li>
              <li>
                <Link href="/search?category=Button" className="hover:text-orange-600">
                  Buttons & Hardware
                </Link>
              </li>
            </ul>
          </div>

          {/* Community */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-900">
              Community
            </h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/guidelines" className="hover:text-orange-600">
                  Guidelines
                </Link>
              </li>
              <li>
                <Link href="/leaderboard" className="hover:text-orange-600">
                  Leaderboard
                </Link>
              </li>
              <li>
                <Link href="/discord" className="hover:text-orange-600">
                  Discord
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="mb-3 text-sm font-semibold text-stone-900">Legal</h3>
            <ul className="space-y-2 text-sm text-stone-600">
              <li>
                <Link href="/privacy" className="hover:text-orange-600">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className="hover:text-orange-600">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t border-stone-200 pt-6 text-center text-sm text-stone-500">
          <p>
            &copy; {new Date().getFullYear()} ThreadDate. Built by vintage
            enthusiasts, for vintage enthusiasts.
          </p>
        </div>
      </div>
    </footer>
  );
}
