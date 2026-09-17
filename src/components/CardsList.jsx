import React, { useCallback, useEffect, useRef, useState } from 'react'
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

    const sliderRef = useRef(null)

    const handleScrollLeft = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: -sliderRef.current.offsetWidth / 2,
                behavior: "smooth"
            })
        }
    }

    const handleScrollRight = () => {
        if (sliderRef.current) {
            sliderRef.current.scrollBy({
                left: sliderRef.current.offsetWidth / 2,
                behavior: "smooth"
            })
        }
    }

    return (
        <section className='flex flex-col group'>
            {data.length > 0 && (
                <div className='flex justify-between items-center bg-[#14213d] py-2 px-1.5 sm:px-2 md:px-4 rounded-md my-3 mx-1 md:mx-3'>
                    <h2 className='text-[18px] sm:text-xl md:text-2xl font-semibold pt-3 mb-3 whitespace-nowrap'>
                        {title && title}
                    </h2>

                    <Link to={`/explore/${type || 'all'}/${title.toLowerCase().replace(/\s+/g, '-')}`} state={{endpoint, genreId}}>
                        <h5 className='text-xs md:text-lg font-medium border-2 rounded-full px-1.5 py-1 md:px-2.5 md:py-1 cursor-pointer whitespace-nowrap hover:bg-white hover:text-black'>
                            View more
                        </h5>
                    </Link>
                </div>
            )}

            {
                loading ? (
                    <SliderSkeleton count={6} />
                ) : (
                    <div className='flex flex-col'>
                        <div className='flex gap-5 overflow-x-auto scrollbar-hide mx-2 md:mx-3 px-1.5 py-2 md:py-3 overflow-hidden' ref={sliderRef}>
                            {data.length > 0 && data.map((data, index) => (
                                <PosterCard
                                    key={index}
                                    data={data}
                                    index={index + 1}
                                    isTrending={isTrending}
                                    type={data?.media_type || type} />
                            ))}
                        </div>

                        <div className='hidden group-hover:flex justify-center items-center gap-5 pt-3'>
                            <button
                                className={`px-1 py-1 bg-gray-500/70 hover:bg-gray-500 rounded`}
                                onClick={handleScrollLeft}
                            >
                                <BiChevronLeft size={28} />
                            </button>

                            <button
                                className={`px-1 py-1 bg-gray-500/70 hover:bg-gray-500 rounded`}
                                onClick={handleScrollRight}
                            >
                                <BiChevronRight size={28} />
                            </button>
                        </div>
                    </div>
                )
            }
        </section>
    )
}

export default CardsList