import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    const footerLinks = [
        {
            title: 'Navigation',
            links: [
                { label: 'Home', path: '/' },
                { label: 'Movies', path: '/movies' },
                { label: 'TV Shows', path: '/tv' },
                { label: 'Search', path: '/search' },
            ],
        },
        {
            title: 'Account',
            links: [
                { label: 'Watchlist', path: '/watchlist' },
                { label: 'Profile', path: '/profile' },
                { label: 'About Us', path: '/about' },
            ],
        },
    ];

    return (
        <footer className='relative bg-slate-900 text-[#ffffff] pt-6 md:pt-8 pb-[85px] sm:pb-5 md:pb-8 px-4 sm:px-6 md:px-12 lg:px-16 rounded-t-md border-t border-gray-800'>
            <div className='flex flex-col md:flex-row justify-between gap-6'>
                <div className='flex flex-col gap-3 w-full items-center md:items-start'>
                    <Link to='/landing'>
                        <h1 className='text-2xl md:text-3xl font-bold whitespace-nowrap text-white hover:text-red-500 transition-colors'>
                            Movie Flick
                        </h1>
                    </Link>

                    <p className='text-sm max-w-[400px] px-4 md:px-0 w-full text-center md:text-left text-gray-400 leading-relaxed'>
                        Movie Flick is a movie & TV show exploration app built with React, TMDB API & Firebase.
                    </p>
                </div>

                <div className='grid grid-cols-2 gap-8 md:gap-16 md:pr-16 w-full justify-center md:justify-end'>
                    {footerLinks.map((section, index) => (
                        <div key={index} className='flex flex-col gap-2.5 px-6 md:px-0'>
                            <h3 className='text-base font-bold text-white uppercase tracking-wider'>
                                {section.title}
                            </h3>

                            <ul className='flex flex-col gap-1.5'>
                                {section.links.map((link, idx) => (
                                    <li key={idx}>
                                        <Link
                                            to={link.path}
                                            className='text-sm font-medium text-gray-400 hover:text-white transition-colors cursor-pointer whitespace-nowrap'
                                        >
                                            {link.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </div>

            <div className='flex flex-col sm:flex-row justify-between items-center pt-5 mt-6 border-t border-gray-800 text-sm text-gray-400 gap-2'>
                <p>
                    &#169; {new Date().getFullYear()} Movie Flick. All rights reserved.
                </p>
                <p>
                    Made with ❤️ by{' '}
                    <a
                        href='https://github.com/Muhammed-Jasir-M'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='font-semibold text-white hover:underline'
                    >
                        Muhammed Jasir M
                    </a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
