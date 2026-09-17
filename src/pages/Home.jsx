import React from 'react'
import Banner from '../components/Banner'
import CardsList from '../components/CardsList'

const Home = () => {
    return (
        <section className='min-h-screen'>
            <Banner />

            <div className='pb-5'>
                <CardsList endpoint={`/trending/all/week`} title={'Trending'} isTrending />
                <CardsList endpoint={`/movie/popular`} title={'Popular Movies'} type={'movie'} />
                <CardsList endpoint={`/tv/popular`} title={'Popular Tv Shows'} type={'tv'} />
                <CardsList endpoint={`/movie/top_rated`} title={'Top Rated Movies'} type={'movie'} />
                <CardsList endpoint={`/tv/top_rated`} title={'Top Rated Tv Shows'} type={'tv'} />
                <CardsList endpoint={`/movie/now_playing`} title={'Now Playing Movies'} type={'movie'} />
                <CardsList endpoint={`/tv/on_the_air`} title={'On The Air'} type={'tv'} />
                <CardsList endpoint={`/movie/upcoming`} title={'Upcoming Movies'} type={'movie'} />
                <CardsList endpoint={`/tv/airing_today`} title={'Airing Today'} type={'tv'} />
            </div>

        </section>
    )
}

export default Home