const API_BASE_URL = 'http://localhost:8000';

export interface ApiError extends Error {
  status?: number;
  details?: any;
}

export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config: RequestInit = {
    ...options,
    headers,
    credentials: 'include',
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error: ApiError = new Error(data.detail || 'An error occurred');
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
}

export async function apiUpload<T = any>(
  endpoint: string,
  file: File,
  metadata: Record<string, any> = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;
  const formData = new FormData();
  formData.append('file', file);
  
  // Add metadata as JSON string
  if (Object.keys(metadata).length > 0) {
    formData.append('metadata', JSON.stringify(metadata));
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'include',
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const error: ApiError = new Error(data.detail || 'Upload failed');
      error.status = response.status;
      error.details = data;
      throw error;
    }

    return data as T;
  } catch (error) {
    console.error('Upload Error:', error);
    throw error;
  }
}
