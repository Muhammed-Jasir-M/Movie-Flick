import React, { useEffect, useState } from 'react';
import { useWatchlistContext } from '../store/watchlistContext';
import { useAuthContext } from '../store/authContext';
import PosterCard from '../components/PosterCard';
import { PosterCardSkeleton } from '../components/SkeletonLoaders';
import { Link } from 'react-router-dom';

const WatchList = () => {
    const [watchlist, setWatchlist] = useState([]);
    const [loading, setLoading] = useState(false);

    const { fetchWatchlist } = useWatchlistContext();
    const { user } = useAuthContext();

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetchWatchlist(user?.uid);
                setWatchlist(response || []);
            } catch (error) {
                console.error("Failed to fetch watchlist:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [user?.uid, fetchWatchlist]);

    if (loading) {
        return (
            <div className="container mx-auto min-h-screen pt-24 px-4">
                <h1 className="text-3xl font-extrabold text-white py-3 text-center">My Watchlist</h1>
                <PosterCardSkeleton count={12} />
            </div>
        );
    }

    return (
        <section className="container mx-auto min-h-[800px] md:min-h-screen flex flex-col items-center pt-24 pb-12 px-4">
            <h1 className="text-3xl sm:text-4xl font-black text-white py-3">My Watchlist</h1>



            {watchlist.length === 0 ? (
                <div className="w-full py-24 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-full bg-[#14213d] border border-gray-800 flex items-center justify-center mb-4 text-gray-400">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-2">Your watchlist is empty</h2>
                    <p className="text-sm text-gray-400 max-w-sm mb-6">
                        Explore movies & TV shows and click the bookmark icon to save them for later.
                    </p>
                    <Link
                        to="/home"
                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-xl transition-colors shadow-lg"
                    >
                        Browse Movies
                    </Link>
                </div>
            ) : (
                <div className="w-full">
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-5 gap-y-4 pt-4 pb-4 w-full">
                        {watchlist.map((item, index) => (
                            <PosterCard
                                key={`${item.id}-${index}`}
                                data={item}
                                type={item.type || 'movie'}
                                isSmall
                                isWatchlist
                                user={user}
                            />
                        ))}
                    </div>
                </div>
            )}
        </section>
    );
};

export default WatchList;