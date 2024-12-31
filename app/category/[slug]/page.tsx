import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

interface Category {
  id: number;
  slug: string;
  parents: Array<{ id: number; slug: string; name: string }>;
  name: string;
  title: string;
  subTitle: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  metaKeywords: string | null;
  image: string | null;
}

interface Article {
  id: number;
  slug: string;
  author: string;
  categorySlug: string;
  image: {
    src: string;
    height: number;
    width: number;
    alt: string | null;
    credit: string | null;
  };
  title: string;
  subTitle: string;
  roofTitle: string;
  time: number;
}

async function fetchCategoryData(slug: string): Promise<Category> {
  const res = await fetch(`https://a.jfeed.com/v2/categories/${slug}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error("Failed to fetch category data");
  return res.json();
}

async function fetchCategoryArticles(
  categorySlug: string,
  page: number = 1,
  limit: number = 20
): Promise<Article[]> {
  const res = await fetch(
    `https://a.jfeed.com/v2/articles?categorySlug=${categorySlug}&limit=${limit}&page=${page}`,
    { next: { revalidate: 300 } }
  );
  if (!res.ok) throw new Error("Failed to fetch articles");
  return res.json();
}

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const category = await fetchCategoryData(params.slug);

  return {
    title: category.metaTitle || `${category.name} News and Updates | JFeed`,
    description:
      category.metaDescription ||
      `Stay updated with the latest news on ${category.name} at JFeed.`,
    openGraph: {
      title: category.metaTitle || `${category.name} News`,
      description:
        category.metaDescription ||
        `Latest updates and articles on ${category.name}`,
      images: category.image ? [{ url: category.image }] : [],
    },
  };
}

export default async function CategoryPage({
  params,
  searchParams,
}: {
  params: { slug: string };
  searchParams?: { [key: string]: string | string[] };
}) {
  const { slug } = params;
  const page = parseInt(searchParams?.page as string) || 1;

  const [category, articles] = await Promise.all([
    fetchCategoryData(slug),
    fetchCategoryArticles(slug, page),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Category Header */}
      <header className="mb-12">
        <h1 className="text-4xl font-bold">{category.title}</h1>
        {category.subTitle && (
          <p className="text-lg text-gray-600">{category.subTitle}</p>
        )}
        <p className="text-sm text-gray-500">{category.metaDescription}</p>
      </header>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {articles.map((article) => (
          <article key={article.id} className="flex flex-col">
            <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
              <Link href={`/article/${article.slug}`}>
                <Image
                  src={article.image.src}
                  alt={article.image.alt || article.title}
                  width={article.image.width}
                  height={article.image.height}
                  className="object-cover w-full h-full"
                />
              </Link>
              {article.image.credit && (
                <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 rounded">
                  {article.image.credit}
                </div>
              )}
            </div>
            <h2 className="text-xl font-semibold">{article.title}</h2>
            <p className="text-gray-600">{article.subTitle}</p>
            <div className="mt-auto text-sm text-gray-500">
              <span>{article.author}</span> •{" "}
              <time dateTime={new Date(article.time).toISOString()}>
                {new Date(article.time).toLocaleDateString()}
              </time>
            </div>
          </article>
        ))}
      </div>

      {/* Pagination */}
      <div className="mt-8 flex justify-center gap-4">
        {page > 1 && (
          <Link href={`/categories/${slug}?page=${page - 1}`} className="btn">
            Previous
          </Link>
        )}
        {articles.length === 20 && (
          <Link href={`/categories/${slug}?page=${page + 1}`} className="btn">
            Next
          </Link>
        )}
      </div>
    </div>
  );
}
