import React, { useCallback, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import axiosInstance from '../services/axios';
import Spinner from '../components/Spinner';
import PosterCard from '../components/PosterCard';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';

const ExplorePage = () => {
    const { state } = useLocation();
    const { endpoint, genreId } = state || {};

    const { type, title } = useParams();

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const fetchByCategory = useCallback(async () => {
        if (page > 1 && page <= totalPages) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await axiosInstance.get(`${endpoint}`, {
                params: {
                    page: page,
                }
            });

            setData((prev) => [...prev, ...response.data.results]);

            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [endpoint, page, totalPages]);

    const fetchByGenreId = useCallback(async () => {
        if (page > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await axiosInstance.get(`/discover/${type}`, {
                params: {
                    with_genres: genreId,
                    sort_by: 'popularity.desc',
                    page: page,
                },
            });

            setData((prev) => [...prev, ...response.data.results]);

            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [genreId, page, type]);

    const handleScroll = useCallback(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight && page < totalPages) {
            setPage((prev) => prev + 1);
        }
    }, [page, totalPages]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    useEffect(() => {
        if (genreId) {
            fetchByGenreId();
        } else {
            fetchByCategory();
        }
    }, [genreId, fetchByCategory, fetchByGenreId]);

    return (
        <section className='container mx-auto min-h-[800px] md:min-h-screen flex justify-center items-center'>
            <div className='pt-20'>
                {
                    loading ? (
                        <PosterCardSkeleton count={12} />
                    ) : (
                        <>
                            <div className='text-2xl md:text-3xl font-bold capitalize text-center py-3'>
                                {title.replace(/-/g, ' ')}
                            </div>

                            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2.5 md:gap-x-5 gap-y-3 md:gap-y-5 pt-5 pb-5 w-full px-1.5 md:px-4'>
                                {data.map((data, index) => (
                                    <PosterCard
                                        key={index}
                                        data={data}
                                        type={data.media_type || type}
                                        isSmall
                                    />
                                ))}
                            </div>
                        </>
                    )
                }

                {
                    loadingMore && (
                        <div className='flex justify-center py-10'>
                            <Spinner borderColor={'border-white'} />
                        </div>
                    )
                }
            </div>
        </section>
    )
}

export default ExplorePage