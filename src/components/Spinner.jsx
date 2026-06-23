export default function Spinner({ isLoading, message = "Loading ArtHub..." }) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80">
      {/* The Animated Ring */}
      <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-200 border-t-rose-500" />
      {/* Text below spinner */}
      <p className="mt-3 text-sm font-medium text-slate-600">{message}</p>
    </div>
  );
}
