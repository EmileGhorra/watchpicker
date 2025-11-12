import Link from "next/link";
import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "../styles/globals.css";

const sans = Inter({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const mono = JetBrains_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "WatchPicker",
  description: "Netflix-inspired random movie picker powered by TMDB.",
  icons: {
    icon: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4822244682021794"
          crossOrigin="anonymous"
        />
      </head>
      <body className={`${sans.variable} ${mono.variable} antialiased bg-cinematic text-gray-100`}>
        <div className="flex min-h-svh flex-col">
          <div className="flex-1">{children}</div>
          <footer className="border-t border-white/10 bg-black/40 px-6 py-6 text-sm text-gray-400 backdrop-blur-2xl">
            <div className="mx-auto flex w-full max-w-5xl flex-col gap-3 text-center sm:flex-row sm:items-center sm:justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-rose-200">
                WatchPicker
              </p>
              <nav className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-300">
                <Link href="/terms" className="hover:text-white">
                  Terms
                </Link>
                <span className="text-white/20">•</span>
                <Link href="/privacy" className="hover:text-white">
                  Privacy
                </Link>
                <span className="text-white/20">•</span>
                <Link href="/about" className="hover:text-white">
                  About
                </Link>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
