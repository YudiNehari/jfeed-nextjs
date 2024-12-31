import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Search Results - JFeed Israel News",
  description: "Search results from JFeed - Israel News",
  robots: "noindex,follow",
  openGraph: {
    title: "Search Results - JFeed Israel News",
    description: "Search results from JFeed - Israel News",
  },
  alternates: {
    canonical: "https://www.jfeed.com/search",
  },
};

export default function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q || "";

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <header className="mb-8">
        <nav className="text-sm text-gray-500">
          <Link href="/">Home</Link> &gt; <span>Search</span>
        </nav>
        <h1 className="text-4xl font-bold mt-2">
          Search Results
          {query && <span> for "{query}"</span>}
        </h1>
        <hr className="mt-4 border-gray-200" />
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <form
            action="/search"
            method="get"
            className="mb-8 flex"
            role="search"
          >
            <input
              type="search"
              name="q"
              className="flex-1 p-2 border border-gray-300 rounded-l-md"
              placeholder="Search articles..."
              defaultValue={query}
              aria-label="Search articles"
              required
            />
            <button
              type="submit"
              className="p-2 bg-blue-600 text-white rounded-r-md"
              aria-label="Submit search"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
              >
                <circle cx="11" cy="11" r="8"></circle>
                <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
              </svg>
            </button>
          </form>
          <div className="search-results">
            <script
              async
              src="https://cse.google.com/cse.js?cx=01a440783ba554677"
            ></script>
            <div className="gcse-searchresults-only"></div>
          </div>
        </div>

        {/* Sidebar */}
        <aside>
          <div className="space-y-6">
            <section>
              <h2 className="text-lg font-semibold">Frontal</h2>
              {/* Include frontal aside content */}
              <p>Frontal Content Placeholder</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Most Read</h2>
              {/* Include most read aside content */}
              <p>Most Read Placeholder</p>
            </section>
            <section>
              <h2 className="text-lg font-semibold">Most Commented</h2>
              {/* Include most commented aside content */}
              <p>Most Commented Placeholder</p>
            </section>
          </div>
        </aside>
      </main>
    </div>
  );
}
