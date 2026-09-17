import React, { useCallback, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getImageUrl } from '../constants/constants';
import PosterCard from '../components/PosterCard';
import { PersonDetailsSkeleton } from '../components/SkeletonLoaders';
import useInfiniteScroll from '../hooks/useInfiniteScroll';
import moment from 'moment';
import { usePersonCreditsQuery, usePersonDetailsQuery } from '../hooks/useTmdbQueries';

const PersonDetails = () => {
    const { id } = useParams();
    const { data: person, isLoading: loadingPerson } = usePersonDetailsQuery(id);
    const { data: creditsRaw, isLoading: loadingCredits } = usePersonCreditsQuery(id);

    const [isBioExpanded, setIsBioExpanded] = useState(false);
    const [visibleCount, setVisibleCount] = useState(12);

    const loading = loadingPerson || loadingCredits;

    const credits = useMemo(() => {
        if (!creditsRaw?.cast) return [];
        const seen = new Set();
        const uniqueList = [];

        const sorted = [...(creditsRaw.cast || [])]
            .filter((item) => item.poster_path)
            .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

        for (const item of sorted) {
            const uniqueKey = `${item.media_type || 'movie'}-${item.id}`;
            if (!seen.has(uniqueKey)) {
                seen.add(uniqueKey);
                uniqueList.push(item);
            }
        }

        return uniqueList;
    }, [creditsRaw]);

    const handleLoadMore = useCallback(() => {
        setVisibleCount(prev => Math.min(prev + 10, credits.length));
    }, [credits.length]);

    useInfiniteScroll(handleLoadMore, visibleCount < credits.length, loading, 400);

    if (loading) {
        return <PersonDetailsSkeleton />;
    }

    if (!person) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center bg-[#0f172a] px-4 pt-20 pb-12">
                <div className="p-6 sm:p-8 bg-[#14213d]/70 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl text-center max-w-md w-full">
                    <h2 className="text-xl font-bold text-white mb-2">Person Details Not Found</h2>
                    <p className="text-sm text-gray-400 mb-6">We couldn't find information for this person.</p>
                    <button
                        onClick={() => window.history.back()}
                        className="px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-600/30"
                    >
                        Go Back
                    </button>
                </div>
            </div>
        );
    }

    const calculateAge = (birthday, deathday) => {
        if (!birthday) return null;
        const end = deathday ? moment(deathday) : moment();
        return end.diff(moment(birthday), 'years');
    };

    const age = calculateAge(person.birthday, person.deathday);

    return (
        <section className="container mx-auto min-h-screen pt-24 pb-12 px-4 md:px-8 text-white">
            <div className="flex flex-col md:flex-row gap-8 md:gap-12 items-center md:items-start">
                {/* Profile Image & Quick Facts (Sticky on Desktop) */}
                <div className="flex flex-col items-center min-w-[260px] max-w-[280px] w-full md:sticky md:top-24 flex-shrink-0">
                    {person.profile_path ? (
                        <img
                            src={getImageUrl('w500', person.profile_path)}
                            alt={person.name}
                            className="w-full h-[380px] object-cover rounded-2xl shadow-2xl border border-gray-800"
                        />
                    ) : (
                        <div className="w-full h-[380px] bg-[#14213d] rounded-2xl flex items-center justify-center text-gray-400">
                            No Profile Image
                        </div>
                    )}

                    <div className="w-full mt-6 bg-[#14213d]/80 backdrop-blur-md p-5 rounded-2xl flex flex-col gap-3.5 shadow-xl border border-gray-800/80">
                        <h3 className="text-lg font-bold border-b border-gray-800 pb-2 text-red-500 tracking-wide">Personal Info</h3>
                        
                        <div>
                            <span className="text-xs text-gray-400 font-medium block">Known For</span>
                            <span className="text-sm font-semibold text-gray-100">{person.known_for_department || 'N/A'}</span>
                        </div>

                        {person.gender > 0 && (
                            <div>
                                <span className="text-xs text-gray-400 font-medium block">Gender</span>
                                <span className="text-sm font-semibold text-gray-100">{person.gender === 1 ? 'Female' : 'Male'}</span>
                            </div>
                        )}

                        {person.birthday && (
                            <div>
                                <span className="text-xs text-gray-400 font-medium block">Birthday</span>
                                <span className="text-sm font-semibold text-gray-100">
                                    {moment(person.birthday).format('MMM DD, YYYY')} {age !== null && `(${age} yrs)`}
                                </span>
                            </div>
                        )}

                        {person.place_of_birth && (
                            <div>
                                <span className="text-xs text-gray-400 font-medium block">Place of Birth</span>
                                <span className="text-sm font-semibold text-gray-100">{person.place_of_birth}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Biography & Filmography */}
                <div className="flex-1 flex flex-col gap-6 w-full min-w-0">
                    <div>
                        <h1 className="text-3xl md:text-5xl font-extrabold text-white mb-2">{person.name}</h1>
                        {person.also_known_as?.length > 0 && (
                            <p className="text-sm text-gray-400 italic line-clamp-1">
                                Also known as: {person.also_known_as.slice(0, 3).join(', ')}
                            </p>
                        )}
                    </div>

                    {person.biography && (
                        <div className="bg-[#14213d]/60 p-6 rounded-xl border border-gray-800">
                            <h2 className="text-2xl font-bold mb-3">Biography</h2>
                            <p className={`text-gray-300 leading-relaxed text-sm md:text-base whitespace-pre-line ${!isBioExpanded && 'line-clamp-6'}`}>
                                {person.biography}
                            </p>
                            {person.biography.length > 400 && (
                                <button
                                    onClick={() => setIsBioExpanded(!isBioExpanded)}
                                    className="mt-3 text-red-500 hover:text-red-400 font-semibold text-sm focus:outline-none cursor-pointer"
                                >
                                    {isBioExpanded ? 'Show Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Known For / Filmography */}
                    <div className="mt-4">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-2xl font-bold">Known For</h2>
                            <span className="text-xs font-semibold bg-red-600/20 text-red-400 px-3 py-1 rounded-full">
                                {credits.length} Titles
                            </span>
                        </div>

                        {credits.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 sm:gap-6 w-full">
                                {credits.slice(0, visibleCount).map((item, index) => (
                                    <PosterCard
                                        key={`${item.id}-${index}`}
                                        data={item}
                                        type={item.media_type || 'movie'}
                                        isGrid
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No known filmography available.</p>
                        )}

                        {visibleCount < credits.length && (
                            <div className="text-center mt-6">
                                <span className="text-xs text-gray-400">
                                    Showing {visibleCount} of {credits.length} titles (scroll for more)
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonDetails;
