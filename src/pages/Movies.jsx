import React from 'react'
import Banner from '../components/Banner'
import CardsList from '../components/CardsList'
import { MovieGenres } from '../constants/GenreList'

const Movies = () => {
    return (
        <section className='min-h-screen'>
            <Banner mediaType={'movie'} />

            <CardsList endpoint={`/trending/movie/week`} title={'Trending'} isTrending type={'movie'} />

            <div className='pb-5'>
                {
                    MovieGenres.map(
                        (genre) => (
                            <div key={genre.id}>
                                <CardsList genreId={genre.id} title={genre.name} type={'movie'} />
                            </div>
                        )
                    )
                }
            </div>
        </section>
    )
}

export default Movies