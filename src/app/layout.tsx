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
      <body
        className={`${sans.variable} ${mono.variable} antialiased bg-cinematic text-gray-100`}
      >
        {children}
      </body>
    </html>
  );
}
