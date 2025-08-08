import axios from 'axios';
import { Form, Response, Answer } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for error handling
api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

// Form API
export const formAPI = {
  // Get all forms
  getAllForms: () => api.get<Form[]>('/forms'),
  
  // Get form by ID
  getFormById: (id: string) => api.get<Form>(`/forms/${id}`),
  
  // Get form by slug (for public access)
  getFormBySlug: (slug: string) => api.get<Form>(`/forms/slug/${slug}`),
  
  // Create new form
  createForm: (formData: Partial<Form>) => api.post<Form>('/forms', formData),
  
  // Update form
  updateForm: (id: string, formData: Partial<Form>) => api.put<Form>(`/forms/${id}`, formData),
  
  // Delete form
  deleteForm: (id: string) => api.delete(`/forms/${id}`),
  
  // Publish/unpublish form
  publishForm: (id: string, isPublished: boolean) => 
    api.post(`/forms/${id}/publish`, { isPublished }),
  
  // Get form responses
  getFormResponses: (id: string) => api.get<Response[]>(`/forms/${id}/responses`),
};

// Response API
export const responseAPI = {
  // Submit response
  submitResponse: (responseData: {
    formSlug: string;
    answers: Answer[];
    completionTime?: number;
    sessionId?: string;
  }) => api.post<{
    message: string;
    responseId: string;
    score: number;
    maxScore: number;
    thankYouMessage: string;
  }>('/responses', responseData),
  
  // Get response by ID
  getResponseById: (id: string) => api.get<Response>(`/responses/${id}`),
  
  // Get responses by form slug
  getResponsesBySlug: (slug: string) => api.get<Response[]>(`/responses/form/${slug}`),
  
  // Delete response
  deleteResponse: (id: string) => api.delete(`/responses/${id}`),
  
  // Get form analytics
  getFormAnalytics: (formId: string) => api.get(`/responses/analytics/${formId}`),
};

// Upload API
export const uploadAPI = {
  // Upload image file
  uploadImage: (file: File) => {
    const formData = new FormData();
    formData.append('image', file);
    return api.post<{ url: string; publicId: string; message: string }>('/upload/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  
  // Upload base64 image
  uploadBase64Image: (imageData: string, filename?: string) => 
    api.post<{ url: string; publicId: string; message: string }>('/upload/base64', {
      imageData,
      filename,
    }),
  
  // Delete image
  deleteImage: (publicId: string) => api.delete(`/upload/image/${publicId}`),
};

export default api;
