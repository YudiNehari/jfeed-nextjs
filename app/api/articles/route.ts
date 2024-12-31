import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const res = await fetch("https://a.jfeed.com/v2/articles");
    if (!res.ok) {
      console.error("Error fetching articles:", res.status, res.statusText);
      return NextResponse.json(
        { error: `Failed to fetch articles: ${res.statusText}` },
        { status: res.status }
      );
    }

    const articles = await res.json();
    return NextResponse.json(articles);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch articles. Please try again later." },
      { status: 500 }
    );
  }
}
