import React, { useState, useEffect } from 'react';
import { FaTrashAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import { IoClose } from 'react-icons/io5';
import { useAuthContext } from '../store/authContext';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeleteModal = ({ showModal, onClose, user }) => {
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const { deleteUserProfile } = useAuthContext();
    const navigate = useNavigate();

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

    const handleDeleteClick = async () => {
        if (!password.trim() && user?.providerData?.[0]?.providerId === 'password') {
            return toast.error('Please enter your password to confirm deletion');
        }

        setLoading(true);
        try {
            await deleteUserProfile(password);
            toast.success('Account deleted successfully!');
            navigate('/login');
            onClose();
        } catch (error) {
            toast.error(`Error deleting account: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex justify-center items-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#14213d] border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative text-center flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <IoClose size={20} />
                </button>

                {/* Warning Icon Badge */}
                <div className="w-16 h-16 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-lg">
                    <FaTrashAlt size={26} />
                </div>

                {/* Heading & Text */}
                <h3 className="text-xl font-extrabold text-white mb-2">Delete Account</h3>
                <p className="text-sm text-gray-300 mb-4 leading-relaxed">
                    Are you sure you want to permanently delete your account? This action cannot be undone.
                </p>

                {/* Password confirmation for email/password provider */}
                {user?.providerData?.[0]?.providerId === 'password' && (
                    <div className="w-full mb-5 text-left">
                        <label className="text-xs font-semibold text-gray-300 block mb-1">
                            Confirm Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                onChange={(e) => setPassword(e.target.value)}
                                value={password}
                                placeholder="Enter current password"
                                className="w-full h-10 rounded-xl bg-slate-900 border border-gray-700 text-white text-sm px-3 pr-10 outline-none focus:border-red-500 transition-colors"
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                    </div>
                )}

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
                        onClick={handleDeleteClick}
                        className="flex-1 py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-xl shadow-lg hover:shadow-red-600/30 transition-all cursor-pointer flex items-center justify-center gap-2"
                        disabled={loading}
                    >
                        {loading ? 'Deleting...' : 'Delete Account'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteModal;