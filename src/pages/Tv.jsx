import React from 'react'
import Banner from '../components/Banner'
import CardsList from '../components/CardsList'
import { TvShowGenres } from '../constants/GenreList'

const Tv = () => {
    return (
        <section className='min-h-screen'>
            <Banner mediaType={'tv'} />

            <CardsList endpoint={`/trending/tv/week`} title={'Trending'} isTrending type={'tv'} />

            <div className='pb-5'>
                {
                    TvShowGenres.map(
                        (genre) => (
                            <div key={genre.id}>
                                <CardsList genreId={genre.id} title={genre.name} type={'tv'} />
                            </div>
                        )
                    )
                }
            </div>

        </section>
    )
}

export default Tv