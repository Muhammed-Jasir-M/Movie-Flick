import React from 'react'
import DetailsInfo from '../components/DetailsInfo';
import CastList from '../components/CastList';
import CardsList from '../components/CardsList';
import { useParams } from 'react-router-dom';

const DetailsPage = () => {
    const { type, id } = useParams();

    return (
        <section className="bg-[#0f172a] min-h-screen pb-12">
            <DetailsInfo />
            <CastList />
            <CardsList endpoint={`/${type}/${id}/similar`} title={`Similar ${type === 'movie' ? 'Movies' : 'TV Shows'}`} type={`${type}`} />
            <CardsList endpoint={`/${type}/${id}/recommendations`} title={`Recommended ${type === 'movie' ? 'Movies' : 'TV Shows'}`} type={`${type}`} />
        </section>
    );
};

export default DetailsPage