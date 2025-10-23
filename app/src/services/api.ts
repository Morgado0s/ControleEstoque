// Fallback API client using fetch instead of axios
import { ApiResponse } from '@/types';

// Use localhost for both local and Docker environments (Docker port mapping)
const API_BASE_URL = 'http://localhost:5001';
const API_TIMEOUT = 30000; // 30 seconds

// Simple fetch-based API client
class ApiClient {
  private baseUrl: string;
  private timeout: number;

  constructor(baseUrl: string = API_BASE_URL, timeout: number = API_TIMEOUT) {
    this.baseUrl = baseUrl;
    this.timeout = timeout;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('🌐 API Request URL:', url);
    console.log('📋 API Request Options:', options);

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const fetchOptions = {
        ...options,
        signal: controller.signal,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
      };
      console.log('🔧 API Fetch Options:', fetchOptions);

      const response = await fetch(url, fetchOptions);

      clearTimeout(timeoutId);

      console.log('📡 API Response Status:', response.status, response.statusText);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('❌ API Error Response:', errorText);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('✅ API Success Response:', data);

      return {
        success: true,
        data: data.data || data,
        message: data.message || 'Success',
        status: response.status,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      console.log('💥 API Request Error:', error);
      return {
        success: false,
        data: null as T,
        message: error instanceof Error ? error.message : 'Unknown error',
        status: 0,
      };
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    console.log('🚀 API POST Request:', endpoint, data);
    const bodyString = data ? JSON.stringify(data) : undefined;
    console.log('📦 API POST Body String:', bodyString);
    return this.request<T>(endpoint, {
      method: 'POST',
      body: bodyString,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const api = new ApiClient();
export default api;