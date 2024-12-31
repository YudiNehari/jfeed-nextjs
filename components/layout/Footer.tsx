import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  const websiteBaseUrl = process.env.NEXT_PUBLIC_WEBSITE_URL || "";
  const currentYear = new Date().getFullYear();
  return (
    <footer className="w-full bg-slate-600">
      <div className="bg-primary text-white">
        <div className="container mx-auto px-4 py-8">
          {/* Footer Text and Social Links */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <p className="mb-2 md:mb-0">
                <strong className="font-bold">JFeed</strong>
                <Link
                  href={websiteBaseUrl}
                  className="ml-2 hover:text-gray-200 transition-colors"
                >
                  News and updates portal
                </Link>
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <a
                href="https://twitter.com/JFeedEnglish"
                title="Twitter"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-80 transition-opacity"
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
                className="hover:opacity-80 transition-opacity"
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
            </div>
          </div>

          <hr className="border-gray-600 my-6" />

          {/* Footer Links and Logo */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            <Link href={websiteBaseUrl} className="mb-4 md:mb-0">
              <Image
                src="https://www.jfeed.com/assets/images/logo/jfeed.png"
                alt="Jfeed Israel News Logo"
                title="Jfeed Israel News"
                width={150}
                height={50}
                className="h-12 w-auto"
              />
            </Link>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link
                href={`${websiteBaseUrl}/news`}
                className="hover:text-gray-200"
              >
                JFeed News
              </Link>
              <span className="text-gray-400">|</span>
              <a href="mailto:desk@jfeed.com" className="hover:text-gray-200">
                Contact Us
              </a>
              <span className="text-gray-400">|</span>
              <Link
                href={`${websiteBaseUrl}/general/privacy-policy`}
                className="hover:text-gray-200"
              >
                Privacy Policy
              </Link>
              <span className="text-gray-400">|</span>
              <Link
                href={`${websiteBaseUrl}/general/terms-of-use`}
                className="hover:text-gray-200"
              >
                Terms of Service
              </Link>
              <Link
                href={`${websiteBaseUrl}/weather`}
                className="hover:text-gray-200"
              >
                Weather
              </Link>
              <Link
                href={`${websiteBaseUrl}/halachic-times`}
                className="hover:text-gray-200"
              >
                Halachic Times
              </Link>
              <Link
                href={`${websiteBaseUrl}/shabbat-times`}
                className="hover:text-gray-200"
              >
                Shabbat Times
              </Link>
              <span className="text-gray-400">
                © All rights reserved JFeed 2009-{currentYear}
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
