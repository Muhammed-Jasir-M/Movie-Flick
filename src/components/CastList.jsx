import React, { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getImageUrl } from '../constants/constants';
import { CastSkeleton } from './SkeletonLoaders';
import useHorizontalScroll from '../hooks/useHorizontalScroll';
import { useMediaCreditsQuery } from '../hooks/useTmdbQueries';

const CastList = () => {
    const castRef = useRef(null);
    const crewRef = useRef(null);

    const { type, id } = useParams();
    const { data: creditsData, isLoading: loading } = useMediaCreditsQuery(type, id);

    const casts = creditsData?.cast || [];
    const crews = creditsData?.crew || [];

    useHorizontalScroll(castRef, [casts]);
    useHorizontalScroll(crewRef, [crews]);

    return (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 text-white">
            {loading ? (
                <div className="py-2">
                    <CastSkeleton count={8} />
                </div>
            ) : (
                <div className="flex flex-col gap-5">
                    {casts.length > 0 && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-2">
                                <span>Top Cast</span>
                                <span className="text-xs font-semibold bg-red-600/20 text-red-400 px-2.5 py-0.5 rounded-full">
                                    {casts.length}
                                </span>
                            </h2>

                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 pt-1" ref={castRef}>
                                {casts.map((cast, index) => (
                                    <Link
                                        to={`/person/${cast?.id}`}
                                        key={`${cast?.id}-${index}`}
                                        className="flex-shrink-0 w-28 sm:w-32 flex flex-col items-center group cursor-pointer"
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#14213d] border-2 border-gray-700/60 group-hover:border-red-500 shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                                            {cast?.profile_path ? (
                                                <img
                                                    src={getImageUrl('w500', cast.profile_path)}
                                                    alt={cast?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center px-1">
                                                    No Photo
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 text-center w-full px-1">
                                            <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                                                {cast?.name}
                                            </h3>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                                {cast?.character}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {crews.length > 0 && (
                        <div>
                            <h2 className="text-xl sm:text-2xl font-bold mb-3 flex items-center gap-2">
                                <span>Crew</span>
                                <span className="text-xs font-semibold bg-red-600/20 text-red-400 px-2.5 py-0.5 rounded-full">
                                    {crews.length}
                                </span>
                            </h2>

                            <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-3 pt-1" ref={crewRef}>
                                {crews.map((crew, index) => (
                                    <Link
                                        to={`/person/${crew?.id}`}
                                        key={`${crew?.id}-${index}`}
                                        className="flex-shrink-0 w-28 sm:w-32 flex flex-col items-center group cursor-pointer"
                                    >
                                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-[#14213d] border-2 border-gray-700/60 group-hover:border-red-500 shadow-xl transition-all duration-300 group-hover:scale-105 relative">
                                            {crew?.profile_path ? (
                                                <img
                                                    src={getImageUrl('w500', crew.profile_path)}
                                                    alt={crew?.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-400 text-center px-1">
                                                    No Photo
                                                </div>
                                            )}
                                        </div>

                                        <div className="mt-2 text-center w-full px-1">
                                            <h3 className="text-xs sm:text-sm font-semibold text-white truncate group-hover:text-red-400 transition-colors">
                                                {crew?.name}
                                            </h3>
                                            <p className="text-[11px] text-gray-400 truncate mt-0.5">
                                                {crew?.job}
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default CastList