import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
    return (
        <section className="w-full min-h-screen text-white pt-24 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto">
                {/* Header Banner */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3">
                        About Movie Flick
                    </h1>
                    <p className="text-gray-400 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto">
                        Your personalized movie and TV show exploration platform.
                    </p>
                </div>

                {/* Main Content Box */}
                <div className="bg-[#14213d] border border-gray-800 rounded-xl p-6 sm:p-10 shadow-lg space-y-8">
                    {/* Mission Section */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                            Our Mission
                        </h2>
                        <p className="text-gray-300 leading-relaxed text-base">
                            Movie Flick is designed for film lovers and casual viewers alike. Our goal is to provide a fast, responsive, and distraction-free environment to discover trending movies, explore detailed cast filmographies, watch official trailers, and manage your personal cloud watchlist.
                        </p>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Key Features */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-4">
                            Key Features
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-1">Real-time TMDb Data</h3>
                                <p className="text-sm text-gray-400">Live ratings, release dates, budget, revenue, and plot summaries.</p>
                            </div>
                            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-1">Trailers & Video Clips</h3>
                                <p className="text-sm text-gray-400">Watch official trailers, teasers, and clips directly in high definition.</p>
                            </div>
                            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-1">Cloud Watchlist</h3>
                                <p className="text-sm text-gray-400">Save and synchronize your favorite titles securely across devices.</p>
                            </div>
                            <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800">
                                <h3 className="font-semibold text-white mb-1">Filmography & Cast Details</h3>
                                <p className="text-sm text-gray-400">Explore actor biographies, credits, and career highlights.</p>
                            </div>
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Technologies Used */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-3">
                            Technologies Used
                        </h2>
                        <div className="flex flex-wrap gap-2">
                            {['React', 'Tailwind CSS', 'TMDb REST API', 'Firebase Authentication', 'Cloud Firestore', 'React Router', 'Axios'].map((tech) => (
                                <span key={tech} className="px-3 py-1 bg-[#0f172a] text-gray-300 text-xs font-medium rounded-md border border-gray-800">
                                    {tech}
                                </span>
                            ))}
                        </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Developer */}
                    <div>
                        <h2 className="text-xl font-bold text-white mb-2">
                            About the Developer
                        </h2>
                        <p className="text-gray-300 text-base leading-relaxed">
                            Built with passion by Muhammed Jasir M. This project reflects a focus on responsive UI design, scalable state management with React Query, and modern web development practices.
                        </p>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Attribution & Disclaimer */}
                    <div className="bg-[#0f172a] p-4 rounded-lg border border-gray-800 text-xs text-gray-400 leading-relaxed">
                        <p className="font-semibold text-gray-300 mb-1">Data Source & Attribution</p>
                        <p>
                            This product uses the TMDb API but is not endorsed or certified by TMDb. All movie details, posters, backdrops, and cast metadata are provided courtesy of The Movie Database (TMDb).
                        </p>
                    </div>
                </div>

                {/* Back to Home */}
                <div className="mt-8 text-center">
                    <Link
                        to="/"
                        className="inline-flex items-center gap-2 px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors text-sm"
                    >
                        Back to Home
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default AboutPage;