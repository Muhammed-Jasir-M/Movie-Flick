import React, { useCallback, useEffect, useRef, useState } from 'react'
import axiosInstance from '../services/axios';
import PosterCard from '../components/PosterCard';
import Spinner from '../components/Spinner';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';

const SearchPage = () => {
    const [activeTab, setActiveTab] = useState('multi');
    const [search, setSearch] = useState('');
    const [medias, setMedias] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [loadingMore, setLoadingMore] = useState(false);

    const searchTimer = useRef(null);

    const fetchData = useCallback(async () => {
        if (page > 1) {
            setLoadingMore(true);
        } else {
            setLoading(true);
        }

        try {
            const response = await axiosInstance.get(`/search/${activeTab}`, {
                params: {
                    query: search,
                    page: page,
                }
            });
            
            let results;

            if (activeTab === 'multi') {
                results = response.data.results.filter((result) => result.media_type !== 'person');
            } else {
                results = response.data.results;
            }

            setMedias((prev) => [...prev, ...results]);

            setTotalPages(response.data.total_pages);
        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
            setLoadingMore(false);
        }
    }, [activeTab, page, search]);

    const handleScroll = useCallback(() => {
        if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight  && page < totalPages) {
            setPage((prev) => prev + 1);
        }
    }, [page, totalPages]);

    useEffect(() => {
        if (search.trim().length > 0) {
            fetchData();
        } else {
            setMedias([]);
            setPage(1);
            setTotalPages(0);
        }
    }, [search, fetchData]);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [handleScroll]);

    const handleSearch = (e) => {
        const value = e.target.value;

        clearTimeout(searchTimer.current);

        searchTimer.current = setTimeout(() => {
            setSearch(value);
            setPage(1);
            setMedias([]);
        }, 20);
    };

    const handleTabClick = (tab) => {
        setActiveTab(tab);
        setMedias([]);
        setPage(1);
    }

    return (
        <section className='container mx-auto min-h-[800px] md:min-h-screen flex flex-col items-center pt-20 pb-4 w-full'>
            <div className='pt-3 flex items-center gap-2'>
                <button
                    className={`py-1 px-4 rounded ${activeTab === 'multi' ? 'bg-red-600' : 'bg-blue-600'} hover:bg-red-700`}
                    onClick={() => handleTabClick('multi')}
                >
                    All
                </button>
                <button
                    className={`py-1 px-3 rounded ${activeTab === 'movie' ? 'bg-red-600' : 'bg-blue-600'} hover:bg-red-700`}
                    onClick={() => handleTabClick('movie')}
                >
                    Movies
                </button>
                <button
                    className={`py-1 px-3 rounded ${activeTab === 'tv' ? 'bg-red-600' : 'bg-blue-600'} hover:bg-red-700`}
                    onClick={() => handleTabClick('tv')}
                >
                    Tv Shows
                </button>
            </div>
            
            <form className='flex justify-center items-center pt-3 px-2.5 sm:px-5 w-full'>
                <input
                    type='text'
                    placeholder={`Search for ${activeTab === 'multi' ? 'movies & tv shows' : activeTab === 'tv' ? 'tv shows' : 'movies'}`}
                    className='max-w-xl w-full h-12 px-5 py-3 rounded-md bg-[#14213d] text-[#ffffff] text-lg outline-none shadow-md'
                    onChange={handleSearch}
                    value={search}
                />
            </form>

            <div className='flex flex-col justify-center items-center w-full'>
                {
                    loading ? (
                        <PosterCardSkeleton count={12} />
                    ) : medias.length > 0 ? (
                        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2.5 md:gap-x-5 gap-y-3 md:gap-y-5 pt-5 pb-5 w-full px-1.5 md:px-4'>
                            {
                                medias.map((data, index) => (
                                    <PosterCard
                                        key={index}
                                        data={data}
                                        type={activeTab === 'multi' ? data.media_type : activeTab}
                                        isSmall
                                    />
                                ))
                            }
                        </div>
                    ) : search.length > 0 && (
                        <div className='flex flex-col items-center py-10'>
                            <h2 className='text-2xl text-white'>No results found</h2>
                            <p className='text-white mt-2'>Try searching for something else.</p>
                        </div>
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
        </section >
    )
}

export default SearchPage