'use client';

import Link from 'next/link';
import { Upload, FileText, Database, Loader2 } from 'lucide-react';
import { useDatasets } from '@/hooks/api/use-datasets';
import { formatDistanceToNow } from 'date-fns';
import { formatFileSize } from '@/lib/utils';

interface Dataset {
  id: string;
  name: string;
  file_name: string;
  file_size: number;
  file_type: string;
  num_rows: number;
  columns: string[];
  created_at: string;
  updated_at: string;
}

interface DatasetListResponse {
  items: Dataset[];
  total: number;
  page: number;
  page_size: number;
}

export default function DatasetsPage() {
  const { data, isLoading, error } = useDatasets<DatasetListResponse>(1, 10);
  const datasets = data?.items || [];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-destructive/10 p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <Database className="h-5 w-5 text-destructive" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-destructive">
              Failed to load datasets
            </h3>
            <div className="mt-2 text-sm text-destructive">
              <p>{error.message}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            {datasets.map((dataset: Dataset) => (
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
                        <h3 className="font-medium">{dataset.name || 'Untitled Dataset'}</h3>
                        <p className="text-sm text-muted-foreground">
                          {dataset.num_rows} rows • {dataset.columns?.length || 0} columns
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between text-xs text-muted-foreground">
                    <span>
                      {formatDistanceToNow(new Date(dataset.created_at), { addSuffix: true })}
                    </span>
                    <span>{formatFileSize(dataset.file_size)}</span>
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
