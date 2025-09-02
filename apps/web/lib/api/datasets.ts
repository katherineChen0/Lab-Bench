import { apiRequest, apiUpload } from './client';

export interface Dataset {
  id: string;
  name: string;
  description?: string;
  file_name: string;
  file_size: number;
  file_type: string;
  columns: string[];
  num_rows: number;
  created_at: string;
  updated_at: string;
}

export interface DatasetListResponse {
  items: Dataset[];
  total: number;
  page: number;
  page_size: number;
}

export interface DatasetUploadResponse {
  id: string;
  name: string;
  file_name: string;
  file_size: number;
  created_at: string;
}

export const datasetsApi = {
  // Get all datasets with pagination
  async getDatasets(page: number = 1, pageSize: number = 10): Promise<DatasetListResponse> {
    return apiRequest<DatasetListResponse>(
      `/api/datasets?page=${page}&page_size=${pageSize}`
    );
  },

  // Get a single dataset by ID
  async getDataset(id: string): Promise<Dataset> {
    return apiRequest<Dataset>(`/api/datasets/${id}`);
  },

  // Upload a new dataset
  async uploadDataset(file: File, name?: string): Promise<DatasetUploadResponse> {
    const metadata = name ? { name } : undefined;
    return apiUpload<DatasetUploadResponse>('/api/datasets', file, metadata);
  },

  // Delete a dataset
  async deleteDataset(id: string): Promise<void> {
    return apiRequest(`/api/datasets/${id}`, {
      method: 'DELETE',
    });
  },

  // Get dataset preview (first few rows)
  async getDatasetPreview(id: string, limit: number = 10): Promise<any[]> {
    return apiRequest<any[]>(`/api/datasets/${id}/preview?limit=${limit}`);
  },

  // Get dataset statistics
  async getDatasetStats(id: string): Promise<any> {
    return apiRequest<any>(`/api/datasets/${id}/stats`);
  },
};
