import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import Spinner from '../components/Spinner';
import PosterCard from '../components/PosterCard';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import { FaArrowLeft } from 'react-icons/fa';

const ExplorePage = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { type, title } = useParams();

    const formattedTitle = title ? title.replace(/-/g, ' ') : 'Explore';

    // Fallback endpoint builder if accessed directly without location state
    const resolveEndpoint = useCallback(() => {
        if (state?.endpoint) return state.endpoint;
        const lowerTitle = formattedTitle.toLowerCase();

        if (lowerTitle.includes('trending')) return `/trending/${type || 'movie'}/day`;
        if (lowerTitle.includes('top rated')) return `/${type || 'movie'}/top_rated`;
        if (lowerTitle.includes('now playing')) return `/movie/now_playing`;
        if (lowerTitle.includes('upcoming')) return `/movie/upcoming`;
        if (lowerTitle.includes('airing today')) return `/tv/airing_today`;
        if (lowerTitle.includes('on the air')) return `/tv/on_the_air`;

        return `/${type || 'movie'}/popular`;
    }, [state?.endpoint, formattedTitle, type]);

    const endpoint = resolveEndpoint();
    const genreId = state?.genreId;

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchData = useCallback(async () => {
        if (page > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            let res;
            if (genreId) {
                res = await tmdbApi.getDiscoverMedia(type || 'movie', {
                    with_genres: genreId,
                    sort_by: 'popularity.desc',
                    page,
                });
            } else {
                res = await tmdbApi.getByEndpoint(endpoint, { page });
            }

            setData((prev) => (page === 1 ? res.results : [...prev, ...res.results]));
            setTotalPages(res.totalPages);
        } catch (error) {
            console.error("Error fetching explore data:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [endpoint, genreId, page, type]);

    const handleLoadNextPage = useCallback(() => {
        setPage((prev) => prev + 1);
    }, []);

    useInfiniteScroll(handleLoadNextPage, page < totalPages, loading || loadingMore, 250);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className="container mx-auto min-h-[800px] md:min-h-screen pt-24 pb-16 px-4 max-w-7xl">
            {/* Header Section */}
            <div className="relative flex items-center justify-center mb-6 pb-4 border-b border-gray-800 w-full">
                <button
                    onClick={() => navigate(-1)}
                    className="absolute left-0 p-2 rounded-xl bg-[#14213d] hover:bg-slate-800 border border-gray-700 text-gray-300 hover:text-white transition-colors cursor-pointer"
                    title="Go back"
                >
                    <FaArrowLeft size={16} />
                </button>
                <h1 className="text-2xl sm:text-3xl font-black text-white capitalize text-center">
                    {formattedTitle}
                </h1>
            </div>

            {/* Results Grid */}
            {loading && page === 1 ? (
                <PosterCardSkeleton count={14} />
            ) : data.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-x-3 md:gap-x-4 gap-y-4 pt-2 pb-4 w-full">
                    {data.map((item, index) => (
                        <PosterCard
                            key={`${item.id}-${index}`}
                            data={item}
                            type={item.media_type || type || 'movie'}
                            isSmall
                            isGrid
                        />
                    ))}
                </div>
            ) : (
                <div className="py-20 text-center flex flex-col items-center">
                    <h2 className="text-xl font-bold text-white mb-2">No content available</h2>
                    <p className="text-sm text-gray-400 mb-6">Try exploring a different category or retry loading.</p>
                    <button
                        onClick={fetchData}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-600/30 cursor-pointer"
                    >
                        Retry
                    </button>
                </div>
            )}

            {/* Infinite Scroll Loader */}
            {loadingMore && (
                <div className="flex justify-center py-8">
                    <Spinner borderColor="border-white" />
                </div>
            )}
        </section>
    );
};

export default ExplorePage;