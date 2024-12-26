import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Types based on the API response
interface Image {
  v: number;
  src: string;
  height: number;
  width: number;
  alt: string;
  credit: string;
  preview: string | null;
}

interface ArticleResponse {
  id: number;
  slug: string;
  author: string;
  categoryId: number;
  categorySlug: string;
  image: Image;
  title: string;
  titleShort: string | null;
  subTitle: string;
  roofTitle: string;
  redirectUrl: string | null;
  time: number;
  lastUpdate: number | null;
  props: string[];
}

// Fetch article data
async function getArticle(slug: string): Promise<ArticleResponse> {
  const res = await fetch(`https://a.jfeed.com/v2/articles/${slug}`, {
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }

  return res.json();
}

// Format date
function formatDate(timestamp: number): string {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  return {
    title: article.title,
    description: article.subTitle,
    authors: [{ name: article.author }],
    openGraph: {
      title: article.title,
      description: article.subTitle,
      type: "article",
      publishedTime: new Date(article.time).toISOString(),
      authors: [article.author],
      images: [
        {
          url: article.image.src,
          width: article.image.width,
          height: article.image.height,
          alt: article.image.alt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: article.title,
      description: article.subTitle,
      images: [article.image.src],
    },
  };
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="text-red-600 text-sm font-medium mb-4">
          <Link
            href={`/category/${article.categorySlug}`}
            className="hover:underline"
          >
            {article.categorySlug.replace("-", " ").toUpperCase()}
          </Link>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>
        {article.roofTitle && (
          <div className="text-red-600 font-semibold mb-4">
            {article.roofTitle}
          </div>
        )}
        <p className="text-xl text-gray-600 mb-6">{article.subTitle}</p>
        <div className="text-sm text-gray-500">{article.author}</div>
        <time
          className="text-sm text-gray-500"
          dateTime={new Date(article.time).toISOString()}
        >
          {formatDate(article.time)}
        </time>
      </header>

      {/* Featured Image */}
      <div className="relative aspect-[16/9] mb-8">
        <Image
          src={article.image.src}
          alt={article.image.alt}
          fill
          className="object-cover rounded-lg"
          priority
        />
        {article.image.credit && (
          <div className="absolute bottom-2 right-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
            {article.image.credit}
          </div>
        )}
      </div>

      {/* Tags */}
      <div className="mt-8 pt-8 border-t">
        <div className="text-sm text-gray-500">{article.author}</div>
      </div>
    </article>
  );
}
