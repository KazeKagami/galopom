// features/attractions/attractions.api.ts

import { Attraction } from '../../types/attractions.types';
import { apiClient } from '../../services/api.client';

type QueryParams = {
    sort?: 'm_id' | 'title';
    order?: 'asc' | 'desc';
};

// Получить все
export const getAttractions = (params?: QueryParams) => {
    let url = '/attractions';
    if (params) {
        const queryParams = new URLSearchParams();
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.order) queryParams.append('order', params.order);
        url += `?${queryParams.toString()}`;
    }
    return apiClient.get<Attraction[]>(url);
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
    let url = '/attractions/filter';
    if (params) {
        const queryParams = new URLSearchParams();
        if (params.sort) queryParams.append('sort', params.sort);
        if (params.order) queryParams.append('order', params.order);
        url += `?${queryParams.toString()}`;
    }
    // POST запрос с телом filters, параметры в URL
    return apiClient.post<Attraction[]>(url, filters);
};

// Получить одну
export const getAttractionById = (id: number) =>
    apiClient.get<Attraction>(`/attractions/${id}`);

// Создать
export const createAttraction = (data: any) =>
    apiClient.post<Attraction>('/attractions', data);