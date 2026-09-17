import React, { useState } from 'react';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaPlay, FaYoutube } from 'react-icons/fa';

const Player = ({ title, videos }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    if (!videos || videos.length === 0) return null;

    const currentVideo = videos[currentIndex];

    const handlePrev = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
        }
    };

    const handleNext = () => {
        if (currentIndex < videos.length - 1) {
            setCurrentIndex(currentIndex + 1);
        }
    };

    return (
        <div className="w-full max-w-5xl mx-auto my-4 sm:my-8 bg-[#14213d]/70 backdrop-blur-md p-3 sm:p-6 rounded-xl sm:rounded-2xl border border-gray-800 shadow-2xl">
            {/* Header / Category title & Pagination */}
            <div className="flex justify-between items-center pb-3 sm:pb-4 border-b border-gray-800/80 mb-3 sm:mb-4 gap-2">
                <div className="flex items-center gap-2 min-w-0">
                    <FaYoutube className="text-red-600 text-xl sm:text-2xl flex-shrink-0" />
                    <h3 className="text-base sm:text-xl md:text-2xl font-extrabold text-white tracking-wide truncate">
                        {title || currentVideo?.type || 'Video'}
                    </h3>
                    <span className="text-[10px] sm:text-xs font-semibold bg-red-600/20 text-red-400 px-2 sm:px-2.5 py-0.5 rounded-full whitespace-nowrap flex-shrink-0">
                        {currentIndex + 1} of {videos.length}
                    </span>
                </div>

                {/* Navigation Buttons */}
                {videos.length > 1 && (
                    <div className="flex items-center gap-1.5 sm:gap-2 flex-shrink-0">
                        <button
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-all border border-gray-700 ${
                                currentIndex === 0 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
                            }`}
                            disabled={currentIndex === 0}
                            onClick={handlePrev}
                            aria-label="Previous Video"
                        >
                            <BiChevronLeft className="text-lg sm:text-2xl" />
                        </button>

                        <button
                            className={`p-1.5 sm:p-2 rounded-lg sm:rounded-xl bg-slate-800/80 hover:bg-slate-700 text-white transition-all border border-gray-700 ${
                                currentIndex === videos.length - 1 ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer hover:scale-105 active:scale-95'
                            }`}
                            disabled={currentIndex === videos.length - 1}
                            onClick={handleNext}
                            aria-label="Next Video"
                        >
                            <BiChevronRight className="text-lg sm:text-2xl" />
                        </button>
                    </div>
                )}
            </div>

            {/* Video Player Display */}
            <div className="aspect-video w-full overflow-hidden rounded-lg sm:rounded-xl shadow-2xl bg-black border border-gray-800 relative group">
                <iframe
                    src={`https://www.youtube.com/embed/${currentVideo.key}?autoplay=0&rel=0`}
                    title={currentVideo.name || 'Movie Flick Video Player'}
                    width="100%"
                    height="100%"
                    loading="lazy"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                />
            </div>

            {/* Video Title & Meta */}
            <div className="mt-2.5 sm:mt-3 flex justify-between items-center gap-2">
                <h4 className="text-xs sm:text-base font-semibold text-gray-200 line-clamp-1 min-w-0">
                    {currentVideo.name}
                </h4>
                <span className="text-[11px] sm:text-xs text-gray-400 font-medium whitespace-nowrap flex-shrink-0">
                    {currentVideo.site || 'YouTube'}
                </span>
            </div>

            {/* Thumbnail Carousel Selector if multiple videos */}
            {videos.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide pt-3 sm:pt-4 mt-2.5 sm:mt-3 border-t border-gray-800/60 pb-1">
                    {videos.map((vid, idx) => (
                        <div
                            key={`${vid.key}-${idx}`}
                            onClick={() => setCurrentIndex(idx)}
                            className={`flex-shrink-0 cursor-pointer rounded-md sm:rounded-lg overflow-hidden border-2 transition-all relative ${
                                currentIndex === idx ? 'border-red-500 scale-105 shadow-md' : 'border-transparent opacity-60 hover:opacity-100'
                            }`}
                        >
                            <img
                                src={`https://img.youtube.com/vi/${vid.key}/hqdefault.jpg`}
                                alt={vid.name}
                                className="w-20 h-12 sm:w-28 sm:h-16 object-cover"
                            />
                            {currentIndex === idx && (
                                <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                    <FaPlay className="text-white text-[10px] sm:text-xs" />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Player;