import React from 'react';
import { Link } from 'react-router-dom';
import { BiErrorCircle } from 'react-icons/bi';

const NotFound = () => {
    return (
        <section className="pt-24 pb-16 px-4 min-h-screen flex flex-col justify-center items-center bg-[#0f172a] w-full text-white">
            <div className="p-8 sm:p-12 bg-[#14213d]/70 backdrop-blur-md rounded-2xl border border-gray-800 shadow-2xl text-center max-w-lg w-full flex flex-col items-center">
                <div className="w-16 h-16 bg-red-600/20 text-red-500 rounded-full flex items-center justify-center mb-4 border border-red-500/30">
                    <BiErrorCircle size={36} />
                </div>
                <h1 className="text-6xl font-black text-white mb-2 tracking-tight">404</h1>
                <h2 className="text-xl font-bold text-gray-200 mb-2">Page Not Found</h2>
                <p className="text-sm text-gray-400 mb-8 max-w-sm">
                    Oops! The page you're looking for doesn't exist or may have been moved.
                </p>
                <Link
                    to="/"
                    className="py-3 px-6 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-red-600/30"
                >
                    Back to Home
                </Link>
            </div>
        </section>
    );
};

export default NotFound;