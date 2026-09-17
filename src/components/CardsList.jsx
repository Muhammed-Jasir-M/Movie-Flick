import React, { useCallback, useEffect, useRef, useState } from 'react';
import axiosInstance from '../services/axios';
import PosterCard from './PosterCard';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { Link } from 'react-router-dom';
import { SliderSkeleton } from './SkeletonLoaders';

const CardsList = ({ endpoint, title, isTrending, type, genreId }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchByCategory = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${endpoint}`);
            setData(response.data.results);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    }, [endpoint]);

    const fetchByGenreId = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`/discover/${type}`, {
                params: {
                    with_genres: genreId,
                    sort_by: 'popularity.desc',
                },
            });
            setData(response.data.results);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    }, [genreId, type]);

    useEffect(() => {
        if (genreId) {
            fetchByGenreId();
        } else {
            fetchByCategory();
        }
    }, [genreId, fetchByCategory, fetchByGenreId]);

    const sliderRef = useRef(null);

    const handleScrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -sliderRef.current.offsetWidth * 0.75,
                behavior: "smooth"
            });
        }
    };

    const handleScrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: sliderRef.current.offsetWidth * 0.75,
                behavior: "smooth"
            });
        }
    };

    return (
        <section className="flex flex-col group relative px-2 sm:px-4 md:px-8 lg:px-12 my-3">
            {data.length > 0 && (
                <div className="flex justify-between items-center bg-[#14213d] py-3 px-4 sm:px-6 rounded-xl mb-3 shadow-md">
                    <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-white tracking-wide">
                        {title && title}
                    </h2>

                    <Link to={`/explore/${type || 'all'}/${title.toLowerCase().replace(/\s+/g, '-')}`} state={{ endpoint, genreId }}>
                        <h5 className="text-xs md:text-sm font-semibold border border-white/30 rounded-full px-3.5 py-1.5 cursor-pointer whitespace-nowrap hover:bg-white hover:text-black transition-all shadow-sm">
                            View more
                        </h5>
                    </Link>
                </div>
            )}

            {loading ? (
                <SliderSkeleton count={6} />
            ) : (
                <div className="relative group/slider">
                    {/* Left Overlay Scroll Arrow */}
                    <button
                        className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-r-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer border-y border-r border-white/20 shadow-xl"
                        onClick={handleScrollLeft}
                        aria-label="Scroll left"
                    >
                        <BiChevronLeft size={28} />
                    </button>

                    {/* Movie Cards Container */}
                    <div
                        className="flex gap-4 overflow-x-auto scrollbar-hide py-2 md:py-3 scroll-smooth"
                        ref={sliderRef}
                    >
                        {data.length > 0 &&
                            data.map((item, index) => (
                                <PosterCard
                                    key={`${item.id}-${index}`}
                                    data={item}
                                    index={index + 1}
                                    isTrending={isTrending}
                                    type={item?.media_type || type || 'movie'}
                                />
                            ))}
                    </div>

                    {/* Right Overlay Scroll Arrow */}
                    <button
                        className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/60 hover:bg-black/90 text-white p-2.5 rounded-l-xl opacity-0 group-hover/slider:opacity-100 transition-all duration-300 backdrop-blur-md cursor-pointer border-y border-l border-white/20 shadow-xl"
                        onClick={handleScrollRight}
                        aria-label="Scroll right"
                    >
                        <BiChevronRight size={28} />
                    </button>
                </div>
            )}
        </section>
    );
};

export default CardsList;