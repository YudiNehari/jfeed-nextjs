// app/article/[slug]/page.tsx
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
  content?: any[];
  src?: string;
  credit?: string;
  alt?: string;
  width?: number;
  height?: number;
}

interface Article {
  id: number;
  author: Author;
  title: string;
  slug: string;
  titleShort: string | null;
  subTitle: string;
  subTitleShort: string | null;
  roofTitle: string;
  subRoofTitle: string;
  categories: Category[];
  tags: Tag[];
  content: {
    v: 2;
    content: ContentBlock[];
  };
  image: {
    src: string;
    height: number;
    width: number;
    alt: string;
    credit: string;
  };
  time: number;
  comments: number;
  likes: number;
  dislikes: number;
}

// Fetch article data
async function getArticle(slug: string) {
  const res = await fetch(`https://a.jfeed.com/v2/articles/${slug}`, {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  });

  if (!res.ok) {
    throw new Error("Failed to fetch article");
  }

  return res.json();
}

// Generate metadata for the page
export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}): Promise<Metadata> {
  const article = await getArticle(params.slug);

  return {
    title: article.title,
    description: article.subTitle,
    authors: [{ name: article.author.name, url: article.author.twitter }],
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
      creator: article.author.twitter?.replace("https://x.com/", "@"),
    },
  };
}

// Format date
function formatDate(timestamp: number) {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

// Render HTML content
function RenderContent({ content }: { content: any[] }) {
  return content.map((block, index) => {
    switch (block.type) {
      case "paragraph":
        return (
          <p key={index} className="mb-6 text-lg leading-relaxed">
            {block.children.map((child: any, childIndex: number) => {
              if (child.type === "link") {
                return (
                  <Link
                    key={childIndex}
                    href={child.url}
                    className="text-blue-600 hover:underline"
                  >
                    {child.children[0].text}
                  </Link>
                );
              }
              return child.text;
            })}
          </p>
        );
      default:
        return null;
    }
  });
}

export default async function ArticlePage({
  params,
}: {
  params: { slug: string };
}) {
  const article = await getArticle(params.slug);

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Article Header */}
      <header className="mb-8">
        <div className="flex items-center gap-2 text-red-600 text-sm font-medium mb-4">
          {article.categories.map((category: any) => (
            <Link
              key={category.id}
              href={`/category/${category.slug}`}
              className="hover:underline"
            >
              {category.name}
            </Link>
          ))}
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

        <div className="flex items-center gap-4 mb-6">
          <Link href={article.author.url} className="flex items-center gap-3">
            <Image
              src={article.author.image}
              alt={article.author.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <div className="font-medium text-gray-900">
                {article.author.name}
              </div>
              <time
                className="text-sm text-gray-500"
                dateTime={new Date(article.time).toISOString()}
              >
                {formatDate(article.time)}
              </time>
            </div>
          </Link>
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
      <div className="prose prose-lg max-w-none">
        {article.content.content.map((block: ContentBlock, index: number) => {
          if (block.type === "img") {
            return (
              <figure key={index} className="my-8">
                <Image
                  src={block.src!}
                  alt={block.alt || ""}
                  width={block.width}
                  height={block.height}
                  className="rounded-lg"
                />
                {block.credit && (
                  <figcaption className="text-sm text-gray-500 mt-2">
                    {block.credit}
                  </figcaption>
                )}
              </figure>
            );
          }
          if (block.type === "html") {
            return (
              <div key={index}>
                <RenderContent content={block.content || []} />
              </div>
            );
          }
          return null;
        })}
      </div>

      {/* Tags */}
      <div className="mt-8 pt-8 border-t">
        <div className="flex flex-wrap gap-2">
          {article.tags.map((tag: any) => (
            <Link
              key={tag.id}
              href={`/tags/${tag.slug}`}
              className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full text-sm text-gray-700"
            >
              #{tag.name}
            </Link>
          ))}
        </div>
      </div>

      {/* Social Stats */}
      <div className="mt-8 flex items-center gap-6 text-sm text-gray-500">
        <div>{article.comments} Comments</div>
        <div>{article.likes} Likes</div>
        <div>{article.dislikes} Dislikes</div>
      </div>
    </article>
  );
}
