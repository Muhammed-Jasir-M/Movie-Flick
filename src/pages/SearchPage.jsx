import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import PosterCard from '../components/PosterCard';
import Spinner from '../components/Spinner';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';
import { MovieGenres, TvShowGenres } from '../constants/GenreList';
import { getImageUrl } from '../constants/constants';
import { SORT_OPTIONS } from '../constants/apiEndpoints';
import useInfiniteScroll from '../hooks/useInfiniteScroll';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('multi'); // multi, movie, tv, person, anime
    const [search, setSearch] = useState('');
    const [inputValue, setInputValue] = useState('');
    const [selectedGenre, setSelectedGenre] = useState('');
    const [sortBy, setSortBy] = useState('popularity.desc');
    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const searchTimer = useRef(null);

    // Combine genres based on active tab
    const genres = activeTab === 'tv' ? TvShowGenres : MovieGenres;

    const fetchData = useCallback(async () => {
        if (!search.trim() && !selectedGenre) {
            setMedias([]);
            setLoading(false);
            setLoadingMore(false);
            return;
        }

        if (page > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            let res;

            if (activeTab === 'person') {
                res = await tmdbApi.searchPerson(search, page);
            } else if (activeTab === 'anime') {
                if (search.trim().length > 0) {
                    res = await tmdbApi.searchMulti(search, page);
                } else {
                    res = await tmdbApi.getTrendingAnime({
                        genreId: selectedGenre ? `${selectedGenre},16` : 16,
                        sortBy,
                        page,
                    });
                }
            } else if (selectedGenre && search.trim().length === 0) {
                const mediaType = activeTab === 'multi' ? 'movie' : activeTab;
                res = await tmdbApi.getDiscoverMedia(mediaType, {
                    with_genres: selectedGenre,
                    sort_by: sortBy,
                    page,
                });
            } else {
                res = await tmdbApi.searchByType(activeTab, search, page);
            }

            let results = res.results || [];

            if (activeTab === 'multi' || activeTab === 'anime') {
                results = results.filter((result) => result.media_type !== 'person');
            }

            if (activeTab === 'anime' && search.trim().length > 0) {
                // Filter search results for animation genre id 16 or 10759
                results = results.filter((item) => item.genre_ids?.includes(16) || item.genre_ids?.includes(10759));
            }

            if (selectedGenre && search.trim().length > 0 && activeTab !== 'person' && activeTab !== 'anime') {
                const genreIdNum = Number(selectedGenre);
                results = results.filter((item) => item.genre_ids?.includes(genreIdNum));
            }

            setMedias((prev) => (page === 1 ? results : [...prev, ...results]));
            setTotalPages(res.totalPages || 0);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeTab, page, search, selectedGenre, sortBy]);

    const handleLoadNextPage = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    useInfiniteScroll(handleLoadNextPage, page < totalPages, loading || loadingMore, 200);

    useEffect(() => {
        if (search.trim().length > 0 || selectedGenre) {
            fetchData();
        } else {
            setMedias([]);
            setPage(1);
            setTotalPages(0);
        }
    }, [search, selectedGenre, sortBy, activeTab, page, fetchData]);

    const handleSearch = (e) => {
        const value = e.target.value;
        setInputValue(value);
        clearTimeout(searchTimer.current);

        searchTimer.current = setTimeout(() => {
            setSearch(value);
            setPage(1);
            setMedias([]);
        }, 300);
    };

    const handleClearSearch = () => {
        setInputValue('');
        setSearch('');
        setSelectedGenre('');
        setPage(1);
        setMedias([]);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setSelectedGenre('');
        setMedias([]);
        setPage(1);
    };

    const handleGenreChange = (e) => {
        setSelectedGenre(e.target.value);
        setPage(1);
        setMedias([]);
    };

    const handleSortChange = (e) => {
        setSortBy(e.target.value);
        setPage(1);
        setMedias([]);
    };

    return (
        <section className="container mx-auto min-h-[800px] md:min-h-screen flex flex-col items-center pt-24 pb-12 w-full px-4">
            {/* Search Input Bar */}
            <form onSubmit={(e) => e.preventDefault()} className="flex justify-center items-center px-2 sm:px-5 w-full">
                <div className="relative max-w-2xl w-full flex items-center">
                    <input
                        type="text"
                        placeholder={`Search for ${activeTab === 'multi' ? 'movies & TV shows...' : activeTab === 'tv' ? 'TV shows...' : activeTab === 'anime' ? 'anime titles...' : activeTab === 'person' ? 'actors & crew...' : 'movies...'}`}
                        className="w-full h-12 pl-5 pr-12 py-3 rounded-xl bg-[#14213d] text-white text-lg outline-none border border-gray-700 focus:border-red-500 transition-colors shadow-lg"
                        onChange={handleSearch}
                        value={inputValue}
                    />
                    {(inputValue || selectedGenre) && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="absolute right-4 text-gray-400 hover:text-white p-1 transition-colors"
                            title="Clear search"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    )}
                </div>
            </form>

            {/* Category Tabs & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 w-full max-w-4xl bg-[#14213d]/60 p-4 rounded-xl border border-gray-800">
                {/* Media Type Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    <button
                        className={`py-1.5 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'multi' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                        onClick={() => handleTabClick('multi')}
                    >
                        All
                    </button>
                    <button
                        className={`py-1.5 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'movie' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                        onClick={() => handleTabClick('movie')}
                    >
                        Movies
                    </button>
                    <button
                        className={`py-1.5 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'tv' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                        onClick={() => handleTabClick('tv')}
                    >
                        TV Shows
                    </button>
                    <button
                        className={`py-1.5 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'anime' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                        onClick={() => handleTabClick('anime')}
                    >
                        Anime
                    </button>
                    <button
                        className={`py-1.5 px-4 rounded-lg font-semibold text-sm transition-colors ${activeTab === 'person' ? 'bg-red-600 text-white' : 'bg-slate-800 text-gray-300 hover:bg-slate-700'}`}
                        onClick={() => handleTabClick('person')}
                    >
                        People
                    </button>
                </div>

                {/* Genre & Sort Dropdown Filters */}
                {activeTab !== 'person' && (
                    <div className="flex flex-wrap items-center gap-3">
                        <select
                            value={selectedGenre}
                            onChange={handleGenreChange}
                            className="bg-slate-800 text-white text-sm font-medium py-1.5 px-3 rounded-lg border border-gray-700 outline-none cursor-pointer focus:border-red-500"
                        >
                            <option value="">All Genres</option>
                            {genres.map((genre) => (
                                <option key={genre.id} value={genre.id}>
                                    {genre.name}
                                </option>
                            ))}
                        </select>

                        <select
                            value={sortBy}
                            onChange={handleSortChange}
                            className="bg-slate-800 text-white text-sm font-medium py-1.5 px-3 rounded-lg border border-gray-700 outline-none cursor-pointer focus:border-red-500"
                        >
                            {SORT_OPTIONS.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
            </div>

            {/* Results Grid */}
            <div className="flex flex-col justify-center items-center w-full mt-6">
                {loading && page === 1 ? (
                    <PosterCardSkeleton count={12} />
                ) : medias.length > 0 ? (
                    activeTab === 'person' ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 pt-4 pb-4 w-full px-1.5 md:px-4">
                            {medias.map((person, index) => (
                                <Link
                                    to={`/person/${person.id}`}
                                    key={`${person.id}-${index}`}
                                    className="flex flex-col items-center group cursor-pointer bg-[#14213d]/60 p-4 rounded-2xl border border-gray-800 hover:border-red-500/50 transition-all duration-300 hover:scale-105"
                                >
                                    <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#14213d] border-2 border-gray-700/60 group-hover:border-red-500 shadow-xl relative">
                                        {person.profile_path ? (
                                            <img
                                                src={getImageUrl('w500', person.profile_path)}
                                                alt={person.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400 text-center px-1">
                                                No Photo
                                            </div>
                                        )}
                                    </div>
                                    <div className="mt-3 text-center w-full">
                                        <h3 className="text-sm font-bold text-white truncate group-hover:text-red-400 transition-colors">
                                            {person.name}
                                        </h3>
                                        <p className="text-xs text-gray-400 truncate mt-0.5">
                                            {person.known_for_department || 'Actor/Crew'}
                                        </p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-5 gap-y-4 pt-4 pb-4 w-full px-1.5 md:px-4">
                            {medias.map((data, index) => (
                                <PosterCard
                                    key={`${data.id}-${index}`}
                                    data={data}
                                    type={data.media_type || (data.first_air_date ? 'tv' : 'movie') || (activeTab === 'multi' || activeTab === 'anime' ? 'tv' : activeTab)}
                                    isSmall
                                />
                            ))}
                        </div>
                    )
                ) : (search.length > 0 || selectedGenre) ? (
                    <div className="flex flex-col items-center py-16 text-center">
                        <div className="w-14 h-14 rounded-full bg-[#14213d] border border-gray-800 flex items-center justify-center mb-4 text-gray-400">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl text-white font-bold">No results found</h2>
                        <p className="text-gray-400 mt-2 text-sm max-w-sm">
                            We couldn't find anything matching your search. Try checking your spelling or clear filters.
                        </p>
                        <button
                            onClick={handleClearSearch}
                            className="mt-5 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-all shadow-lg hover:shadow-red-600/30 flex items-center gap-2 cursor-pointer"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                            Clear Search & Filters
                        </button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-20 text-center px-4 max-w-md">
                        <div className="w-16 h-16 rounded-full bg-[#14213d] border border-gray-800 flex items-center justify-center mb-4 text-red-500 shadow-xl">
                            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h2 className="text-xl font-bold text-white mb-2">Search Movies, TV Shows & People</h2>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Type a title, cast member, or choose a genre above to discover entertainment options.
                        </p>
                    </div>
                )}

                {loadingMore && (
                    <div className="flex justify-center py-8">
                        <Spinner borderColor={'border-white'} />
                    </div>
                )}
            </div>
        </section>
    );
};

export default SearchPage;