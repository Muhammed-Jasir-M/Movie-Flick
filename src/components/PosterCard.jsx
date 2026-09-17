import React, { useEffect, useState } from 'react';
import { getImageUrl } from '../constants/constants';
import moment from 'moment';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaBookmark, FaRegBookmark } from 'react-icons/fa';
import { useWatchlistContext } from '../store/watchlistContext';
import { useAuthContext } from '../store/authContext';

const PosterCard = ({ data, isTrending, index, type, isSmall, isWatchlist, isGrid }) => {
    const { user } = useAuthContext();
    const { addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlistContext();
    const [inWatchlist, setInWatchlist] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    const rawType = data?.media_type || (data?.first_air_date ? 'tv' : 'movie') || type || 'movie';
    const mediaType = rawType === 'anime' ? (data?.first_air_date ? 'tv' : 'movie') : rawType;

    // Check if item is already in watchlist
    useEffect(() => {
        const checkStatus = async () => {
            if (data?.id) {
                try {
                    const list = await fetchWatchlist(user?.uid);
                    const exists = list.some((item) => Number(item.id) === Number(data.id) || item.id === `${mediaType}-${data.id}`);
                    setInWatchlist(exists);
                } catch (e) {
                    console.error("Watchlist check error:", e);
                }
            }
        };
        checkStatus();
    }, [user?.uid, data?.id, mediaType, fetchWatchlist]);

    const handleWatchlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const nextState = !(inWatchlist || isWatchlist);
        setInWatchlist(nextState); // Optimistic instant UI update
        setActionLoading(true);

        try {
            if (!nextState) {
                await removeFromWatchlist(user?.uid, data, mediaType);
                toast.success('Removed from watchlist');
            } else {
                await addToWatchlist(user?.uid, data, mediaType);
                toast.success('Added to watchlist');
            }
        } catch (error) {
            setInWatchlist(!nextState); // Revert on error
            toast.error('Failed to update watchlist');
        } finally {
            setActionLoading(false);
        }
    };

    const widthClasses = isGrid
        ? 'w-full h-full min-h-[240px] sm:min-h-[290px]'
        : isSmall
        ? 'min-w-[150px] max-w-[150px] h-[230px] sm:min-w-[190px] sm:max-w-[190px] sm:h-[290px] md:min-w-[210px] md:max-w-[210px] md:h-[320px]'
        : 'min-w-[210px] max-w-[210px] h-[320px]';

    const imgHeightClasses = isGrid
        ? 'aspect-[2/3] w-full'
        : isSmall
        ? 'h-[175px] sm:h-[230px] md:h-[260px]'
        : 'h-[260px]';

    return (
        <Link to={`/${mediaType}/${data?.id}`} className={isGrid ? 'w-full' : ''}>
            <div className={`group/card relative ${widthClasses} cursor-pointer rounded-xl hover:scale-105 transition-all duration-300 ease-in-out border border-transparent hover:border-gray-700 shadow-lg overflow-hidden bg-[#14213d] flex flex-col justify-between`}>
                
                {/* Poster Image */}
                {data?.poster_path ? (
                    <img
                        src={getImageUrl('w500', data?.poster_path)}
                        alt={data?.title || data?.name || 'movie-poster'}
                        className={`${imgHeightClasses} w-full object-cover rounded-t-xl bg-[#14213d]`}
                        loading="lazy"
                    />
                ) : (
                    <div className={`${imgHeightClasses} w-full flex justify-center items-center bg-[#14213d] rounded-t-xl text-xs text-gray-400 text-center px-2`}>
                        No Image found
                    </div>
                )}

                {/* Info Footer */}
                <div className="bg-[#0f172a] px-3 py-2 rounded-b-xl w-full flex flex-col justify-between">
                    <h3 className="font-bold text-sm text-white text-ellipsis line-clamp-1 group-hover/card:text-red-400 transition-colors">
                        {data?.name || data?.title}
                    </h3>

                    <div className="flex justify-between items-center text-xs text-gray-400 mt-1 font-medium">
                        <div className="flex items-center gap-1.5">
                            <span className="text-[10px] uppercase font-bold text-gray-300 bg-slate-800 px-1.5 py-0.5 rounded border border-gray-700/60">
                                {mediaType === 'tv' ? 'TV' : 'Movie'}
                            </span>
                            <span>
                                {moment(data.release_date || data.first_air_date).format('YYYY') !== 'Invalid date'
                                    ? moment(data.release_date || data.first_air_date).format('YYYY')
                                    : ''}
                            </span>
                        </div>

                        <span className="bg-slate-800 text-yellow-400 px-1.5 py-0.5 rounded text-[11px] font-bold">
                            {data?.vote_average > 0 ? Number(data.vote_average).toFixed(1) : 'N/A'}
                        </span>
                    </div>
                </div>

                {/* Trending Badge */}
                {isTrending && (
                    <div className="absolute top-2 left-0 bg-red-600/90 text-white font-bold text-xs px-3 py-1 rounded-r-full shadow-md backdrop-blur-sm z-10">
                        #{index} Trending
                    </div>
                )}

                {/* Media Type Badge (when not trending) */}
                {!isTrending && (
                    <div className="absolute top-2.5 left-2.5 bg-black/75 backdrop-blur-md text-gray-200 border border-gray-700/60 font-semibold text-[10px] uppercase px-2 py-0.5 rounded-md shadow-md z-10">
                        {mediaType === 'tv' ? 'TV Show' : 'Movie'}
                    </div>
                )}

                {/* Hover Quick Watchlist Button */}
                <button
                    onClick={handleWatchlistToggle}
                    disabled={actionLoading}
                    title={inWatchlist || isWatchlist ? 'Remove from Watchlist' : 'Add to Watchlist'}
                    className={`absolute top-2.5 right-2.5 p-2 rounded-full backdrop-blur-md transition-all duration-200 z-10 cursor-pointer shadow-md ${
                        inWatchlist || isWatchlist
                            ? 'bg-slate-900/95 text-amber-400 border border-amber-400/50 opacity-100 scale-100'
                            : 'bg-black/60 hover:bg-slate-800 text-white opacity-0 group-hover/card:opacity-100 scale-95 hover:scale-110'
                    }`}
                >
                    {inWatchlist || isWatchlist ? <FaBookmark size={13} className="text-amber-400" /> : <FaRegBookmark size={13} />}
                </button>
            </div>
        </Link>
    );
};

export default PosterCard;