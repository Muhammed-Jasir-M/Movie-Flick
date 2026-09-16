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
            <div className="flex justify-center items-center h-screen">
                <Spinner borderColor={'border-white'} />
            </div>
        );
    }

    if (isEmpty) {
        return (
            <div className="flex justify-center items-center h-screen">
                <p className="text-white text-xl">Videos are not available</p>
            </div>
        )
    }

    return (
        <section className='pt-20 pb-5 min-h-screen'>
            <Player videos={trailerVideos} />
            <Player videos={teaserVideos} />
            <Player videos={clipVideos} />
            <Player videos={featuretteVideos} />
            <Player videos={bts} />
            <Player videos={bloopers} />
        </section>
    )
}

export default PlayerPage