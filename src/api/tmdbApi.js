import axiosInstance from '../services/axios';
import { ENDPOINTS, VIDEO_LANGUAGES } from '../constants/apiEndpoints';

/**
 * TMDB API Service Layer
 */
export const tmdbApi = {
    // Trending APIs
    getTrendingAll: async () => {
        const response = await axiosInstance.get(ENDPOINTS.TRENDING_ALL);
        return (response.data?.results || []).filter(item => item.media_type !== 'person');
    },

    getTrending: async (type = 'movie', timeWindow = 'week') => {
        const response = await axiosInstance.get(ENDPOINTS.TRENDING_TYPE(type, timeWindow));
        return response.data?.results || [];
    },

    // Anime discovery
    getTrendingAnime: async (params = {}) => {
        const response = await axiosInstance.get(ENDPOINTS.DISCOVER_MEDIA('tv'), {
            params: {
                with_genres: params.genreId || 16,
                sort_by: params.sortBy || 'popularity.desc',
                page: params.page || 1,
            },
        });
        const results = (response.data?.results || []).map((item) => ({
            ...item,
            media_type: 'tv',
        }));
        return {
            results,
            totalPages: response.data?.total_pages || 1,
        };
    },

    // Media Details & Videos
    getMediaDetails: async (type, id) => {
        const response = await axiosInstance.get(ENDPOINTS.MEDIA_DETAILS(type, id));
        return response.data;
    },

    getMediaVideos: async (type, id) => {
        const response = await axiosInstance.get(ENDPOINTS.MEDIA_VIDEOS(type, id), {
            params: {
                language: 'en-US',
                include_video_language: VIDEO_LANGUAGES
            },
        });
        return response.data?.results || [];
    },

    // Person APIs
    getPersonDetails: async (id) => {
        const response = await axiosInstance.get(ENDPOINTS.PERSON_DETAILS(id));
        return response.data;
    },

    getPersonCredits: async (id) => {
        const response = await axiosInstance.get(ENDPOINTS.PERSON_CREDITS(id));
        return response.data;
    },

    // Discover & Explore
    getDiscoverMedia: async (type = 'movie', params = {}) => {
        const response = await axiosInstance.get(ENDPOINTS.DISCOVER_MEDIA(type), {
            params,
        });
        return {
            results: response.data?.results || [],
            totalPages: response.data?.total_pages || 1,
        };
    },

    // Generic Endpoint Fetcher
    getByEndpoint: async (endpoint, params = {}) => {
        const response = await axiosInstance.get(endpoint, { params });
        return {
            results: response.data?.results || [],
            totalPages: response.data?.total_pages || 1,
        };
    },

    // Search APIs
    searchMulti: async (query, page = 1) => {
        const response = await axiosInstance.get(ENDPOINTS.SEARCH_MULTI, {
            params: { query, page },
        });
        return {
            results: response.data?.results || [],
            totalPages: response.data?.total_pages || 1,
        };
    },

    searchPerson: async (query, page = 1) => {
        const response = await axiosInstance.get(ENDPOINTS.SEARCH_PERSON, {
            params: { query, page },
        });
        return {
            results: response.data?.results || [],
            totalPages: response.data?.total_pages || 1,
        };
    },

    searchByType: async (type, query, page = 1) => {
        const response = await axiosInstance.get(ENDPOINTS.SEARCH_TYPE(type), {
            params: { query, page },
        });
        return {
            results: response.data?.results || [],
            totalPages: response.data?.total_pages || 1,
        };
    },
};

export default tmdbApi;
