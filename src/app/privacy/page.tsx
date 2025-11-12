import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | WatchPicker",
  description: "Learn how WatchPicker collects, uses, and safeguards your data.",
  openGraph: {
    title: "Privacy Policy | WatchPicker",
    description: "Learn how WatchPicker collects, uses, and safeguards your data.",
    url: "https://watchpicker.vercel.app/privacy",
    siteName: "WatchPicker",
    type: "website",
  },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-semibold text-white">Privacy Policy</h1>
      <p>
        WatchPicker pulls movie data from TMDB and only stores the minimal runtime information
        needed to serve your requests. We never sell your information, and any analytics we gather
        are anonymized and used solely to improve the movie discovery experience.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Data We Collect</h2>
        <p>
          When you use WatchPicker we may log general usage stats such as filters applied, browser
          type, and approximate location for localization. No personally identifying information is
          required to use the app.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">How We Use Data</h2>
        <p>
          Information is used to enhance recommendations, troubleshoot issues, and safeguard against
          abuse. Third-party services like TMDB or AdSense may set cookies per their own policies.
        </p>
      </section>
    </main>
  );
}
