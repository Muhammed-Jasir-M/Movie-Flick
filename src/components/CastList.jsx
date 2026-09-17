import React, { useCallback, useEffect, useState } from 'react'
import axiosInstance from '../services/axios';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl } from '../constants/constants';
import { CastSkeleton } from './SkeletonLoaders';

const CastList = () => {
    const [casts, setCasts] = useState([]);
    const [crews, setCrews] = useState([]);

    const [loading, setLoading] = useState(false);

    const { type, id } = useParams();

    const fetchData = useCallback(async () => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(`/${type}/${id}/credits`);

            if (response) {
                setCasts(response.data.cast);
                setCrews(response.data.crew);
            }

        } catch (error) {
            console.error("Error fetching:", error);
        } finally {
            setLoading(false);
        }
    }, [id, type]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <section className='px-1'>
            {
                loading ? (
                    <div className="pt-2 md:pt-[120px]">
                        <CastSkeleton count={8} />
                    </div>
                ) : (
                    <div className='pt-2 md:pt-[148px] overflow-hidden'>
                        {casts.length > 0 && (
                            <div className='px-0.5 md:px-8'>
                                <h1 className='text-xl mb-1.5 px-1'>
                                    Casts
                                </h1>

                                <div className='flex gap-2.5 overflow-x-auto scrollbar-hide pb-2 pt-1 px-1 mx-3'>
                                    {
                                        casts.map((cast, index) => (
                                            <Link
                                                to={`/person/${cast?.id}`}
                                                key={`${cast?.id}-${index}`}
                                                className='relative h-[196px] min-w-[140px] max-w-[140px] cursor-pointer hover:scale-105 transition-all ease-in-out duration-300'
                                            >
                                                {
                                                    cast?.profile_path ? (
                                                        <img
                                                            src={getImageUrl('w500', cast?.profile_path)}
                                                            alt={cast?.name}
                                                            className='h-[160px] w-full rounded-t-md object-cover bg-[#14213d]'
                                                        />
                                                    ) : (
                                                        <div className={`h-[160px] w-full flex justify-center items-center bg-[#14213d] rounded-t-md shadow-md text-xs text-center text-gray-400 px-1`}>
                                                            No Image found
                                                        </div>
                                                    )
                                                }

                                                <div className='bg-black/70 w-full rounded-b-md px-1 h-9'>
                                                    <h3 className='text-sm font-semibold text-ellipsis line-clamp-1 text-center'>
                                                        {cast?.name}
                                                    </h3>

                                                    <p className='text-xs font-medium line-clamp-1 text-ellipsis text-center text-gray-300'>
                                                        {cast?.character}
                                                    </p>
                                                </div>
                                            </Link>
                                        ))
                                    }
                                </div>
                            </div>
                        )}

                        {crews.length > 0 && (
                            <div className='px-0.5 md:px-8'>
                                <h1 className='text-xl mb-1.5 px-1'>
                                    Crews
                                </h1>

                                <div className='flex gap-2.5 overflow-x-auto scrollbar-hide pt-2 px-1 mx-3 pb-2'>
                                    {
                                        crews.map((crew, index) => (
                                            <Link
                                                to={`/person/${crew?.id}`}
                                                key={`${crew?.id}-${index}`}
                                                className='h-[196px] min-w-[140px] max-w-[140px] cursor-pointer hover:scale-105 transition-all ease-in-out duration-300'
                                            >
                                                {
                                                    crew?.profile_path ? (
                                                        <img
                                                            src={getImageUrl('w500', crew?.profile_path)}
                                                            alt={crew?.name}
                                                            className='h-[160px] w-full rounded-t-md object-cover bg-[#14213d]'
                                                        />
                                                    ) : (
                                                        <div className={`h-[160px] w-full flex justify-center items-center bg-[#14213d] rounded-t-md shadow-md text-xs text-center text-gray-400 px-1`}>
                                                            No Image found
                                                        </div>
                                                    )
                                                }

                                                <div className='bg-black/70 w-full rounded-b-md h-9 px-1'>
                                                    <h3 className='text-sm font-semibold text-ellipsis line-clamp-1 text-center'>
                                                        {crew?.name}
                                                    </h3>

                                                    <p className='text-xs font-medium line-clamp-1 text-ellipsis text-center text-gray-300'>
                                                        {crew?.job}
                                                    </p>
                                                </div>
                                            </Link>

                                        ))
                                    }
                                </div>
                            </div>
                        )}
                    </div>
                )
            }
        </section>
    )
}

export default CastList