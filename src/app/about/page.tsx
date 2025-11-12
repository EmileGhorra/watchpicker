import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About WatchPicker | WatchPicker",
  description: "Discover why WatchPicker exists and how we curate cinematic recommendations.",
  openGraph: {
    title: "About WatchPicker | WatchPicker",
    description: "Discover why WatchPicker exists and how we curate cinematic recommendations.",
    url: "https://watchpicker.vercel.app/about",
    siteName: "WatchPicker",
    type: "website",
  },
};

export default function AboutPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-semibold text-white">About WatchPicker</h1>
      <p>
        WatchPicker is a passion project inspired by countless “what should we watch?” nights.
        We streamlined the process with TMDB filters, a rich cinematic design, and easy sharing so
        movie nights feel effortless and stylish.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Our Approach</h2>
        <p>
          Instead of overwhelming lists, WatchPicker delivers a single, high-quality suggestion
          based on filters like runtime, genres, region, and release year. We focus on popularity
          paired with a minimum vote threshold to keep picks relevant.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Tech Stack</h2>
        <p>
          Built with Next.js 14, TailwindCSS, and shadcn/ui, WatchPicker embraces modern web
          standards for speed and aesthetic consistency. TMDB provides the backbone of our data.
        </p>
      </section>
    </main>
  );
}
