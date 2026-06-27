import { Spinner } from "@/components/ui/spinner";

export default function SpinnerBasic() {
  return (
    <div className="flex min-h-[50vh] w-full flex-col items-center justify-center p-4 sm:p-8">
      <div className="flex flex-col items-center justify-center gap-6 rounded-2xl bg-card p-6 text-center shadow-sm max-w-sm w-full border border-border/50 animate-fade-in">
        {/* Spinner Section */}
        <div className="relative flex items-center justify-center">
          <Spinner className="h-10 w-10 text-primary" />
        </div>

        {/* Text Section */}
        <div className="space-y-1.5">
          <h3 className="text-xl font-semibold tracking-tight text-foreground/90">
            Art hub is loading...
          </h3>
          <p className="text-sm text-muted-foreground">
            Please wait while we curate your gallery
          </p>
        </div>
      </div>
    </div>
  );
}
