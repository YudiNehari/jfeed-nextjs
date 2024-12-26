import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

// Types based on the API response
interface Author {
  name: string;
  url: string;
  image: string;
  twitter: string;
}

interface Category {
  id: number;
  slug: string;
  title: string;
  parents: string[];
  image: string | null;
  color: string;
  dfpScope: string;
  name: string;
}

interface Tag {
  id: number;
  slug: string;
  name: string;
}

interface ContentBlock {
  v: 2;
  type: string;
  content?: {
    type: string;
    children: Array<{
      text?: string;
      type?: string;
      url?: string;
      children?: Array<{ text: string }>;
    }>;
  }[];
  src?: string;
  credit?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface ArticleResponse {
  id: number;
  slug: string;
  author: Author;
  categories: Category[];
  tags: Tag[];
  title: string;
  titleShort: string | null;
  subTitle: string;
  subTitleShort: string | null;
  roofTitle: string;
  subRoofTitle: string;
  redirectUrl: string | null;
  content: {
    v: number;
    content: ContentBlock[];
  };
  image: {
    v: number;
    src: string;
    height: number;
    width: number;
    alt: string;
    credit: string;
    URI: string;
  };
  time: number;
  lastUpdate: number | null;
  comments: number;
  likes: number;
  dislikes: number;
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

// Render content block
function RenderContentBlock({ block }: { block: ContentBlock }) {
  switch (block.type) {
    case "img":
      return (
        <div className="relative aspect-[16/9] my-6">
          <Image
            src={block.src || ""}
            alt={block.alt || ""}
            fill
            className="object-cover rounded-lg"
          />
          {block.credit && (
            <div className="absolute bottom-2 right-2 text-sm text-white bg-black bg-opacity-50 px-2 py-1 rounded">
              {block.credit}
            </div>
          )}
        </div>
      );
    case "html":
      return (
        <div className="prose max-w-none">
          {block.content?.map((paragraph, idx) => {
            if (paragraph.type === "paragraph") {
              return (
                <p key={idx}>
                  {paragraph.children.map((child, childIdx) => {
                    if (child.type === "link") {
                      return (
                        <Link
                          key={childIdx}
                          href={child.url || ""}
                          className="text-blue-600 hover:underline"
                        >
                          {child.children?.[0]?.text || ""}
                        </Link>
                      );
                    }
                    return <span key={childIdx}>{child.text}</span>;
                  })}
                </p>
              );
            }
            return null;
          })}
        </div>
      );
    default:
      return null;
  }
}

// Generate metadata
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const resolvedParams = await params;
  const article = await getArticle(resolvedParams.slug);

  const metadata: Metadata = {
    title: article.title,
    description: article.subTitle,
    authors: [{ name: article.author.name }],
    openGraph: {
      title: article.title,
      description: article.subTitle,
      type: "article",
      publishedTime: new Date(article.time).toISOString(),
      authors: [article.author.name],
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

  return metadata;
}

// Article page component
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
          {article.categories.map((category) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="hover:underline mr-2"
            >
              {category.name.toUpperCase()}
            </Link>
          ))}
        </div>

        {article.roofTitle && (
          <div className="text-red-600 font-semibold mb-4">
            {article.roofTitle}
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          {article.title}
        </h1>

        <p className="text-xl text-gray-600 mb-6">{article.subTitle}</p>

        <div className="flex items-center gap-4 mb-4">
          <Image
            src={article.author.image}
            alt={article.author.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          <div>
            <Link
              href={article.author.url}
              className="text-gray-900 font-medium hover:underline"
            >
              {article.author.name}
            </Link>
            <div className="text-sm text-gray-500">
              <time dateTime={new Date(article.time).toISOString()}>
                {formatDate(article.time)}
              </time>
            </div>
          </div>
        </div>
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

      {/* Article Content */}
      <div className="mt-8">
        {article.content.content.map((block, index) => (
          <RenderContentBlock key={index} block={block} />
        ))}
      </div>

      {/* Tags */}
      <div className="mt-8 pt-8 border-t">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
            >
              {tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Article Stats */}
      <div className="mt-4 text-sm text-gray-500">
        <span>{article.comments} comments</span>
        <span className="mx-2">•</span>
        <span>{article.likes} likes</span>
      </div>
    </article>
  );
}
