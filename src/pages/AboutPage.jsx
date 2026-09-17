import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <div className="w-full min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Banner */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-red-600/10 border border-red-500/30 text-red-400 text-xs sm:text-sm font-semibold mb-4">
                        <span>ℹ️</span> About Movie Flick
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
                        Your Ultimate Film & TV Companion
                    </h1>
                    <p className="text-gray-300 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Learn more about Movie Flick, our mission to simplify movie discovery, the tech stack powering the app, and the developer behind it.
                    </p>
                </div>

                {/* Main Content Box */}
                <div className="bg-[#14213d]/60 border border-gray-800 rounded-2xl p-6 sm:p-10 shadow-2xl space-y-10">
                    {/* Mission Section */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                            <span>🚀</span> Our Mission
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-base">
                            Movie Flick is a modern web application designed for film lovers and binge-watchers alike. Our goal is to provide a clean, responsive, and ad-free environment to discover trending movies, explore detailed cast filmographies, watch official trailers, and curate your personalized watchlist.
                        </p>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Key Features */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>✨</span> Key Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-slate-900/70 p-4 rounded-xl border border-gray-800">
                                <h3 className="font-bold text-white mb-1">🎬 TMDB Real-time Data</h3>
                                <p className="text-xs text-gray-400">Live ratings, budget, revenue, release dates, and plot overviews.</p>
                            </div>
                            <div className="bg-slate-900/70 p-4 rounded-xl border border-gray-800">
                                <h3 className="font-bold text-white mb-1">▶️ YouTube Video Player</h3>
                                <p className="text-xs text-gray-400">Watch trailers, teasers, behind-the-scenes footage, and clips.</p>
                            </div>
                            <div className="bg-slate-900/70 p-4 rounded-xl border border-gray-800">
                                <h3 className="font-bold text-white mb-1">🔖 Cloud Watchlist</h3>
                                <p className="text-xs text-gray-400">Save your favorite titles across devices using Firebase authentication.</p>
                            </div>
                            <div className="bg-slate-900/70 p-4 rounded-xl border border-gray-800">
                                <h3 className="font-bold text-white mb-1">🎭 Actor Filmography</h3>
                                <p className="text-xs text-gray-400">Explore cast bios, birthplaces, known credits, and infinite scroll lists.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Technologies Used */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                            <span>💻</span> Technologies Used
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {['React 18', 'Tailwind CSS', 'TMDb REST API', 'Firebase Authentication', 'Cloud Firestore', 'React Router v6', 'Axios', 'React Icons'].map((tech) => (
                                <span key={tech} className="px-3.5 py-1.5 bg-slate-900 text-gray-300 text-xs font-semibold rounded-lg border border-gray-700/60">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Developer Bio */}
                    <div>
                        <h2 className="text-2xl font-bold text-white mb-3 flex items-center gap-2">
                            <span>👨‍💻</span> About the Developer
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Movie Flick was created with passion by a film and web development enthusiast. It reflects a commitment to building clean user interfaces, high-performance API integrations, and intuitive web experiences.
                        </p>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Attribution & Disclaimer */}
                    <div className="bg-slate-900/80 p-4 sm:p-6 rounded-xl border border-gray-800 text-xs text-gray-400 leading-relaxed">
                        <p className="font-semibold text-gray-300 mb-1">Data Source & Attribution</p>
                        <p>
                            This product uses the TMDb API but is not endorsed or certified by TMDb. All movie details, posters, backdrops, and cast metadata are provided courtesy of The Movie Database (TMDB).
                        </p>
                    </div>
                </div>

                {/* Back to Home CTA */}
                <div className="mt-10 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl shadow-lg transition-colors"
                    >
                        <span>Go to Home Page</span>
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default AboutPage;