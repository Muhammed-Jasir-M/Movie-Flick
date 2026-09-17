import React, { useCallback, useEffect, useState } from 'react'
import tmdbApi from '../api/tmdbApi';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl } from '../constants/constants';
import { FaBookmark, FaExternalLinkAlt, FaPlay, FaRegBookmark, FaRegCalendarAlt, FaRegClock, FaStar } from 'react-icons/fa';
import moment from 'moment';
import { BiCameraMovie } from 'react-icons/bi';
import { useWatchlistContext } from '../store/watchlistContext';
import { useAuthContext } from '../store/authContext';
import { toast } from 'react-toastify';
import { DetailsSkeleton } from './SkeletonLoaders';

const DetailsInfo = () => {
    const [mediaData, setMediaData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);

    const { addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlistContext();
    const { user } = useAuthContext();

    const { type, id } = useParams();
    const mediaType = type === 'anime' ? 'tv' : type;

    const runtime = mediaData?.runtime || mediaData?.last_episode_to_air?.runtime || mediaData?.episode_run_time?.[0];

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(false);

        try {
            const data = await tmdbApi.getMediaDetails(mediaType, id);
            if (data && data.id) {
                setMediaData(data);
            } else {
                setError(true);
            }
        } catch (err) {
            console.error("Error fetching media details:", err);
            setError(true);
        } finally {
            setLoading(false);
        }
    }, [id, mediaType]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const checkWatchlistStatus = async () => {
            if (mediaData?.id) {
                const watchlist = await fetchWatchlist(user?.uid);
                const isSaved = watchlist.some(item => Number(item.id) === Number(mediaData.id) || item.id === `${type}-${mediaData.id}`);
                setIsInWatchlist(isSaved);
            }
        };

        checkWatchlistStatus();
    }, [user?.uid, mediaData?.id, type, fetchWatchlist]);

    const [watchlistLoading, setWatchlistLoading] = useState(false);

    const handleClick = async () => {
        setWatchlistLoading(true);
        const nextState = !isInWatchlist;
        setIsInWatchlist(nextState);

        try {
            if (nextState) {
                await addToWatchlist(user?.uid, mediaData, type);
                toast.success('Added to watchlist');
            } else {
                await removeFromWatchlist(user?.uid, mediaData, type);
                toast.success('Removed from watchlist');
            }
        } catch (error) {
            console.error('Error updating watchlist:', error);
            setIsInWatchlist(!nextState); // revert on error
            toast.error('Failed to update watchlist');
        } finally {
            setWatchlistLoading(false);
        }
    };

    if (loading) {
        return <DetailsSkeleton />;
    }

    if (error || !mediaData) {
        return (
            <div className="relative w-full bg-[#0f172a] text-white min-h-[500px] flex items-center justify-center px-4 pt-20 pb-12">
                <div className="p-6 sm:p-8 bg-[#14213d]/70 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl text-center max-w-md w-full">
                    <div className="w-14 h-14 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-500/30">
                        <BiCameraMovie className="text-2xl" />
                    </div>
                    <h2 className="text-xl font-extrabold text-white mb-2">Something Went Wrong</h2>
                    <p className="text-sm text-gray-400 mb-6">
                        We couldn't load the details for this title. Please check your internet connection or try again.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-3">
                        <button
                            onClick={fetchData}
                            className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-red-600/30 text-sm cursor-pointer"
                        >
                            Retry
                        </button>
                        <Link to="/" className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-gray-200 font-semibold rounded-xl border border-gray-700 transition-all text-sm">
                            Return to Home
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="relative w-full bg-[#0f172a] text-white min-h-[450px]">
            {/* Hero Backdrop Overlay */}
            {mediaData?.backdrop_path && (
                <div className="absolute top-0 left-0 right-0 h-[450px] sm:h-[550px] overflow-hidden pointer-events-none z-0">
                    <img
                        src={getImageUrl('original', mediaData.backdrop_path)}
                        alt="Backdrop"
                        className="w-full h-full object-cover object-top opacity-55"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a] via-[#0f172a]/65 to-[#0f172a]/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/70 via-transparent to-[#0f172a]/70" />
                </div>
            )}

            {/* Main Content Container */}
            <div className="relative z-10 max-w-7xl mx-auto pt-20 sm:pt-24 pb-4 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row gap-8 lg:gap-12 items-center md:items-start">
                    {/* Poster & CTA Buttons */}
                    <div className="flex flex-col items-center min-w-[220px] max-w-[260px] sm:max-w-[280px] w-full flex-shrink-0">
                        <div className="relative w-full aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-gray-700/60 group">
                            {mediaData?.poster_path ? (
                                <img
                                    src={getImageUrl('w500', mediaData.poster_path)}
                                    alt={mediaData?.title || mediaData?.name}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            ) : (
                                <div className="w-full h-full flex justify-center items-center bg-[#14213d] text-gray-400 font-medium">
                                    No Poster Image
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        <div className="w-full mt-4 flex flex-col gap-2.5">
                            <Link to={`/player/${type}/${id}`} className="w-full">
                                <button className="w-full py-3 px-5 bg-red-600 hover:bg-red-700 active:scale-95 text-white font-bold rounded-xl shadow-lg shadow-red-600/30 flex items-center justify-center gap-2.5 transition-all duration-300 cursor-pointer">
                                    <FaPlay className="text-sm" />
                                    <span>Watch Trailer</span>
                                </button>
                            </Link>

                            <div className="flex gap-2 w-full">
                                <button
                                    onClick={handleClick}
                                    disabled={watchlistLoading}
                                    className={`flex-1 py-2.5 px-3 font-semibold text-xs sm:text-sm rounded-xl border flex items-center justify-center gap-1.5 transition-all duration-300 ${
                                        watchlistLoading ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer'
                                    } ${
                                        isInWatchlist
                                            ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500/30'
                                            : 'bg-slate-800/80 hover:bg-slate-700 text-gray-200 border-gray-700'
                                    }`}
                                >
                                    {isInWatchlist ? <FaBookmark className="text-amber-400 text-xs flex-shrink-0" /> : <FaRegBookmark className="text-xs flex-shrink-0" />}
                                    <span className="truncate">{isInWatchlist ? 'In Watchlist' : 'Watchlist'}</span>
                                </button>

                                {mediaData?.homepage && (
                                    <a
                                        href={mediaData.homepage}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex-1"
                                    >
                                        <button className="w-full py-2.5 px-3 font-semibold text-xs sm:text-sm rounded-xl border border-gray-700 bg-slate-800/80 hover:bg-slate-700 text-gray-200 flex items-center justify-center gap-1.5 transition-all duration-300 cursor-pointer">
                                            <FaExternalLinkAlt className="text-xs flex-shrink-0" />
                                            <span className="truncate">Website</span>
                                        </button>
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Movie Info Section */}
                    <div className="flex flex-col gap-4 text-center md:text-left flex-1 min-w-0">
                        <div>
                            <h1 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
                                {mediaData?.title || mediaData?.name}
                            </h1>

                            {mediaData?.tagline && (
                                <p className="text-sm sm:text-base italic text-gray-300/90 mt-1">
                                    "{mediaData.tagline}"
                                </p>
                            )}
                        </div>

                        {/* Metadata Pills */}
                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 sm:gap-3 text-xs sm:text-sm font-semibold text-gray-300">
                            {mediaData?.vote_average > 0 && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-full">
                                    <FaStar className="text-amber-400" />
                                    {Number(mediaData.vote_average).toFixed(1)}
                                    {mediaData?.vote_count > 0 && (
                                        <span className="text-[11px] text-amber-300/70 font-normal">
                                            ({mediaData.vote_count})
                                        </span>
                                    )}
                                </span>
                            )}

                            {(mediaData?.release_date || mediaData?.first_air_date) && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-gray-700 rounded-full">
                                    <FaRegCalendarAlt className="text-red-400" />
                                    {moment(mediaData.release_date || mediaData.first_air_date).format('MMM DD, YYYY')}
                                </span>
                            )}

                            <span className="capitalize flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-gray-700 rounded-full">
                                <BiCameraMovie className="text-red-400" />
                                {type}
                            </span>

                            {runtime > 0 && (
                                <span className="flex items-center gap-1.5 px-3 py-1 bg-slate-800/80 border border-gray-700 rounded-full">
                                    <FaRegClock className="text-red-400" />
                                    {runtime >= 60 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : `${runtime}m`}
                                </span>
                            )}

                            {mediaData?.status && (
                                <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 rounded-full">
                                    {mediaData.status}
                                </span>
                            )}
                        </div>

                        {/* Genres */}
                        {mediaData?.genres?.length > 0 && (
                            <div className="flex flex-wrap justify-center md:justify-start gap-2 pt-1">
                                {mediaData.genres.map((genre) => (
                                    <span
                                        key={genre.id}
                                        className="px-3 py-1 bg-[#14213d]/80 border border-gray-700/70 rounded-lg text-xs font-semibold text-gray-200 hover:border-red-500/50 transition-colors"
                                    >
                                        {genre.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Overview / Synopsis */}
                        {mediaData?.overview && (
                            <div className="pt-2">
                                <h3 className="text-lg font-bold text-white mb-1.5">Overview</h3>
                                <p className="text-sm sm:text-base text-gray-300 leading-relaxed max-w-3xl">
                                    {mediaData.overview}
                                </p>
                            </div>
                        )}

                        {/* Details Grid (Budget, Revenue, Seasons, Episodes) */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-gray-800/80 mt-2">
                            {mediaData?.budget > 0 && (
                                <div className="bg-[#14213d]/50 p-3 rounded-xl border border-gray-800 text-center md:text-left">
                                    <span className="text-xs text-gray-400 font-medium block">Budget</span>
                                    <span className="text-sm font-semibold text-white">
                                        ${mediaData.budget.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {mediaData?.revenue > 0 && (
                                <div className="bg-[#14213d]/50 p-3 rounded-xl border border-gray-800 text-center md:text-left">
                                    <span className="text-xs text-gray-400 font-medium block">Revenue</span>
                                    <span className="text-sm font-semibold text-white">
                                        ${mediaData.revenue.toLocaleString()}
                                    </span>
                                </div>
                            )}

                            {mediaData?.number_of_seasons > 0 && (
                                <div className="bg-[#14213d]/50 p-3 rounded-xl border border-gray-800 text-center md:text-left">
                                    <span className="text-xs text-gray-400 font-medium block">Seasons</span>
                                    <span className="text-sm font-semibold text-white">
                                        {mediaData.number_of_seasons}
                                    </span>
                                </div>
                            )}

                            {mediaData?.number_of_episodes > 0 && (
                                <div className="bg-[#14213d]/50 p-3 rounded-xl border border-gray-800 text-center md:text-left">
                                    <span className="text-xs text-gray-400 font-medium block">Episodes</span>
                                    <span className="text-sm font-semibold text-white">
                                        {mediaData.number_of_episodes}
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DetailsInfo

