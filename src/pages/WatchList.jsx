import React, { useEffect, useState, useMemo } from "react";
import { useWatchlistContext } from "../store/watchlistContext";
import { useAuthContext } from "../store/authContext";
import PosterCard from "../components/PosterCard";
import { PosterCardSkeleton } from "../components/SkeletonLoaders";
import { Link } from "react-router-dom";
import { BsBookmarkFill } from "react-icons/bs";
import { FaTrash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useWatchlistQuery } from "../hooks/useTmdbQueries";

const WatchList = () => {
  const [activeTab, setActiveTab] = useState("all"); // all, movie, tv
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const { fetchWatchlist, removeFromWatchlist } = useWatchlistContext();
  const { user } = useAuthContext();

  const { data: watchlist = [], isLoading: loading, refetch } = useWatchlistQuery(user?.uid, fetchWatchlist);

  useEffect(() => {
    if (showClearConfirm) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showClearConfirm]);

  // Count statistics
  const movieCount = useMemo(
    () =>
      watchlist.filter((item) => item.type === "movie" || !item.type).length,
    [watchlist],
  );
  const tvCount = useMemo(
    () => watchlist.filter((item) => item.type === "tv").length,
    [watchlist],
  );

  // Filtered list based on activeTab
  const filteredList = useMemo(() => {
    if (activeTab === "movie")
      return watchlist.filter((item) => item.type === "movie" || !item.type);
    if (activeTab === "tv")
      return watchlist.filter((item) => item.type === "tv");
    return watchlist;
  }, [watchlist, activeTab]);

  const handleClearAll = async () => {
    try {
      for (const item of watchlist) {
        await removeFromWatchlist(user?.uid, item, item.type || "movie");
      }
      refetch();
      setShowClearConfirm(false);
      toast.success("Watchlist cleared");
    } catch (error) {
      toast.error("Failed to clear watchlist");
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto min-h-screen pt-24 px-4 max-w-7xl">
        <div className="flex flex-col items-center mb-8">
          <h1 className="text-3xl font-black text-white text-center">
            My Watchlist
          </h1>
        </div>
        <PosterCardSkeleton count={12} />
      </div>
    );
  }

  return (
    <section className="container mx-auto min-h-[800px] md:min-h-screen flex flex-col items-center pt-24 pb-16 px-4 max-w-7xl">
      {/* Header Title & Badge */}
      <div className="flex flex-col items-center text-center mb-6">
        <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-xl">
          <BsBookmarkFill size={24} />
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">
          My Watchlist
        </h1>
        <p className="text-xs sm:text-sm text-gray-400 mt-1">
          {watchlist.length === 1
            ? "1 title saved"
            : `${watchlist.length} titles saved`}
        </p>
      </div>

      {watchlist.length > 0 && (
        /* Filter Controls & Action Bar */
        <div className="w-full flex flex-wrap items-center justify-between gap-4 mb-6 bg-[#14213d]/60 p-3.5 rounded-2xl border border-gray-800 shadow-lg">
          {/* Category Filter Tabs */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab("all")}
              className={`py-1.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "all"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              All ({watchlist.length})
            </button>
            <button
              onClick={() => setActiveTab("movie")}
              className={`py-1.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "movie"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              Movies ({movieCount})
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`py-1.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
                activeTab === "tv"
                  ? "bg-amber-400 text-slate-950 shadow-md"
                  : "bg-slate-800 text-gray-300 hover:bg-slate-700"
              }`}
            >
              TV Series ({tvCount})
            </button>
          </div>

          {/* Clear All Watchlist Button */}
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 text-xs font-bold text-red-400 hover:text-red-300 bg-red-950/40 hover:bg-red-900/60 rounded-xl border border-red-900/50 transition-all cursor-pointer ml-auto"
          >
            <FaTrash size={12} />
            <span>Clear All</span>
          </button>
        </div>
      )}

      {/* Empty Watchlist State */}
      {watchlist.length === 0 ? (
        <div className="w-full py-20 flex flex-col items-center justify-center text-center px-4">
          <div className="w-16 h-16 rounded-full bg-[#14213d] border border-gray-800 flex items-center justify-center mb-4 text-gray-400 shadow-xl">
            <BsBookmarkFill size={28} />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">
            Your watchlist is empty
          </h2>
          <p className="text-sm text-gray-400 max-w-sm mb-6 leading-relaxed">
            Explore movies & TV shows and click the bookmark icon to save them
            for quick viewing anytime.
          </p>
          <Link
            to="/home"
            className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl transition-all shadow-lg hover:shadow-red-600/30"
          >
            Browse Movies & Shows
          </Link>
        </div>
      ) : filteredList.length === 0 ? (
        /* Empty Filtered Category State */
        <div className="py-16 text-center">
          <p className="text-gray-400 text-base font-semibold">
            No {activeTab === "movie" ? "movies" : "TV shows"} in your
            watchlist.
          </p>
        </div>
      ) : (
        /* Watchlist Grid */
        <div className="w-full">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-x-3 md:gap-x-5 gap-y-4 pt-2 pb-4 w-full">
            {filteredList.map((item, index) => (
              <PosterCard
                key={`${item.id}-${index}`}
                data={item}
                type={item.type || "movie"}
                isSmall
                isWatchlist
                isGrid
                user={user}
              />
            ))}
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-[#14213d] border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full text-center flex flex-col items-center relative">
            {/* Close Button */}
            <button
              onClick={() => setShowClearConfirm(false)}
              className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>

            <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-3 shadow-lg">
              <FaTrash size={20} />
            </div>
            <h3 className="text-xl font-extrabold text-white mb-2">
              Clear Watchlist
            </h3>
            <p className="text-sm text-gray-300 mb-6 leading-relaxed">
              Are you sure you want to remove all saved items from your
              watchlist? This cannot be undone.
            </p>
            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer"
              >
                Yes, Clear All
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WatchList;
