import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service | WatchPicker",
  description: "Understand the rules for using the WatchPicker movie discovery platform.",
  openGraph: {
    title: "Terms of Service | WatchPicker",
    description: "Understand the rules for using the WatchPicker movie discovery platform.",
    url: "https://watchpicker.vercel.app/terms",
    siteName: "WatchPicker",
    type: "website",
  },
};

export default function TermsPage() {
  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-6 py-16 text-gray-100">
      <h1 className="text-3xl font-semibold text-white">Terms of Service</h1>
      <p>
        By using WatchPicker you agree to follow these terms. WatchPicker is provided “as is” and we
        reserve the right to update or remove features at any time without notice.
      </p>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Acceptable Use</h2>
        <p>
          Do not abuse the TMDB API, attempt to reverse engineer the app, or resell its data. Use
          WatchPicker strictly for personal entertainment discovery.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Disclaimer</h2>
        <p>
          We do our best to present accurate titles but can’t guarantee availability, playback
          quality, or completeness of third-party information. WatchPicker is not responsible for
          external links or services.
        </p>
      </section>
      <section className="space-y-3">
        <h2 className="text-xl font-semibold text-white">Contact</h2>
        <p>
          Need clarification? Email <a className="text-rose-300 underline" href="mailto:legal@watchpicker.app">legal@watchpicker.app</a>.
        </p>
      </section>
    </main>
  );
}
