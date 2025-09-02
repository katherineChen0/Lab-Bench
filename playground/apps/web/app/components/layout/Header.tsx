import Link from 'next/link';
import { Home, Database, FlaskConical, Settings } from 'lucide-react';

export function Header() {
  return (
    <header className="border-b">
      <div className="container flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <FlaskConical className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">ML Playground</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            <Link
              href="/datasets"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Datasets
            </Link>
            <Link
              href="/experiments"
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Experiments
            </Link>
          </nav>
        </div>
        <div className="flex items-center gap-4">
          <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 w-10">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </button>
        </div>
      </div>
    </header>
  );
}
