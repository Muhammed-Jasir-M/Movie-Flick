import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/axios';
import PosterCard from '../components/PosterCard';
import Spinner from '../components/Spinner';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';
import { MovieGenres, TvShowGenres } from '../constants/GenreList';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('multi'); // multi, movie, tv
    const [search, setSearch] = useState('');
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
        if (page > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            let response;

            // If user selected a genre or sort_by without search query, use discover API
            if (selectedGenre || (search.trim().length === 0 && activeTab !== 'multi')) {
                const mediaType = activeTab === 'multi' ? 'movie' : activeTab;
                response = await axiosInstance.get(`/discover/${mediaType}`, {
                    params: {
                        with_genres: selectedGenre || undefined,
                        sort_by: sortBy,
                        page: page,
                    },
                });
            } else {
                // Otherwise use search API
                response = await axiosInstance.get(`/search/${activeTab}`, {
                    params: {
                        query: search,
                        page: page,
                    },
                });
            }

            let results = response.data.results || [];

            if (activeTab === 'multi') {
                results = results.filter((result) => result.media_type !== 'person');
            }

            // Client-side genre filtering if multi search return items
            if (selectedGenre && search.trim().length > 0) {
                const genreIdNum = Number(selectedGenre);
                results = results.filter((item) => item.genre_ids?.includes(genreIdNum));
            }

            setMedias((prev) => (page === 1 ? results : [...prev, ...results]));
            setTotalPages(response.data.total_pages || 0);
        } catch (error) {
            console.error('Error fetching search results:', error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeTab, page, search, selectedGenre, sortBy]);

    const handleScroll = useCallback(() => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && page < totalPages && !loading && !loadingMore) {
            setPage((prev) => prev + 1);
        }
    }, [page, totalPages, loading, loadingMore]);

    useEffect(() => {
        if (search.trim().length > 0 || selectedGenre || activeTab !== 'multi') {
            fetchData();
        } else {
            setMedias([]);
            setPage(1);
            setTotalPages(0);
        }
    }, [search, selectedGenre, sortBy, activeTab, page, fetchData]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    const handleSearch = (e) => {
        const value = e.target.value;
        clearTimeout(searchTimer.current);

        searchTimer.current = setTimeout(() => {
            setSearch(value);
            setPage(1);
            setMedias([]);
        }, 300);
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
                <input
                    type="text"
                    placeholder={`Search for ${activeTab === 'multi' ? 'movies & TV shows...' : activeTab === 'tv' ? 'TV shows...' : 'movies...'}`}
                    className="max-w-2xl w-full h-12 px-5 py-3 rounded-xl bg-[#14213d] text-white text-lg outline-none border border-gray-700 focus:border-red-500 transition-colors shadow-lg"
                    onChange={handleSearch}
                    defaultValue={search}
                />
            </form>

            {/* Category Tabs & Filter Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 mt-6 w-full max-w-4xl bg-[#14213d]/60 p-4 rounded-xl border border-gray-800">
                {/* Media Type Tabs */}
                <div className="flex items-center gap-2">
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
                </div>

                {/* Genre & Sort Dropdown Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    {/* Genre Filter */}
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

                    {/* Sort By Filter */}
                    <select
                        value={sortBy}
                        onChange={handleSortChange}
                        className="bg-slate-800 text-white text-sm font-medium py-1.5 px-3 rounded-lg border border-gray-700 outline-none cursor-pointer focus:border-red-500"
                    >
                        <option value="popularity.desc">Most Popular</option>
                        <option value="vote_average.desc">Highest Rated</option>
                        <option value="primary_release_date.desc">Release Date (Newest)</option>
                    </select>
                </div>
            </div>

            {/* Results Grid */}
            <div className="flex flex-col justify-center items-center w-full mt-6">
                {loading && page === 1 ? (
                    <PosterCardSkeleton count={12} />
                ) : medias.length > 0 ? (
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-5 gap-y-4 pt-4 pb-4 w-full px-1.5 md:px-4">
                        {medias.map((data, index) => (
                            <PosterCard
                                key={`${data.id}-${index}`}
                                data={data}
                                type={activeTab === 'multi' ? data.media_type || 'movie' : activeTab}
                                isSmall
                            />
                        ))}
                    </div>
                ) : (
                    (search.length > 0 || selectedGenre) && (
                        <div className="flex flex-col items-center py-16 text-center">
                            <h2 className="text-2xl text-white font-bold">No results found</h2>
                            <p className="text-gray-400 mt-2 text-sm">Try adjusting your search query, genre, or filters.</p>
                        </div>
                    )
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