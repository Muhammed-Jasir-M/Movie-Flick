import React from 'react';
import Banner from '../components/Banner';
import CardsList from '../components/CardsList';

const Anime = () => {
    return (
        <section className="min-h-screen pb-12">
            <Banner mediaType="tv" />

            <div className="mt-4 flex flex-col gap-6">
                {/* Popular Sections */}
                <CardsList
                    endpoint="/discover/tv?with_genres=16&with_original_language=ja&sort_by=popularity.desc"
                    title="Popular Anime Series"
                    type="tv"
                    isTrending
                />

                <CardsList
                    endpoint="/discover/movie?with_genres=16&with_original_language=ja&sort_by=popularity.desc"
                    title="Popular Anime Movies"
                    type="movie"
                />

                {/* Top Rated Sections */}
                <CardsList
                    endpoint="/discover/tv?with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=200"
                    title="Top Rated Anime Series"
                    type="tv"
                />

                <CardsList
                    endpoint="/discover/movie?with_genres=16&with_original_language=ja&sort_by=vote_average.desc&vote_count.gte=200"
                    title="Top Rated Anime Movies"
                    type="movie"
                />

                {/* Anime Genres & Sub-Categories */}
                <CardsList
                    endpoint="/discover/tv?with_genres=16,10759,10765&with_original_language=ja&sort_by=popularity.desc"
                    title="Action & Sci-Fi Anime"
                    type="tv"
                />

                <CardsList
                    endpoint="/discover/tv?with_genres=16,10765&with_original_language=ja&sort_by=popularity.desc"
                    title="Fantasy & Supernatural Anime"
                    type="tv"
                />

                <CardsList
                    endpoint="/discover/tv?with_genres=16,35&with_original_language=ja&sort_by=popularity.desc"
                    title="Comedy & Slice of Life Anime"
                    type="tv"
                />

                <CardsList
                    endpoint="/discover/tv?with_genres=16,18&with_original_language=ja&sort_by=popularity.desc"
                    title="Drama & Romance Anime"
                    type="tv"
                />

                <CardsList
                    endpoint="/discover/tv?with_genres=16&with_original_language=ja&first_air_date.lte=2015-12-31&sort_by=popularity.desc"
                    title="Classic Anime Favorites"
                    type="tv"
                />
            </div>
        </section>
    );
};

export default Anime;
