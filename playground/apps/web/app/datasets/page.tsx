import Link from 'next/link';
import { Upload, Plus, FileText, Database } from 'lucide-react';

export default function DatasetsPage() {
  // TODO: Fetch datasets from API
  const datasets = [];

  return (
    <div className="container py-8">
      <div className="flex flex-col space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Datasets</h1>
            <p className="text-muted-foreground">
              Manage your datasets and create new ones
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              href="/datasets/upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Dataset
            </Link>
          </div>
        </div>

        {datasets.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed p-12 text-center">
            <Database className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium">No datasets yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Get started by uploading a new dataset
            </p>
            <Link
              href="/datasets/upload"
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Dataset
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {datasets.map((dataset) => (
              <div
                key={dataset.id}
                className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="rounded-md bg-primary/10 p-2">
                        <FileText className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-medium">{dataset.name}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dataset.rows} rows • {dataset.columns} columns
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>Uploaded {dataset.uploadedAt}</span>
                    <span>{dataset.size}</span>
                  </div>
                </div>
                <div className="bg-muted/50 px-6 py-3 flex justify-end space-x-2 border-t">
                  <Link
                    href={`/datasets/${dataset.id}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
