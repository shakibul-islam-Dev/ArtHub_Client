import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      {/* ArtHub Styled 404 Illustration */}
      <div className="relative mb-6 flex h-48 w-48 items-center justify-center rounded-full bg-rose-50 text-8xl font-black text-rose-500 shadow-inner">
        404
        <div className="absolute -bottom-2 -right-2 h-12 w-12 rounded-full bg-amber-400 opacity-80 blur-xl animate-pulse" />
        <div className="absolute -top-4 -left-4 h-16 w-16 rounded-full bg-blue-400 opacity-60 blur-2xl animate-pulse" />
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
        Page Not Found
      </h1>
      <p className="mt-4 text-base text-slate-600 max-w-md">
        Oops! It looks like this masterpiece has been moved, deleted, or never
        existed in the ArtHub gallery.
      </p>

      {/* Go Home Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-lg bg-rose-500 px-6 py-3 font-semibold text-white shadow-md transition hover:bg-rose-600 focus:outline-none focus:ring-2 focus:ring-rose-400"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
