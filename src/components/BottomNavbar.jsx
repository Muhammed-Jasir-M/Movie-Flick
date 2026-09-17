import React from 'react';
import { BiSolidMoviePlay } from 'react-icons/bi';
import { FaHome } from 'react-icons/fa';
import { MdLiveTv } from 'react-icons/md';
import { GiSparkles } from 'react-icons/gi';
import { NavLink } from 'react-router-dom';

const BottomNavbar = () => {
    const navLinks = [
        {
            label: 'Home',
            href: '/',
            icon: <FaHome />
        },
        {
            label: 'Movies',
            href: '/movies',
            icon: <BiSolidMoviePlay />
        },
        {
            label: 'TV Shows',
            href: '/tv',
            icon: <MdLiveTv />
        },
        {
            label: 'Anime',
            href: '/anime',
            icon: <GiSparkles />
        },
    ];

    return (
        <section className='fixed bottom-0 sm:hidden bg-[#0f172a]/95 backdrop-blur-xl text-white shadow-[0_-10px_25px_rgba(0,0,0,0.6)] w-full z-50 border-t border-gray-800/80 px-2 py-1.5'>
            <div className='flex items-center justify-around w-full max-w-md mx-auto'>
                {
                    navLinks.map((navlink) => (
                        <NavLink
                            key={navlink.label}
                            to={navlink.href}
                            end
                            className={({ isActive }) => `
                                relative flex flex-col items-center justify-center gap-0.5 py-1 px-3 transition-all duration-300 group
                                ${isActive ? 'text-red-500 font-bold' : 'text-gray-400 hover:text-gray-200'}
                            `}
                        >
                            {({ isActive }) => (
                                <>
                                    {/* Sleek Top Active Glow Line Indicator */}
                                    {isActive && (
                                        <span className="absolute -top-[7px] w-7 h-1 bg-red-600 rounded-full shadow-[0_0_10px_#ef4444] transition-all duration-300" />
                                    )}

                                    {/* Icon with smooth scale */}
                                    <div className={`text-xl transition-transform duration-300 ${isActive ? 'scale-110 text-red-500' : 'group-hover:scale-105'}`}>
                                        {navlink.icon}
                                    </div>
                                    
                                    {/* Text Label */}
                                    <p className={`text-[10px] tracking-tight font-medium transition-colors duration-300 ${isActive ? 'text-red-500 font-bold' : 'text-gray-400'}`}>
                                        {navlink.label}
                                    </p>
                                </>
                            )}
                        </NavLink>
                    ))
                }
            </div>
        </section>
    );
};

export default BottomNavbar;