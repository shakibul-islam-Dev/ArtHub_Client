// app/error.jsx
"use client";

export default function Error({ error, reset }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h2 className="text-2xl font-bold text-slate-900">
        Something went wrong.
      </h2>
      <button
        onClick={() => reset()}
        className="mt-6 rounded-md bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
      >
        Reload
      </button>
    </div>
  );
}
