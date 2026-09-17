import React, { useEffect, useState } from 'react';
import tmdbApi from '../api/tmdbApi';
import { getImageUrl } from '../constants/constants';
import { Link } from 'react-router-dom';
import { FaPlay, FaRegCalendarAlt, FaStar, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';

import { BannerSkeleton } from './SkeletonLoaders';
import moment from 'moment';

const Banner = ({ mediaType }) => {
    const [trendingData, setTrendingData] = useState([]);
    const [loading, setLoading] = useState(false);

    const path = window.location.pathname;

    const fetchTrendingAll = async () => {
        setLoading(true);
        try {
            const data = await tmdbApi.getTrendingAll();
            setTrendingData(data);
        } catch (error) {
            console.error("Error fetching trending all:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async (type, time) => {
        setLoading(true);
        try {
            const data = await tmdbApi.getTrending(type, time);
            setTrendingData(data);
        } catch (error) {
            console.error("Error fetching trending data:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrendingAnime = async () => {
        setLoading(true);
        try {
            const res = await tmdbApi.getTrendingAnime();
            setTrendingData(res.results);
        } catch (error) {
            console.error("Error fetching anime banner:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (path.includes('/anime')) {
            fetchTrendingAnime();
        } else if (path.includes('/movies')) {
            fetchTrending('movie', 'week');
        } else if (path.includes('/tv')) {
            fetchTrending('tv', 'week');
        } else {
            fetchTrendingAll();
        }
    }, [path]);

    if (loading) {
        return <BannerSkeleton />;
    }

    return (
        <div className="relative group overflow-hidden rounded-xl">
            {/* Swiper Container */}
            <Swiper
                style={{
                    "--swiper-pagination-color": "#e50914",
                    "--swiper-pagination-bullet-inactive-color": "#ffffff",
                    "--swiper-pagination-bullet-inactive-opacity": "0.5",
                    "--swiper-pagination-bullet-size": "8px",
                    "--swiper-pagination-bullet-horizontal-gap": "3px"
                }}
                spaceBetween={30}
                centeredSlides={true}
                grabCursor={false}
                lazy={{ loadPrevNext: true }}
                autoplay={{
                    delay: 4000,
                    disableOnInteraction: false,
                }}
                keyboard={{
                    enabled: true,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={{
                    nextEl: '.banner-swiper-button-next',
                    prevEl: '.banner-swiper-button-prev',
                }}
                modules={[Keyboard, Autoplay, Pagination, Navigation]}
            >
                {trendingData.map((data, index) => (
                    <SwiperSlide key={index}>
                        <div className="relative min-w-full h-[535px] sm:h-[675px] md:h-[610px] transition-all duration-300 ease-linear">
                            <img
                                src={getImageUrl('original', data?.backdrop_path)}
                                alt={data?.title || data?.name || 'banner-image'}
                                className="w-full h-full object-cover bg-[#0a1128] cursor-pointer rounded-xl"
                                loading="lazy"
                            />

                            <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-black via-black/40 to-transparent"></div>

                            <div className="absolute bottom-20 flex flex-col gap-5 max-w-full md:max-w-xl mx-5 md:mx-16 text-center md:text-left z-10">
                                <h1 className="text-4xl lg:text-5xl font-extrabold text-white drop-shadow-lg">
                                    {data?.title || data?.name}
                                </h1>

                                <p className="text-sm md:text-base text-gray-200 line-clamp-3 md:line-clamp-4 text-ellipsis drop-shadow">
                                    {data?.overview}
                                </p>

                                <div className="flex gap-4 text-sm font-semibold justify-center md:justify-start text-white">
                                    <p className="flex items-center gap-1.5 drop-shadow-md">
                                        <FaStar className="text-yellow-400" />
                                        {data.vote_average > 0 ? Number(data?.vote_average).toFixed(1) : 'N/A'}
                                    </p>

                                    <p className="flex items-center gap-1.5 drop-shadow-md">
                                        <FaRegCalendarAlt />
                                        {moment(data?.release_date || data?.first_air_date).format('YYYY')}
                                    </p>
                                </div>

                                <div className="flex gap-3 justify-center md:justify-start">
                                    <Link to={`/player/${data?.media_type || mediaType || 'movie'}/${data?.id}`}>
                                        <button className="flex items-center px-6 sm:px-8 py-2.5 gap-2 text-base font-bold cursor-pointer bg-white text-black rounded-xl hover:bg-gray-200 whitespace-nowrap hover:scale-105 transition-all duration-300 ease-in-out shadow-lg">
                                            <FaPlay />
                                            Play
                                        </button>
                                    </Link>

                                    <Link to={`/${data?.media_type || mediaType || 'movie'}/${data?.id}`}>
                                        <button className="flex items-center px-5 sm:px-6 py-2.5 gap-2 text-base font-bold cursor-pointer bg-gray-600/70 text-white rounded-xl hover:bg-gray-600/90 whitespace-nowrap hover:scale-105 transition-all duration-300 ease-in-out backdrop-blur-md">
                                            <MdInfoOutline className="text-xl" />
                                            More Info
                                        </button>
                                    </Link>
                                </div>
                            </div>

                            <div className="absolute bottom-20 right-24 hidden lg:block min-w-[240px] max-w-[240px] z-10">
                                <img
                                    src={getImageUrl('w500', data?.poster_path)}
                                    alt={data?.title || data?.name || 'poster-image'}
                                    className="w-full h-[360px] object-cover rounded-xl shadow-2xl border border-gray-800"
                                />
                            </div>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>

            {/* Custom Banner Side Navigation Buttons */}
            <button className="banner-swiper-button-prev absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20">
                <FaChevronLeft size={18} />
            </button>
            <button className="banner-swiper-button-next absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-black/80 text-white p-3.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer border border-white/20">
                <FaChevronRight size={18} />
            </button>
        </div>
    );
};

export default Banner;
