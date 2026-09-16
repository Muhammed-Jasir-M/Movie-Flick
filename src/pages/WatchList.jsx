import React, { useEffect, useState } from 'react'
import { useWatchlistContext } from '../store/watchlistContext';
import { useAuthContext } from '../store/authContext';
import PosterCard from '../components/PosterCard';
import Spinner from '../components/Spinner';

const WatchList = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const { fetchWatchlist } = useWatchlistContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchWatchlist(user.uid);
                setWatchlist(response);
            } catch (error) {
                console.error("Failed to fetch watchlist:", error);
            }finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchData();
        }
    }, [user, fetchWatchlist]);

    if (loading) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <Spinner borderColor={'border-white'} />
            </div>
        );
    }

    if (!loading && watchlist.length === 0) {
        return (
            <div className='w-full min-h-screen flex items-center justify-center'>
                <h2 className='text-xl'>Your watchlist is empty.</h2>
            </div>
        );
    }

    return (
        <section className='container mx-auto min-h-[800px] md:min-h-screen flex flex-col items-center pt-20'>
            <h1 className='text-3xl font-bold py-3'>Watchlist</h1>
            <div className='flex'>
                <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-2.5 md:gap-x-5 gap-y-3 md:gap-y-5 pt-5 pb-5 w-full px-1.5 md:px-4'>
                    {
                        watchlist.map((item, index) => (
                            <PosterCard
                                key={index}
                                data={item}
                                type={item.type}
                                isSmall
                                isWatchlist
                                user={user}
                            />
                        ))
                    }
                </div>
            </div>
        </section>
    )
}

export default WatchList