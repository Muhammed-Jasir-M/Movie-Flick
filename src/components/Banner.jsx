import React, { useEffect, useState } from 'react'
import axiosInstance from '../services/axios';
import { getImageUrl } from '../constants/constants';
import { Link } from 'react-router-dom';

import { FaPlay, FaRegCalendarAlt, FaStar } from 'react-icons/fa';
import { MdInfoOutline } from 'react-icons/md';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { Keyboard, Autoplay, Pagination, Navigation } from 'swiper/modules';

import { BannerSkeleton } from './SkeletonLoaders';
import moment from 'moment';

const Banner = (mediaType) => {
    const [trendingData, setTrendingData] = useState([]);
    const [loading, setLoading] = useState(false);

    const path = window.location.pathname;

    const fetchTrendingAll = async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get("trending/all/week");
            const filteredData = response.data.results.filter(item => item.media_type !== 'person');
            setTrendingData(filteredData);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    };

    const fetchTrending = async (type, time) => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`trending/${type}/${time}`);
            setTrendingData(response.data.results);
        } catch (error) {
            console.error("Error fetching trending data:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (path.includes('/movies')) {
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
        <div className='flex overflow-hidden'>
            <Swiper
                style={{
                    "--swiper-pagination-color": "#FFBA08",
                    "--swiper-pagination-bullet-inactive-color": "#999999",
                    "--swiper-pagination-bullet-inactive-opacity": "1",
                    "--swiper-pagination-bullet-size": "8px",
                    "--swiper-pagination-bullet-horizontal-gap": "2px"
                }}
                spaceBetween={30}
                centeredSlides={true}
                grabCursor={false}
                lazy={{ loadPrevNext: true }}
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                }}
                keyboard={{
                    enabled: true,
                }}
                pagination={{
                    clickable: true,
                }}
                navigation={false}
                modules={[Keyboard, Autoplay, Pagination, Navigation]}
            >
                {
                    trendingData.map((data, index) => (
                        <SwiperSlide key={index}>
                            <div
                                className='relative min-w-full h-[535px] sm:h-[675px] md:h-[610px] transition-all duration-300 ease-linear'
                            >
                                <img
                                    src={getImageUrl('original', data?.backdrop_path)}
                                    alt={data?.title || data?.name || 'banner-image'}
                                    className='w-full h-full object-cover bg-[#0a1128] cursor-pointer rounded-xl'
                                    loading="lazy"
                                />

                                <div className="swiper-lazy-preloader swiper-lazy-preloader-white"></div>

                                <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black"></div>

                                <div className='absolute bottom-20 flex flex-col gap-5 max-w-full md:max-w-xl mx-5 md:mx-20 text-center md:text-left'>
                                    <h1 className='text-4xl lg:text-5xl font-bold'>
                                        {data?.title || data?.name}
                                    </h1>

                                    <p className='text-lg font-semibold line-clamp-3 md:line-clamp-4 text-ellipsis'>
                                        {data?.overview}
                                    </p>

                                    <div className='flex gap-3 text-base font-medium justify-center md:justify-start'>
                                        <p className='flex items-center gap-1 drop-shadow-md'>
                                            <FaStar />
                                            {data.vote_average > 0 ? Number(data?.vote_average).toFixed(1) : 'N/A'}
                                        </p>

                                        <p className='flex items-center gap-1 drop-shadow-md'>
                                            <FaRegCalendarAlt />
                                            {moment(data?.release_date || data?.first_air_date).format('YYYY')}
                                        </p>
                                    </div>

                                    <div className='flex gap-3 justify-center md:justify-start'>
                                        <Link to={`/player/${data?.media_type || mediaType}/${data?.id}`}>
                                            <button className='flex items-center px-6 sm:px-8 py-2 gap-2 text-lg font-semibold cursor-pointer bg-white text-black rounded hover:bg-[#ffffffbf] whitespace-nowrap hover:scale-105 transition-transform duration-300 ease-in-out'>
                                                <FaPlay />
                                                Play
                                            </button>
                                        </Link>

                                        <Link to={`/${data?.media_type || mediaType}/${data?.id}`}>
                                            <button className='flex items-center px-4 sm:px-6 py-2 gap-2 text-lg font-semibold cursor-pointer bg-[#6d6d6eb3] text-white rounded hover:bg-[#6d6d6e66] whitespace-nowrap hover:scale-105 transition-transform duration-300 ease-in-out'>
                                                <MdInfoOutline className='text-2xl' />
                                                More Info
                                            </button>
                                        </Link>
                                    </div>
                                </div>

                                <div className='absolute bottom-20 right-40 hidden lg:block min-w-[250px] max-w-[250px]'>
                                    <img
                                        src={getImageUrl('w500', data?.poster_path)}
                                        alt={data?.title || data?.name || 'poster-image'}
                                        className='w-full h-[380px] object-cover rounded-md shadow-md'
                                    />
                                </div>
                            </div>
                        </SwiperSlide>
                    ))
                }
            </Swiper>
        </div>
    )
}

export default Banner
