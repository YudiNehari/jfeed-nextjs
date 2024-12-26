// app/page.tsx
import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";

// Define types based on the API response
interface Article {
  id: number;
  slug: string;
  author: string;
  categoryId: number;
  categorySlug: string;
  image: {
    v: number;
    src: string;
    height: number;
    width: number;
    alt: string;
    credit: string;
    preview: string | null;
  };
  title: string;
  titleShort: string | null;
  subTitle: string;
  roofTitle: string;
  time: number;
  props: string[];
}

// Fetch articles from the API
async function getArticles() {
  const res = await fetch("https://a.jfeed.com/v2/articles", {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch articles");
  }

  return res.json();
}

// Metadata for SEO
export const metadata: Metadata = {
  title: "JFeed - Latest Jewish News & Updates",
  description:
    "Stay informed with the latest Jewish news, Israel updates, and worldwide coverage of events affecting the Jewish community.",
  openGraph: {
    title: "JFeed - Latest Jewish News & Updates",
    description:
      "Stay informed with the latest Jewish news, Israel updates, and worldwide coverage of events affecting the Jewish community.",
    images: [
      {
        url: "https://your-domain.com/og-home.jpg",
        width: 1200,
        height: 630,
        alt: "JFeed News Homepage",
      },
    ],
  },
};

// Format timestamp to readable date
function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Featured Article */}
      {articles.length > 0 && (
        <div className="mb-12">
          <Link href={`/article/${articles[0].slug}`} className="group">
            <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
              <Image
                src={articles[0].image.src}
                alt={articles[0].image.alt || articles[0].title}
                width={articles[0].image.width}
                height={articles[0].image.height}
                className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                priority
              />
              {articles[0].props.includes("video") && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-black bg-opacity-50 rounded-full p-4">
                    <svg
                      className="w-12 h-12 text-white"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </div>
            <div className="mt-4">
              <span className="text-red-600 font-semibold text-sm">
                {articles[0].roofTitle}
              </span>
              <h1 className="mt-2 text-3xl font-bold text-gray-900 group-hover:text-blue-600">
                {articles[0].title}
              </h1>
              <p className="mt-3 text-xl text-gray-500">
                {articles[0].subTitle}
              </p>
              <div className="mt-4 flex items-center text-sm text-gray-500">
                <span>{articles[0].author}</span>
                <span className="mx-2">•</span>
                <time dateTime={new Date(articles[0].time).toISOString()}>
                  {formatDate(articles[0].time)}
                </time>
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.slice(1).map((article: Article) => (
          <article key={article.id} className="flex flex-col">
            <Link href={`/article/${article.slug}`} className="group">
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-lg">
                <Image
                  src={article.image.src}
                  alt={article.image.alt || article.title}
                  width={article.image.width}
                  height={article.image.height}
                  className="object-cover w-full h-full transform group-hover:scale-105 transition-transform duration-200"
                />
                {article.props.includes("video") && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-black bg-opacity-50 rounded-full p-3">
                      <svg
                        className="w-8 h-8 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <span className="text-red-600 font-semibold text-sm">
                  {article.roofTitle}
                </span>
                <h2 className="mt-2 text-xl font-semibold text-gray-900 group-hover:text-blue-600">
                  {article.title}
                </h2>
                <p className="mt-2 text-gray-500 line-clamp-2">
                  {article.subTitle}
                </p>
                <div className="mt-4 flex items-center text-sm text-gray-500">
                  <span>{article.author}</span>
                  <span className="mx-2">•</span>
                  <time dateTime={new Date(article.time).toISOString()}>
                    {formatDate(article.time)}
                  </time>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </main>
  );
}
