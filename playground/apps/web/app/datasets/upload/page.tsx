'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Upload, FileText, X, Loader2 } from 'lucide-react';

export default function UploadDatasetPage() {
  const router = useRouter();
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      setFile(selectedFile);
      setError(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select a file to upload');
      return;
    }

    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      // TODO: Replace with actual API endpoint
      const response = await fetch('/api/datasets', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to upload dataset');
      }

      const data = await response.json();
      router.push(`/datasets/${data.id}`);
    } catch (err) {
      console.error('Error uploading dataset:', err);
      setError('Failed to upload dataset. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container py-8">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">Upload Dataset</h1>
          <p className="text-muted-foreground">
            Upload a CSV, JSON, JSONL, or Parquet file to get started
          </p>
        </div>

        <div className="rounded-lg border bg-card text-card-foreground shadow-sm p-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md">
                  <div className="space-y-1 text-center">
                    {file ? (
                      <div className="flex flex-col items-center">
                        <FileText className="h-12 w-12 text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">{file.name}</p>
                        <button
                          type="button"
                          onClick={() => setFile(null)}
                          className="mt-2 text-sm text-red-600 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex justify-center">
                          <Upload className="h-12 w-12 text-muted-foreground" />
                        </div>
                        <div className="flex text-sm text-muted-foreground">
                          <label
                            htmlFor="file-upload"
                            className="relative cursor-pointer rounded-md font-medium text-primary hover:text-primary/90 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-primary"
                          >
                            <span>Upload a file</span>
                            <input
                              id="file-upload"
                              name="file-upload"
                              type="file"
                              className="sr-only"
                              accept=".csv,.json,.jsonl,.parquet"
                              onChange={handleFileChange}
                            />
                          </label>
                          <p className="pl-1">or drag and drop</p>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          CSV, JSON, JSONL, or Parquet up to 100MB
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                {error && (
                  <p className="mt-2 text-sm text-red-600">{error}</p>
                )}
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => router.back()}
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
                  disabled={isUploading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2"
                  disabled={!file || isUploading}
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    'Upload Dataset'
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
