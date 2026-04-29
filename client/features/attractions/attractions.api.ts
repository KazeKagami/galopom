import { Attraction } from '../../../shared/types/attractions';
import { apiClient } from '../../services/api.client';

export const getAttractions = () => apiClient.get<Attraction[]>('/attractions');

export const getAttractionById = (id: number) => apiClient.get<Attraction[]>(`/attractions/${id}`);

export const createAttraction = (data: any) => apiClient.post<Attraction[]>('/attractions', data);