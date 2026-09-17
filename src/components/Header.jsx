import React, { useState, useEffect, useCallback } from 'react'
import { IoMenu, IoSearch } from 'react-icons/io5'
import { BsBookmarkFill } from 'react-icons/bs'
import { Link, NavLink } from 'react-router-dom'
import { useAuthContext } from '../store/authContext'
import Dropdown from './Dropdown'

const Header = () => {
    const [navbarToggle, setNavbarToggle] = useState(false);
    const [scrolled, setScrolled] = useState(false);
    const { user } = useAuthContext();

    const navLinks = [
        {
            label: 'Home',
            href: '/home',
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
        if (window.scrollY > 0) {
            setScrolled(true);
        } else {
            setScrolled(false);
        }
    }, []);

    useEffect(() => {
        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };

    }, [handleScroll]);

    return (
        <header className={`
                fixed top-0 max-w-[1536px] w-full z-50 py-4 px-5 text-[#FFFFFF] shadow-md rounded-b-md
                ${scrolled ? 'bg-[#14213d]' : 'bg-transparent'}
            `}
        >
            <div className='w-full flex gap-5 justify-between items-center'>
                <Link to='/'>
                    <h1 className='text-3xl font-bold whitespace-nowrap cursor-pointer hover:text-red-500 transition-colors'>
                        Movie Flick
                    </h1>
                </Link>

                <nav className={`hidden absolute sm:flex flex-col top-16 left-0 w-full py-3 px-5 md:px-0 md:py-0 md:w-auto bg-[#14213d] md:bg-transparent md:static md:flex md:flex-row items-center gap-1 md:gap-5 ${navbarToggle ? 'sm:block' : 'sm:hidden'}`}>
                    {
                        navLinks.map((navLink) => (
                            <NavLink
                                to={navLink.href}
                                key={navLink.label}
                                onClick={() => setNavbarToggle(false)}
                                className={({ isActive }) => `${isActive && 'bg-[#0A1128]'}
                                    text-xl font-medium w-full text-center py-1.5 px-0 md:px-2 hover:bg-[#0A1128] whitespace-nowrap rounded`}
                            >
                                {navLink.label}
                            </NavLink>
                        ))
                    }
                </nav>

                <div className='flex items-center gap-3'>
                    <Link to='/search' title="Search">
                        <IoSearch className='cursor-pointer text-2xl hover:text-red-500 transition-colors' />
                    </Link>

                    <Link to='/watchlist' title="Watchlist">
                        <BsBookmarkFill className='cursor-pointer text-xl hover:text-amber-400 transition-colors' />
                    </Link>

                    {
                        user ? (
                            <Dropdown user={user} />
                        ) : (
                            <Link to={'/login'}>
                                <button className='bg-red-500 px-2 py-1 rounded-md cursor-pointer font-semibold'>
                                    Login
                                </button>
                            </Link>
                        )
                    }

                    <div className='hidden sm:block md:hidden'>
                        <IoMenu onClick={() => setNavbarToggle(!navbarToggle)} className='cursor-pointer text-3xl' />
                    </div>
                </div>
            </div >
        </header >
    )
}

export default Header