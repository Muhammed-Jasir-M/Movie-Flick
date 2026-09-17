import React, { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import tmdbApi from '../api/tmdbApi';
import Spinner from '../components/Spinner';
import Player from '../components/Player';
import { BiArrowBack } from 'react-icons/bi';

const PlayerPage = () => {
    const [trailerVideos, setTrailerVideos] = useState([]);
    const [teaserVideos, setTeaserVideos] = useState([]);
    const [clipVideos, setClipVideos] = useState([]);
    const [featuretteVideos, setFeaturetteVideos] = useState([]);
    const [bts, setBts] = useState([]);
    const [bloopers, setBloopers] = useState([]);
    const [otherVideos, setOtherVideos] = useState([]);

    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(true);

    const { id, type } = useParams();
    const navigate = useNavigate();

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const results = await tmdbApi.getMediaVideos(type, id);

            if (results.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);

                const knownTypes = ['Trailer', 'Teaser', 'Clip', 'Featurette', 'Behind the Scenes', 'Bloopers'];

                setTrailerVideos(results.filter((video) => video.type === 'Trailer'));
                setTeaserVideos(results.filter((video) => video.type === 'Teaser'));
                setClipVideos(results.filter((video) => video.type === 'Clip'));
                setFeaturetteVideos(results.filter((video) => video.type === 'Featurette'));
                setBts(results.filter((video) => video.type === 'Behind the Scenes'));
                setBloopers(results.filter((video) => video.type === 'Bloopers'));
                setOtherVideos(results.filter((video) => !knownTypes.includes(video.type)));
            }
        } catch (error) {
            console.error('Error fetching videos:', error);
            setIsEmpty(true);
        } finally {
            setLoading(false);
        }
    }, [id, type]);

    useEffect(() => {
        fetchVideos();
    }, [fetchVideos]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen bg-[#0f172a]">
                <Spinner borderColor={'border-red-600'} />
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex flex-col justify-center items-center min-h-screen bg-[#0f172a] text-center px-4 pt-16">
                <div className="p-6 sm:p-8 bg-[#14213d]/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl max-w-md w-full">
                    <p className="text-white text-xl font-bold mb-2">No Videos Available</p>
                    <p className="text-gray-400 text-sm mb-6">We couldn't find any trailers or clips for this title.</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl transition-all shadow-lg hover:shadow-red-600/30"
                    >
                        <BiArrowBack className="text-lg" /> Go Back
                    </button>
                </div>
            </div>
        );
    }

    return (
        <section className='pt-20 sm:pt-24 pb-12 min-h-screen px-2.5 sm:px-4 bg-[#0f172a]'>
            <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between">
                <button
                    onClick={() => navigate(-1)}
                    className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-gray-200 text-xs sm:text-sm font-semibold rounded-lg border border-gray-700 transition-all hover:scale-105 active:scale-95"
                >
                    <BiArrowBack className="text-base sm:text-lg" /> Back to Details
                </button>
            </div>

            <Player title="Trailers" videos={trailerVideos} />
            <Player title="Teasers" videos={teaserVideos} />
            <Player title="Clips" videos={clipVideos} />
            <Player title="Featurettes" videos={featuretteVideos} />
            <Player title="Behind The Scenes" videos={bts} />
            <Player title="Bloopers" videos={bloopers} />
            <Player title="Promos & Special Clips" videos={otherVideos} />
        </section>
    );
};

export default PlayerPage;
