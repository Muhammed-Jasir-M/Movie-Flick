import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../services/axios';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl } from '../constants/constants';
import { FaBookmark, FaPlay, FaRegBookmark, FaRegCalendarAlt, FaRegClock, FaStar } from 'react-icons/fa';
import moment from 'moment';
import { BiCameraMovie } from 'react-icons/bi';
import { useWatchlistContext } from '../store/watchlistContext';
import { useAuthContext } from '../store/authContext';
import { toast } from 'react-toastify';
import { DetailsSkeleton } from './SkeletonLoaders';

const DetailsInfo = () => {
    const [mediaData, setMediaData] = useState({});
    const [loading, setLoading] = useState(false);
    const [isInWatchlist, setIsInWatchlist] = useState(false);
    console.log(typeof mediaData?.budget, typeof mediaData?.revenue);

    const { addToWatchlist, removeFromWatchlist, fetchWatchlist } = useWatchlistContext();
    const { user } = useAuthContext();

    const { type, id } = useParams();

    const runtime = mediaData?.runtime || mediaData?.last_episode_to_air?.runtime || mediaData?.episode_run_time?.[0];

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/${type}/${id}`);
            setMediaData(response.data);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    }, [id, type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        const checkWatchlistStatus = async () => {
            const watchlist = await fetchWatchlist(user.uid);
            const isInWatchlist = watchlist.some(item => item.id === mediaData.id);
            setIsInWatchlist(isInWatchlist);
        };

        if (user && mediaData.id) {
            checkWatchlistStatus();
        }
    }, [user, mediaData.id, fetchWatchlist]);

    const handleClick = async () => {
        setLoading(true);
        try {
            if (!user) {
                toast.error('you need to login');
            } else {
                setIsInWatchlist(!isInWatchlist);
                if (!isInWatchlist) {
                    await addToWatchlist(user.uid, mediaData, type);
                    toast.success('Added to watchlist');
                } else {
                    await removeFromWatchlist(user.uid, mediaData, type);
                    toast.success('Removed from watchlist');
                }
            }
        } catch (error) {
            console.log('Error removing from watchlist:', error);
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return <DetailsSkeleton />;
    }

    return (
        <div className='max-w-[1536px] mx-auto relative flex flex-col md:flex-row gap-8 md:gap-10 md:px-20'>
            <div
                className='absolute top-0 right-0 left-0 w-full h-[590px] md:h-[600px] max-w-[1536px] bg-cover bg-center bg-[#14213d] bg-no-repeat rounded-b-md'
                style={{
                    backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.7), rgba(0, 0, 0, 0.7)), url(${getImageUrl('original', mediaData?.backdrop_path)})`,
                    backgroundColor: '#14213d',
                }}
            ></div>

            <div className='pt-40 md:pt-32 flex flex-col items-center md:items-start gap-2'>
                <div className='min-w-[230px] max-w-[230px] relative'>
                    {mediaData && mediaData.poster_path ? (
                        <img
                            src={getImageUrl('w500', mediaData?.poster_path)}
                            alt={mediaData?.title || mediaData?.name}
                            className='h-[300px] w-full object-cover rounded-md drop-shadow-md'
                        />
                    ) : (
                        <div className={`h-[300px] w-full flex justify-center items-center bg-[#14213d] rounded-md drop-shadow-md`}>
                            No Image found
                        </div>
                    )}

                    <button className='absolute top-2.5 right-2.5 p-2.5 rounded-[50%] bg-gray-900 cursor-pointer' onClick={handleClick}>
                        {isInWatchlist ? <FaBookmark /> : <FaRegBookmark />}
                    </button>
                </div>

                <Link to={`/player/${type}/${id}`}>
                    {mediaData && (
                        <button className='flex items-center drop-shadow-md justify-center w-full py-2 gap-4 text-lg font-semibold cursor-pointer bg-white text-black rounded hover:bg-[#ffffffbf] whitespace-nowrap min-w-[230px] max-w-[230px] hover:scale-105 transition-transform duration-300 ease-in-out'>
                            <FaPlay />
                            Play Now
                        </button>
                    )}
                </Link>
            </div>

            <div className='pt-16 md:pt-32 flex flex-col gap-2 md:gap-2.5 px-3 md:px-0 py-3 md:py-0'>
                <h2 className='text-4xl font-bold w-full text-white drop-shadow-md text-center md:text-left'>
                    {mediaData?.title || mediaData?.name}
                </h2>

                {mediaData?.tagline && (
                    <p className='text-base font-medium text-gray-200 drop-shadow-md line-clamp-2 text-ellipsis text-center md:text-left'>
                        {mediaData?.tagline}
                    </p>
                )}

                <div className='flex flex-row gap-3 justify-center md:justify-normal text-base'>
                    {mediaData && (
                        <p className='flex items-center gap-1 drop-shadow-md'>
                            <FaStar />
                            {mediaData.vote_average > 0 ? Number(mediaData.vote_average).toFixed(1) : 'N/A'}
                        </p>
                    )}

                    {mediaData?.release_date && (
                        <p className='flex items-center gap-1 drop-shadow-md'>
                            <FaRegCalendarAlt />
                            {moment(mediaData?.release_date).format('MMM DD YYYY')}
                        </p>
                    )}

                    {mediaData && (
                        <p className='capitalize flex items-center gap-1 drop-shadow-md'>
                            <BiCameraMovie />
                            {`${type}`}
                        </p>
                    )}

                    {runtime && (
                        <p className='flex items-center gap-1 drop-shadow-md'>
                            <FaRegClock />
                            {runtime >= 60 ? `${Math.floor(runtime / 60)}h ${runtime % 60}m` : `${runtime}m`}
                        </p>
                    )}
                </div>

                {mediaData?.status && (
                    <p className='flex items-center gap-1 font-normal drop-shadow-md justify-center md:justify-normal'>
                        <span className='font-semibold'>Status: </span>
                        {mediaData.status}
                    </p>
                )}

                {(mediaData?.first_air_date && mediaData?.last_air_date) && (
                    <div className='flex flex-col md:flex-row items-center gap-3 justify-center md:justify-normal text-sm'>
                        <p className='flex items-center gap-1 drop-shadow-md'>
                            <span>First Aired: </span>
                            {moment(mediaData?.first_air_date).format('MMM DD YYYY')}
                        </p>
                        <p className='flex items-center gap-1 drop-shadow-md'>
                            <span>Last Aired: </span>
                            {moment(mediaData?.last_air_date).format('MMM DD YYYY')}
                        </p>
                    </div>
                )}

                {(mediaData?.number_of_seasons || mediaData?.number_of_episodes) && (
                    <div className='flex gap-2 items-center justify-center md:justify-start text-sm font-medium'>
                        {mediaData?.number_of_seasons && (
                            <p className='drop-shadow-md'>
                                Seasons: {mediaData?.number_of_seasons}
                            </p>
                        )}

                        {mediaData?.number_of_episodes && (
                            <p className='drop-shadow-md'>
                                Episodes: {mediaData?.number_of_episodes}
                            </p>
                        )}
                    </div>
                )}

                {mediaData.genres && (
                    <div className='flex flex-wrap justify-center md:justify-normal gap-2 w-full'>
                        {mediaData.genres.map((genre) => (
                            <div
                                key={genre.id}
                                className='drop-shadow-md px-1 md:px-4 py-0.5 bg-[#14213d] rounded-md text-xs md:text-sm font-semibold truncate'
                            >
                                {genre.name}
                            </div>
                        ))}
                    </div>
                )}

                <div className='flex flex-row items-center justify-center md:justify-normal gap-2 md:gap-3 text-sm'>
                    <p className='drop-shadow-md'>
                        <span className='font-semibold'>Budget: </span>
                        {mediaData?.budget > 0
                            ? mediaData?.budget.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
                            : 'N/A'}
                    </p>

                    <p className='drop-shadow-md'>
                        <span className='font-semibold'>Revenue: </span>
                        {mediaData?.revenue > 0
                            ? mediaData?.revenue.toLocaleString('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0 })
                            : 'N/A'}
                    </p>
                </div>

                {mediaData?.overview && (
                    <div className='pt-1 md:pt-0'>
                        <h3 className='text-xl leading-7 font-bold mb-2 md:mb-0.25 drop-shadow-md'>
                            Synopsis
                        </h3>

                        <p className='max-w-3xl text-sm text-white drop-shadow-md'>
                            {mediaData?.overview}
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}

export default DetailsInfo

