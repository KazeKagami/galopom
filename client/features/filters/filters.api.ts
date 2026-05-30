import { apiClient } from "@/services/api.client";
import { baseSort } from "../../types/baseSort.types"

export const getKinds = () => apiClient.get<baseSort[]>('/filter/kinds');

export const getCities = () => apiClient.get<baseSort[]>('/filter/cities');

export const getCountries = () => apiClient.get<baseSort[]>('/filter/countries');

export const getArchitects = () => apiClient.get<baseSort[]>('/filter/architects');

export const getSculptors = () => apiClient.get<baseSort[]>('/filter/sculptors');

export const getIdeaAuthors = () => apiClient.get<baseSort[]>('/filter/idea_authors');