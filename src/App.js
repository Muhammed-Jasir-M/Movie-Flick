import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Header from './components/Header'
import Home from './pages/Home'
import Movies from './pages/Movies'
import Tv from './pages/Tv'
import BottomNavbar from './components/BottomNavbar'
import SearchPage from './pages/SearchPage'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import DetailsPage from './pages/DetailsPage'
import PlayerPage from './pages/PlayerPage'
import ExplorePage from './pages/ExplorePage'
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage'
import ResetPassword from './components/ResetPassword'
import NotFound from './pages/NotFound'
import AboutPage from './pages/AboutPage'
import Profile from './pages/Profile'
import ProtectedRoute from './components/ProtectedRoute'
import WatchList from './pages/WatchList'

const App = () => {
    return (
        <main className='2xl:container mx-auto'>
            <BrowserRouter>
                <Header />
                <ScrollToTop />
                <Routes>
                    <Route path='/' element={<Home />} />
                    <Route path='/movies' element={<Movies />} />
                    <Route path='/tv' element={<Tv />} />
                    <Route path='/search' element={<SearchPage />} />
                    <Route path='/:type/:id' element={<DetailsPage />} />
                    <Route path='/player/:type/:id' element={<PlayerPage />} />
                    <Route path='/explore/:type/:title' element={<ExplorePage />} />
                    <Route path='/signup' element={<SignupPage />} />
                    <Route path='/login' element={<LoginPage />} />
                    <Route path='/reset' element={<ResetPassword />} />
                    <Route path='/about' element={<AboutPage />} />
                    <Route
                        path="/profile"
                        element={
                            <ProtectedRoute>
                                <Profile />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/watchlist"
                        element={
                            <ProtectedRoute>
                                <WatchList />
                            </ProtectedRoute>
                        }
                    />
                    <Route path='*' element={<NotFound />} />
                </Routes>
                <Footer />
                <BottomNavbar />
            </BrowserRouter>
        </main>
    )
}

export default App