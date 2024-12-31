"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Sun, Cloud } from "lucide-react";

interface NavItem {
  category: {
    slug: string;
    title: string;
  };
  name?: string;
}

async function getNavigation(): Promise<NavItem[]> {
  try {
    const res = await fetch("https://a.jfeed.com/v1/lists/nav");
    if (!res.ok) throw new Error("Failed to fetch navigation");
    return res.json();
  } catch (error) {
    console.error("Error fetching navigation:", error);
    return [];
  }
}

export async function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const websiteBaseUrl = "https://www.jfeed.com";
  const nav = await getNavigation();

  const WeatherIcon = () => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <circle cx="12" cy="8" r="3" />
      <path d="M12 3v2" />
      <path d="M6.4 8H4.4" />
      <path d="M19.6 8h-2" />
      <path d="M7.5 4.2l1.4 1.4" />
      <path d="M16.5 4.2l-1.4 1.4" />
      <path d="M6 17.5a4 4 0 0 1 .5-8 5.5 5.5 0 0 1 10.5 2 3 3 0 0 1 0 6H6z" />
    </svg>
  );

  return (
    <>
      <header className="fixed top-0 left-0 w-full bg-slate-500 text-white z-10">
        {/* Desktop Header */}
        <div className="hidden md:block py-1">
          <div className="container mx-auto px-4 flex items-center">
            <Link
              href={websiteBaseUrl}
              className="block w-36 p-1 rounded hover:bg-white/10"
            >
              <Image
                src="/assets/images/logo/jfeed-new.png"
                alt="Jfeed Israel News Logo"
                width={140}
                height={50}
                className="w-full"
              />
            </Link>

            <nav className="flex items-center">
              {nav.map((item) => (
                <Link
                  key={item.category.slug}
                  href={`${websiteBaseUrl}/${item.category.slug}`}
                  className="px-4 py-1 mx-1 rounded uppercase hover:bg-white/10 transition-colors"
                >
                  {item.name || item.category.title}
                </Link>
              ))}
            </nav>

            <div className="ml-auto flex items-center gap-4">
              <Link
                href={`${websiteBaseUrl}/search`}
                className="p-1 rounded hover:bg-white/10 transition-colors flex items-center"
                aria-label="Go to search"
              >
                <Search size={18} />
              </Link>
              <Link
                href={`${websiteBaseUrl}/weather`}
                id="weather-widget"
                className="p-1 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
                aria-label="Check weather"
              >
                <WeatherIcon />
                <span id="weather-temp" className="text-sm font-medium"></span>
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden">
          <div className="container mx-auto px-4 flex justify-between items-center py-2">
            <button
              onClick={() => setIsMenuOpen(true)}
              className="p-3 -ml-3 hover:bg-white/10 rounded transition-colors"
              aria-label="Open menu"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="25"
                height="25"
                viewBox="0 0 25 25"
              >
                <title>Menu</title>
                <rect
                  y="7"
                  width="25"
                  height="3"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  y="14"
                  width="25"
                  height="3"
                  rx="1.5"
                  fill="currentColor"
                />
                <rect
                  y="21"
                  width="25"
                  height="3"
                  rx="1.5"
                  fill="currentColor"
                />
              </svg>
            </button>

            <Link
              href={websiteBaseUrl}
              className="absolute left-1/2 -ml-11 w-22 p-1"
            >
              <Image
                src="/assets/images/logo/jfeed-new.png"
                alt="Jfeed Israel News Logo"
                width={86}
                height={30}
                className="w-full"
              />
            </Link>

            <div className="flex items-center gap-2">
              <Link
                href="/weather"
                id="mobile-weather-widget"
                className="p-2 rounded hover:bg-white/10 transition-colors flex items-center gap-1"
                aria-label="Check weather"
              >
                <WeatherIcon />
                <span id="mobile-weather-temp" className="text-xs"></span>
              </Link>
              <Link
                href="/search"
                className="p-2 rounded hover:bg-white/10 transition-colors"
                aria-label="Go to search"
              >
                <Search size={20} />
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-50"
          onClick={() => setIsMenuOpen(false)}
        >
          <nav
            className="w-[300px] max-w-[80%] h-full bg-white flex overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <aside className="p-4 flex flex-col gap-2 border-r border-gray-200">
              <a
                href="https://twitter.com/JFeedEnglish"
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 3s-4 10 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://www.facebook.com/JFeedJewishNews"
                title="Facebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                <svg
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M22.675 0H1.325C.594 0 0 .594 0 1.325v21.35C0 23.406.594 24 1.325 24h11.49V14.7h-3.2V11h3.2V8.4c0-3.167 1.933-4.9 4.756-4.9 1.35 0 2.51.1 2.85.144V6.7h-1.95c-1.53 0-1.825.73-1.825 1.8V11h3.65l-.475 3.7h-3.175V24h6.225c.73 0 1.325-.594 1.325-1.325V1.325C24 .594 23.406 0 22.675 0z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://play.google.com/store/apps/details?id=com.jfeed.newsapp"
                title="Google Play"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 512 512"
                >
                  <path
                    d="M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <a
                href="https://apps.apple.com/il/app/jfeed-news/id6664070380"
                title="App Store"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:opacity-80"
              >
                <svg
                  className="w-6 h-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 384 512"
                >
                  <path
                    d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"
                    fill="currentColor"
                  />
                </svg>
              </a>
              <button className="subscribe-button" data-location="header">
                <span className="icon"></span>
              </button>
            </aside>

            <div className="flex-1 flex flex-col">
              {nav.map((item) => (
                <Link
                  key={item.category.slug}
                  href={`/${item.category.slug}`}
                  className="p-2 text-gray-900 hover:bg-gray-100 border-b border-gray-200 last:border-none text-lg"
                >
                  {item.name || item.category.title}
                </Link>
              ))}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
