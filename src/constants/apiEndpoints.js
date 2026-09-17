
export const MEDIA_TYPES = {
    MOVIE: 'movie',
    TV: 'tv',
    PERSON: 'person',
    ANIME: 'anime',
    MULTI: 'multi',
};

export const VIDEO_LANGUAGES = 'en,hi,ta,te,ml,null';

export const SORT_OPTIONS = [
    { value: 'popularity.desc', label: 'Most Popular' },
    { value: 'vote_average.desc', label: 'Highest Rated' },
    { value: 'primary_release_date.desc', label: 'Release Date (Newest)' },
];

export const ENDPOINTS = {
    TRENDING_ALL: '/trending/all/week',
    TRENDING_TYPE: (type, timeWindow = 'week') => `/trending/${type}/${timeWindow}`,
    DISCOVER_MEDIA: (type) => `/discover/${type}`,
    MEDIA_DETAILS: (type, id) => `/${type}/${id}`,
    MEDIA_VIDEOS: (type, id) => `/${type}/${id}/videos`,
    MEDIA_SIMILAR: (type, id) => `/${type}/${id}/similar`,
    MEDIA_RECOMMENDATIONS: (type, id) => `/${type}/${id}/recommendations`,
    PERSON_DETAILS: (id) => `/person/${id}`,
    PERSON_CREDITS: (id) => `/person/${id}/combined_credits`,
    SEARCH_MULTI: '/search/multi',
    SEARCH_PERSON: '/search/person',
    SEARCH_TYPE: (type) => `/search/${type}`,
};
