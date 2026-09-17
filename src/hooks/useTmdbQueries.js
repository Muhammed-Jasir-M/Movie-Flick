import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axiosInstance from '../services/axios';
import tmdbApi from '../api/tmdbApi';

/**
 * Fetch cards list for endpoint or genreId
 */
export const useCardsListQuery = (endpoint, genreId, type) => {
    return useQuery({
        queryKey: ['cardsList', endpoint || `genre-${genreId}-${type}`],
        queryFn: async () => {
            if (genreId) {
                const response = await axiosInstance.get(`/discover/${type}`, {
                    params: { with_genres: genreId }
                });
                return response.data?.results || [];
            }
            if (endpoint) {
                const response = await axiosInstance.get(endpoint);
                return response.data?.results || [];
            }
            return [];
        },
        enabled: Boolean(endpoint || genreId),
    });
};

/**
 * Fetch trending items for Banner or Trending lists
 */
export const useTrendingQuery = (type = 'movie', timeWindow = 'week') => {
    return useQuery({
        queryKey: ['trending', type, timeWindow],
        queryFn: () => tmdbApi.getTrending(type, timeWindow),
    });
};

export const useTrendingAllQuery = () => {
    return useQuery({
        queryKey: ['trendingAll'],
        queryFn: () => tmdbApi.getTrendingAll(),
    });
};

export const useTrendingAnimeQuery = () => {
    return useQuery({
        queryKey: ['trendingAnime'],
        queryFn: async () => {
            const data = await tmdbApi.getTrendingAnime();
            return data?.results || [];
        },
    });
};

/**
 * Fetch details for a specific media item (Movie or TV show)
 */
export const useMediaDetailsQuery = (type, id) => {
    return useQuery({
        queryKey: ['mediaDetails', type, id],
        queryFn: () => tmdbApi.getMediaDetails(type, id),
        enabled: Boolean(type && id),
    });
};

/**
 * Fetch trailers and videos for a specific media item
 */
export const useMediaVideosQuery = (type, id) => {
    return useQuery({
        queryKey: ['mediaVideos', type, id],
        queryFn: () => tmdbApi.getMediaVideos(type, id),
        enabled: Boolean(type && id),
    });
};

/**
 * Fetch Cast & Crew credits for a specific media item
 */
export const useMediaCreditsQuery = (type, id) => {
    return useQuery({
        queryKey: ['mediaCredits', type, id],
        queryFn: async () => {
            const response = await axiosInstance.get(`/${type}/${id}/credits`);
            return response.data || { cast: [], crew: [] };
        },
        enabled: Boolean(type && id),
    });
};

/**
 * Fetch Person Details (Actor/Director)
 */
export const usePersonDetailsQuery = (id) => {
    return useQuery({
        queryKey: ['personDetails', id],
        queryFn: () => tmdbApi.getPersonDetails(id),
        enabled: Boolean(id),
    });
};

/**
 * Fetch Person Combined Credits
 */
export const usePersonCreditsQuery = (id) => {
    return useQuery({
        queryKey: ['personCredits', id],
        queryFn: () => tmdbApi.getPersonCredits(id),
        enabled: Boolean(id),
    });
};

/**
 * Infinite query for explore page paginated content
 */
export const useExploreInfiniteQuery = (endpoint, genreId, type) => {
    return useInfiniteQuery({
        queryKey: ['explore', endpoint || `genre-${genreId}-${type}`],
        queryFn: async ({ pageParam = 1 }) => {
            if (genreId) {
                return await tmdbApi.getDiscoverMedia(type || 'movie', {
                    with_genres: genreId,
                    sort_by: 'popularity.desc',
                    page: pageParam,
                });
            } else {
                return await tmdbApi.getByEndpoint(endpoint, { page: pageParam });
            }
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        enabled: Boolean(endpoint || genreId),
    });
};

/**
 * Infinite query for Search & Filtering page
 */
export const useSearchInfiniteQuery = ({ activeTab, search, selectedGenre, sortBy }) => {
    const hasQuery = Boolean(search?.trim() || selectedGenre);

    return useInfiniteQuery({
        queryKey: ['search', activeTab, search, selectedGenre, sortBy],
        queryFn: async ({ pageParam = 1 }) => {
            if (activeTab === 'person') {
                return await tmdbApi.searchPerson(search, pageParam);
            }
            if (activeTab === 'anime') {
                if (search.trim().length > 0) {
                    return await tmdbApi.searchMulti(search, pageParam);
                } else {
                    return await tmdbApi.getTrendingAnime({
                        genreId: selectedGenre ? `${selectedGenre},16` : 16,
                        sortBy,
                        page: pageParam,
                    });
                }
            }
            if (selectedGenre && search.trim().length === 0) {
                const mediaType = activeTab === 'multi' ? 'movie' : activeTab;
                return await tmdbApi.getDiscoverMedia(mediaType, {
                    with_genres: selectedGenre,
                    sort_by: sortBy,
                    page: pageParam,
                });
            }
            if (activeTab === 'multi') {
                return await tmdbApi.searchMulti(search, pageParam);
            }
            return await tmdbApi.searchType(activeTab, search, pageParam);
        },
        initialPageParam: 1,
        getNextPageParam: (lastPage) => {
            if (lastPage.page < lastPage.totalPages) {
                return lastPage.page + 1;
            }
            return undefined;
        },
        enabled: hasQuery,
    });
};

/**
 * Watchlist React Query Hook
 */
export const useWatchlistQuery = (userId, fetchWatchlistFn) => {
    return useQuery({
        queryKey: ['watchlist', userId || 'guest'],
        queryFn: () => fetchWatchlistFn(userId),
    });
};

export const useWatchlistMutations = (userId, addToWatchlistFn, removeFromWatchlistFn) => {
    const queryClient = useQueryClient();

    const addMutation = useMutation({
        mutationFn: ({ item, type }) => addToWatchlistFn(userId, item, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId || 'guest'] });
        },
    });

    const removeMutation = useMutation({
        mutationFn: ({ itemId, type }) => removeFromWatchlistFn(userId, itemId, type),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist', userId || 'guest'] });
        },
    });

    return { addMutation, removeMutation };
};
