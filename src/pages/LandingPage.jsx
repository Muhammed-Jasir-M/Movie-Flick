import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="w-full min-h-screen text-white bg-[#0f172a] relative overflow-hidden">
            {/* Background Decorative Ambient Lights */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-red-600/20 via-indigo-600/10 to-transparent blur-[140px] pointer-events-none -z-10" />

            {/* Hero Intro Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 md:pt-32 pb-16 md:pb-24 text-center relative z-10">
                {/* Intro Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-bold mb-8 shadow-inner animate-pulse">
                    <span>🎬</span> Welcome to Movie Flick
                </div>

                {/* Hero Title */}
                <h1 className="text-4xl sm:text-6xl md:text-7xl font-black tracking-tight leading-[1.1] text-white mb-6 max-w-5xl mx-auto">
                    The Ultimate Portal for <br className="hidden sm:inline" />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-amber-400 to-red-600">
                        Movies, TV Shows & Actors
                    </span>
                </h1>

                {/* Hero Description */}
                <p className="max-w-3xl mx-auto text-base sm:text-xl text-gray-300 leading-relaxed mb-10 font-normal">
                    Explore real-time cinema trends, watch high-definition trailers, save your personal cloud watchlist, and deep dive into actor filmographies — all in one sleek, modern application.
                </p>

                {/* CTA Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-4">
                    <Link
                        to="/"
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold text-base shadow-xl hover:shadow-red-600/40 transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                    >
                        <span>Start Browsing Now</span>
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>

                    <Link
                        to="/search"
                        className="px-8 py-4 rounded-xl bg-[#14213d] hover:bg-[#1f315a] border border-gray-700 text-gray-200 font-semibold text-base transition-all hover:border-gray-500 shadow-lg flex items-center gap-2"
                    >
                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <span>Search Database</span>
                    </Link>
                </div>
            </div>

            {/* Quick Stats Bar */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-[#14213d]/60 border border-gray-800 p-6 rounded-2xl shadow-xl text-center">
                    <div>
                        <h3 className="text-2xl sm:text-4xl font-black text-red-500">500K+</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Movies & TV Shows</p>
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-4xl font-black text-amber-400">100%</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Free & Ad-Free</p>
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-4xl font-black text-blue-400">HD / 4K</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">YouTube Trailers</p>
                    </div>
                    <div>
                        <h3 className="text-2xl sm:text-4xl font-black text-emerald-400">Instant</h3>
                        <p className="text-xs sm:text-sm text-gray-400 mt-1 font-medium">Cloud Watchlist Sync</p>
                    </div>
                </div>
            </div>

            {/* Key Platform Features Showcase */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                        Everything You Need For Cinema
                    </h2>
                    <p className="text-gray-400 text-base max-w-xl mx-auto">
                        Movie Flick combines real-time data feeds from TMDB with an intuitive dark-mode interface.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Feature 1 */}
                    <div className="bg-[#14213d]/60 border border-gray-800 hover:border-red-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 shadow-2xl relative group">
                        <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 4v16M17 4v16M3 8h4m10 0h4M3 12h18M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Trending & Top Rated</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Stay updated with daily trending movies, upcoming blockbusters, top-rated TV series, and seasonal releases.
                        </p>
                    </div>

                    {/* Feature 2 */}
                    <div className="bg-[#14213d]/60 border border-gray-800 hover:border-red-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 shadow-2xl relative group">
                        <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">YouTube Video Player</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Watch official movie trailers, teasers, bloopers, featurettes, and behind-the-scenes clips directly within the app.
                        </p>
                    </div>

                    {/* Feature 3 */}
                    <div className="bg-[#14213d]/60 border border-gray-800 hover:border-red-500/50 p-8 rounded-3xl transition-all duration-300 hover:-translate-y-2 shadow-2xl relative group">
                        <div className="w-14 h-14 rounded-2xl bg-yellow-500/10 border border-yellow-500/30 flex items-center justify-center text-yellow-400 mb-6 group-hover:scale-110 transition-transform">
                            <svg className="w-7 h-7" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-3">Custom Cloud Watchlist</h3>
                        <p className="text-sm text-gray-400 leading-relaxed">
                            Bookmark your favorite movies and TV shows. Your list is saved securely to Firebase and accessible anytime.
                        </p>
                    </div>
                </div>
            </div>

            {/* Bottom Call to Action Section */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-gradient-to-r from-red-900/40 via-red-600/20 to-amber-900/40 border border-red-500/30 p-10 sm:p-16 rounded-3xl text-center shadow-2xl relative overflow-hidden">
                    <h2 className="text-3xl sm:text-5xl font-black text-white mb-4">
                        Ready to Experience Movie Flick?
                    </h2>
                    <p className="text-gray-300 text-base sm:text-lg mb-8 max-w-xl mx-auto">
                        Jump into thousands of movies, TV shows, and actor filmographies today.
                    </p>
                    <div className="flex flex-wrap items-center justify-center gap-4">
                        <Link
                            to="/"
                            className="px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold text-base rounded-xl shadow-xl transition-all hover:scale-105"
                        >
                            Explore Movies
                        </Link>
                        <Link
                            to="/about"
                            className="px-8 py-4 bg-slate-900/80 hover:bg-slate-800 text-gray-200 font-semibold text-base rounded-xl border border-gray-700 transition-all"
                        >
                            Learn About Us
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
