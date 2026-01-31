import Link from "next/link";
import { Button } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background-dark to-background-dark-end flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <div className="relative mb-8">
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-primary/20 rounded-full blur-3xl" />
          <span className="material-symbols-outlined text-[120px] text-primary/30 relative">
            wrong_location
          </span>
        </div>
        <h1 className="text-4xl font-black text-white mb-4">Page Not Found</h1>
        <p className="text-text-muted text-lg mb-8">
          Looks like you&apos;ve wandered off the lit path. Let&apos;s get you back on track.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/">
            <Button size="lg">Go Home</Button>
          </Link>
          <Link href="/app">
            <Button variant="secondary" size="lg">
              Open App
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
