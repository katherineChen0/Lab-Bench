import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { datasetsApi, Dataset, DatasetListResponse } from '@/lib/api/datasets';

export function useDatasets<T = DatasetListResponse>(page: number = 1, pageSize: number = 10) {
  return useQuery<T, Error>({
    queryKey: ['datasets', { page, pageSize }],
    queryFn: () => datasetsApi.getDatasets(page, pageSize) as Promise<T>,
    keepPreviousData: true,
  });
}

export function useDataset(id: string) {
  return useQuery<Dataset, Error>({
    queryKey: ['datasets', id],
    queryFn: () => datasetsApi.getDataset(id),
    enabled: !!id,
  });
}

export function useCreateDataset() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: async (payload: { file: File; name?: string }) => {
      return datasetsApi.uploadDataset(payload.file, payload.name);
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset uploaded successfully');
      router.push(`/datasets/${data.id}`);
    },
    onError: (error: Error) => {
      console.error('Error uploading dataset:', error);
      toast.error('Failed to upload dataset', {
        description: error.message,
      });
    },
  });
}

export function useDeleteDataset() {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: (id: string) => datasetsApi.deleteDataset(id),
    onSuccess: (_, id) => {
      queryClient.invalidateQueries({ queryKey: ['datasets'] });
      toast.success('Dataset deleted successfully');
      
      // If we're on the dataset's page, redirect to datasets list
      if (window.location.pathname.includes(`/datasets/${id}`)) {
        router.push('/datasets');
      }
    },
    onError: (error: Error) => {
      console.error('Error deleting dataset:', error);
      toast.error('Failed to delete dataset', {
        description: error.message,
      });
    },
  });
}

export function useDatasetPreview(id: string, limit: number = 10) {
  return useQuery({
    queryKey: ['datasets', id, 'preview', limit],
    queryFn: () => datasetsApi.getDatasetPreview(id, limit),
    enabled: !!id,
  });
}

export function useDatasetStats(id: string) {
  return useQuery({
    queryKey: ['datasets', id, 'stats'],
    queryFn: () => datasetsApi.getDatasetStats(id),
    enabled: !!id,
  });
}
