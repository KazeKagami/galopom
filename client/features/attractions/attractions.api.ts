import { apiClient } from '../../services/api.client';

export const getAttractions = () => apiClient.get('/attractions');

export const getAttractionById = (id: number) => apiClient.get(`/attractions/${id}`);

export const createAttraction = (data: any) => apiClient.post('/attractions', data);