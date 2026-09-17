import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { RiLogoutBoxRLine } from 'react-icons/ri';

const LogoutModal = ({ showModal, onClose, onConfirm, loading }) => {
    useEffect(() => {
        if (showModal) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'auto';
        }

        return () => {
            document.body.style.overflow = 'auto';
        };
    }, [showModal]);

    if (!showModal) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#14213d] border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative text-center flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <IoClose size={20} />
                </button>

                {/* Icon */}
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg">
                    <RiLogoutBoxRLine size={28} />
                </div>

                {/* Heading */}
                <h3 className="text-xl font-extrabold text-white mb-2">Sign Out</h3>
                <p className="text-sm text-gray-300 mb-6 leading-relaxed">
                    Are you sure you want to sign out of your Movie Flick account?
                </p>

                {/* Action Buttons */}
                <div className="flex items-center justify-center gap-3 w-full">
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                        disabled={loading}
                    >
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={onConfirm}
                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Signing out...' : 'Sign Out'}
                    </button>
                </div>
            </div>
        </div>,
        document.body
    );
};

export default LogoutModal;
