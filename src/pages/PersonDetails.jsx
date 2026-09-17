import React, { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axiosInstance from '../services/axios';
import { getImageUrl } from '../constants/constants';
import PosterCard from '../components/PosterCard';
import { PersonDetailsSkeleton } from '../components/SkeletonLoaders';
import moment from 'moment';

const PersonDetails = () => {
    const { id } = useParams();
    const [person, setPerson] = useState(null);
    const [credits, setCredits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isBioExpanded, setIsBioExpanded] = useState(false);

    const fetchPersonDetails = useCallback(async () => {
        setLoading(true);
        try {
            const [personRes, creditsRes] = await Promise.all([
                axiosInstance.get(`/person/${id}`),
                axiosInstance.get(`/person/${id}/combined_credits`)
            ]);

            setPerson(personRes.data);

            // Filter and sort top credits by popularity
            const sortedCredits = (creditsRes.data.cast || [])
                .filter(item => item.poster_path)
                .sort((a, b) => (b.popularity || 0) - (a.popularity || 0));

            setCredits(sortedCredits);
        } catch (error) {
            console.error("Error fetching person details:", error);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => {
        fetchPersonDetails();
    }, [fetchPersonDetails]);

    if (loading) {
        return <PersonDetailsSkeleton />;
    }

    if (!person) {
        return (
            <div className="w-full min-h-screen flex items-center justify-center">
                <h2 className="text-xl text-white">Person details not found.</h2>
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
                {/* Profile Image & Quick Facts */}
                <div className="flex flex-col items-center min-w-[260px] max-w-[280px] w-full">
                    {person.profile_path ? (
                        <img
                            src={getImageUrl('w500', person.profile_path)}
                            alt={person.name}
                            className="w-full h-[380px] object-cover rounded-xl shadow-2xl border border-gray-800"
                        />
                    ) : (
                        <div className="w-full h-[380px] bg-[#14213d] rounded-xl flex items-center justify-center text-gray-400">
                            No Profile Image
                        </div>
                    )}

                    <div className="w-full mt-6 bg-[#14213d] p-5 rounded-xl flex flex-col gap-3 shadow-md border border-gray-800/50">
                        <h3 className="text-lg font-bold border-b border-gray-700 pb-2 text-red-500">Personal Info</h3>
                        
                        <div>
                            <span className="text-sm text-gray-400 font-medium block">Known For</span>
                            <span className="text-base font-semibold">{person.known_for_department || 'N/A'}</span>
                        </div>

                        {person.gender > 0 && (
                            <div>
                                <span className="text-sm text-gray-400 font-medium block">Gender</span>
                                <span className="text-base font-semibold">{person.gender === 1 ? 'Female' : 'Male'}</span>
                            </div>
                        )}

                        {person.birthday && (
                            <div>
                                <span className="text-sm text-gray-400 font-medium block">Birthday</span>
                                <span className="text-base font-semibold">
                                    {moment(person.birthday).format('MMM DD, YYYY')} {age !== null && `(${age} years old)`}
                                </span>
                            </div>
                        )}

                        {person.place_of_birth && (
                            <div>
                                <span className="text-sm text-gray-400 font-medium block">Place of Birth</span>
                                <span className="text-base font-semibold">{person.place_of_birth}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Biography & Filmography */}
                <div className="flex-1 flex flex-col gap-6 w-full">
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
                                    className="mt-3 text-red-500 hover:text-red-400 font-semibold text-sm focus:outline-none"
                                >
                                    {isBioExpanded ? 'Show Less' : 'Read More'}
                                </button>
                            )}
                        </div>
                    )}

                    {/* Known For / Filmography */}
                    <div className="mt-4">
                        <h2 className="text-2xl font-bold mb-4">Known For</h2>
                        {credits.length > 0 ? (
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                                {credits.slice(0, 15).map((item, index) => (
                                    <PosterCard
                                        key={`${item.id}-${index}`}
                                        data={item}
                                        type={item.media_type || 'movie'}
                                        isSmall
                                    />
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-400">No known filmography available.</p>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
};

export default PersonDetails;
