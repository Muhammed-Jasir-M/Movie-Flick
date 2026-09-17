import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axiosInstance from '../services/axios';
import Spinner from '../components/Spinner';
import Player from '../components/Player';

const PlayerPage = () => {
    const [trailerVideos, setTrailerVideos] = useState([]);
    const [teaserVideos, setTeaserVideos] = useState([]);
    const [clipVideos, setClipVideos] = useState([]);
    const [featuretteVideos, setFeaturetteVideos] = useState([]);
    const [bts, setBts] = useState([]);
    const [bloopers, setBloopers] = useState([]);

    const [isEmpty, setIsEmpty] = useState(false);
    const [loading, setLoading] = useState(false);

    const { id, type } = useParams();

    const fetchVideos = useCallback(async () => {
        setLoading(true);
        try {
            const response = await axiosInstance.get(`${type}/${id}/videos`);

            if (response.data.results.length === 0) {
                setIsEmpty(true);
            } else {
                setIsEmpty(false);
            }

            setTrailerVideos(response.data.results.filter((video) => video.type === 'Trailer'));
            setTeaserVideos(response.data.results.filter((video) => video.type === 'Teaser'));
            setClipVideos(response.data.results.filter((video) => video.type === 'Clip'));
            setFeaturetteVideos(response.data.results.filter((video) => video.type === 'Featurette'));
            setBts(response.data.results.filter((video) => video.type === 'Behind the Scenes'));
            setBloopers(response.data.results.filter((video) => video.type === 'Bloopers'));

        } catch (error) {
            console.error('Error fetching videos:', error);
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
            <div className="flex flex-col justify-center items-center h-screen bg-[#0f172a] text-center px-4">
                <div className="p-6 bg-[#14213d]/60 backdrop-blur-md rounded-2xl border border-gray-800 shadow-xl max-w-md">
                    <p className="text-white text-xl font-semibold mb-2">No Videos Available</p>
                    <p className="text-gray-400 text-sm">We couldn't find any trailers or clips for this title.</p>
                </div>
            </div>
        )
    }

    return (
        <section className='pt-16 sm:pt-20 pb-8 sm:pb-12 min-h-screen px-2.5 sm:px-4 bg-[#0f172a]'>
            <Player title="Trailers" videos={trailerVideos} />
            <Player title="Teasers" videos={teaserVideos} />
            <Player title="Clips" videos={clipVideos} />
            <Player title="Featurettes" videos={featuretteVideos} />
            <Player title="Behind The Scenes" videos={bts} />
            <Player title="Bloopers" videos={bloopers} />
        </section>
    )
}

export default PlayerPage