import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[85vh] flex-col items-center justify-center bg-gray-50 dark:bg-gray-950 px-4 text-center transition-colors duration-300">
      {/* Mini-malist 404 Visual Indicator */}
      <div className="relative mb-6 flex h-40 w-40 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-900 text-6xl font-black text-blue-600 dark:text-blue-500 border border-gray-200 dark:border-gray-800">
        404
      </div>

      {/* Message */}
      <h1 className="text-3xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
        Page Not Found
      </h1>

      <p className="mt-4 text-base text-gray-500 dark:text-gray-400 max-w-md leading-relaxed">
        Oops! It looks like this masterpiece has been moved, deleted, or never
        existed in the ArtHub gallery.
      </p>

      {/* Go Home Button */}
      <div className="mt-8">
        <Link
          href="/"
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-medium text-white shadow-sm hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-500 transition-all"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
