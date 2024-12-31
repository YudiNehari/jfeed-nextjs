import type { Metadata } from "next";
import { ArticleCard } from "@/components/ui/ArticleCard";
import type { Article } from "@/types/article";

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

async function getArticles(): Promise<Article[]> {
  const res = await fetch(`https://a.jfeed.com/v2/articles`);
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export default async function Home() {
  const articles = await getArticles();

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {articles.length > 0 && <ArticleCard article={articles[0]} featured />}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.length > 0 &&
          articles
            .slice(1)
            .map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
      </div>
    </main>
  );
}
