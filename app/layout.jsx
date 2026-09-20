import { Inter } from "next/font/google";
import "../styles/globals.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CookieBanner from "../components/CookieBanner";

/**
 * Root layout
 * ------------------------------------------------------------
 * Loads Inter through next/font (self-hosted, no layout shift,
 * no render-blocking Google Fonts request), exposes it as the
 * --font-inter variable that tailwind.config.js reads, and wraps
 * every page in the shared Navbar / Footer chrome.
 *
 * Assignment 1: the document skeleton — <html lang>, a skip link,
 * and <main> as the single primary landmark.
 */

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata = {
  title: {
    default: "CardWise — Find the credit card that fits how you spend",
    template: "%s — CardWise",
  },
  description:
    "CardWise ranks ten Indian credit cards against your actual spending using a transparent, rule-based scoring system. Educational demo, no affiliate links.",
  openGraph: {
    title: "CardWise — Find the credit card that fits how you spend",
    description:
      "Answer five questions and see which credit card matches your spending, with every score explained.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="font-sans antialiased">
        {/* Keyboard users can jump straight past the nav. */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-btn focus:bg-accent focus:px-4 focus:py-2 focus:text-accent-foreground"
        >
          Skip to content
        </a>

        <Navbar />
        <main id="main">{children}</main>
        <Footer />
        <CookieBanner />
      </body>
    </html>
  );
}
