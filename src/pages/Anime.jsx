import React from 'react';
import Banner from '../components/Banner';
import CardsList from '../components/CardsList';

const Anime = () => {
    return (
        <section className="min-h-screen pb-12">
            <Banner mediaType="tv" />

            <div className="mt-4 flex flex-col gap-6">
                <CardsList
                    endpoint="/discover/tv?with_genres=16&sort_by=popularity.desc"
                    title="Popular Anime Series"
                    type="tv"
                    isTrending
                />

                <CardsList
                    endpoint="/discover/movie?with_genres=16&sort_by=popularity.desc"
                    title="Anime Movies"
                    type="movie"
                />

                <CardsList
                    endpoint="/discover/tv?with_genres=16&sort_by=vote_average.desc&vote_count.gte=200"
                    title="Top Rated Anime"
                    type="tv"
                />
            </div>
        </section>
    );
};

export default Anime;
