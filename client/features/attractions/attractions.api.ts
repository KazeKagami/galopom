// features/attractions/attractions.api.ts

import { Attraction } from '../../../shared/types/attractions.types';
import { apiClient } from '../../services/api.client';

type QueryParams = {
    sort?: 'm_id' | 'title';
    order?: 'asc' | 'desc';
};

// Получить все
export const getAttractions = (params?: QueryParams) => {
    return apiClient.get<Attraction[]>('/attractions', params);
};

// Фильтрация + сортировка
export const getFilteredAttractions = (
    filters: {
        kinds?: string[];
        cities?: string[];
        countries?: string[];
        architects?: string[];
        sculptors?: string[];
        ideaAuthors?: string[];
    },
    params?: QueryParams
) => {
    return apiClient.post<Attraction[]>('/attractions/filter', filters, params);
};

// Получить одну
export const getAttractionById = (id: number) =>
    apiClient.get<Attraction>(`/attractions/${id}`);

// Создать
export const createAttraction = (data: any) =>
    apiClient.post<Attraction>('/attractions', data);