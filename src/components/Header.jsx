import React, { useState, useEffect, useCallback } from 'react';
import { IoMenu, IoSearch } from 'react-icons/io5';
import { BsBookmarkFill } from 'react-icons/bs';
import { Link, NavLink } from 'react-router-dom';
import { useAuthContext } from '../store/authContext';
import Dropdown from './Dropdown';
import Logo from './Logo';

const Header = () => {
    const [navbarToggle, setNavbarToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuthContext();

    const navLinks = [
        {
            label: 'Home',
            href: '/',
        },
        {
            label: 'Movies',
            href: '/movies',
        },
        {
            label: 'TV Shows',
            href: '/tv',
        },
        {
            label: 'Anime',
            href: '/anime',
        }
    ];

    const handleScroll = useCallback(() => {
        if (window.scrollY > 10) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    return (
        <header className={`
                fixed top-0 max-w-[1536px] w-full z-50 py-3 sm:py-3.5 px-4 sm:px-6 text-white transition-colors duration-300 border-b
                ${scrolled ? 'bg-[#0f172a]/95 backdrop-blur-md shadow-2xl border-gray-800/80' : 'bg-gradient-to-b from-[#0f172a]/95 via-[#0f172a]/60 to-transparent border-transparent'}
            `}
        >
            <div className='w-full flex gap-4 justify-between items-center max-w-7xl mx-auto'>
                {/* Logo links to Landing Page */}
                <Link to='/landing' title="Movie Flick Landing">
                    <Logo />
                </Link>

                {/* Desktop Navigation */}
                <nav className={`hidden absolute sm:flex flex-col top-16 left-0 w-full py-4 px-6 md:px-0 md:py-0 md:w-auto bg-[#14213d] md:bg-transparent md:static md:flex md:flex-row items-center gap-1.5 md:gap-2 ${navbarToggle ? 'sm:flex' : 'sm:hidden'}`}>
                    {
                        navLinks.map((navLink) => (
                            <NavLink
                                to={navLink.href}
                                key={navLink.label}
                                end
                                onClick={() => setNavbarToggle(false)}
                                className={({ isActive }) => `
                                    text-sm md:text-base font-semibold px-3.5 py-1.5 rounded-xl transition-all duration-200 whitespace-nowrap
                                    ${isActive
                                        ? 'bg-red-600 text-white shadow-lg shadow-red-600/30 font-bold'
                                        : 'text-gray-300 hover:text-white hover:bg-slate-800/70'
                                    }
                                `}
                            >
                                {navLink.label}
                            </NavLink>
                        ))
                    }
                </nav>

                {/* Action Icons & Profile */}
                <div className='flex items-center gap-2.5 sm:gap-3.5'>
                    <Link to='/search' title="Search" className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-gray-200 hover:text-white border border-gray-700/60 transition-all hover:scale-105 active:scale-95">
                        <IoSearch className='text-lg sm:text-xl' />
                    </Link>

                    <Link to='/watchlist' title="Watchlist" className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-700 text-amber-400 border border-gray-700/60 transition-all hover:scale-105 active:scale-95">
                        <BsBookmarkFill className='text-base sm:text-lg' />
                    </Link>

                    {
                        user ? (
                            <Dropdown user={user} />
                        ) : (
                            <Link to={'/login'}>
                                <button className='bg-red-600 hover:bg-red-700 px-3.5 py-1.5 rounded-xl cursor-pointer font-bold text-xs sm:text-sm text-white shadow-md hover:shadow-red-600/30 transition-all hover:scale-105 active:scale-95'>
                                    Login
                                </button>
                            </Link>
                        )
                    }

                    <div className='hidden sm:block md:hidden'>
                        <IoMenu onClick={() => setNavbarToggle(!navbarToggle)} className='cursor-pointer text-2xl text-gray-300 hover:text-white' />
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;