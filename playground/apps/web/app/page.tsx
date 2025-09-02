import Link from 'next/link';

export default function Home() {
  return (
    <main className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
          Welcome to ML Playground
        </h1>
        <p className="text-lg text-muted-foreground mb-8">
          A local-first platform for running ML experiments with zero boilerplate.
          Get started by uploading a dataset or exploring existing experiments.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/datasets"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
          >
            View Datasets
          </Link>
          <Link
            href="/experiments"
            className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          >
            View Experiments
          </Link>
        </div>
      </div>
    </main>
  );
}