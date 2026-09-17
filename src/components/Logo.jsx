import React from 'react';

const Logo = ({ size = 'md', className = '' }) => {
    const isSmall = size === 'sm';
    const isLarge = size === 'lg';

    return (
        <div className={`flex items-center gap-2.5 group cursor-pointer ${className}`}>
            {/* Logo Badge Icon */}
            <div className={`relative flex items-center justify-center rounded-xl bg-gradient-to-tr from-red-700 via-red-600 to-red-500 shadow-lg shadow-red-600/30 group-hover:scale-105 group-hover:shadow-red-600/50 transition-all duration-300 ${
                isSmall ? 'w-8 h-8' : isLarge ? 'w-11 h-11' : 'w-9.5 h-9.5'
            }`}>
                {/* Film Reel / Play Icon */}
                <svg
                    className={`${isSmall ? 'w-4 h-4' : isLarge ? 'w-6 h-6' : 'w-5 h-5'} text-white fill-current`}
                    viewBox="0 0 24 24"
                >
                    <path d="M18 3v2h-2V3H8v2H6V3H4v18h2v-2h2v2h8v-2h2v2h2V3h-2zM8 17H6v-2h2v2zm0-4H6v-2h2v2zm0-4H6V7h2v2zm10 8h-2v-2h2v2zm0-4h-2v-2h2v2zm0-4h-2V7h2v2zM10 9.5v5l5-2.5-5-2.5z" />
                </svg>
                {/* Glowing ring */}
                <div className="absolute inset-0 rounded-xl border border-white/20 pointer-events-none" />
            </div>

            {/* Brand Title */}
            <div className="flex flex-col leading-none">
                <span className={`font-black tracking-tight text-white group-hover:text-red-500 transition-colors ${
                    isSmall ? 'text-lg' : isLarge ? 'text-2xl sm:text-3xl' : 'text-xl sm:text-2xl'
                }`}>
                    Movie <span className="text-red-600">Flick</span>
                </span>
            </div>
        </div>
    );
};

export default Logo;
