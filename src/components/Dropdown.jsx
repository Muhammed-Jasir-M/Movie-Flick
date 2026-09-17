import React, { useEffect, useRef, useState } from 'react';
import { FaUser, FaUserCircle } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '../store/authContext';
import { toast } from 'react-toastify';
import { BsBookmarkFill } from 'react-icons/bs';
import { RiLogoutBoxRLine } from 'react-icons/ri';
import LogoutModal from './LogoutModal';

const Dropdown = ({ user }) => {
    const [open, setOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const [signingOut, setSigningOut] = useState(false);
    let menuRef = useRef();

    const { signout } = useAuthContext();
    const navigate = useNavigate();

    const handleConfirmSignout = async () => {
        setSigningOut(true);
        try {
            await signout();
            toast.success('Signed out successfully');
            setShowLogoutModal(false);
            navigate('/login');
        } catch (error) {
            toast.error('Signout failed');
        } finally {
            setSigningOut(false);
        }
    };

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (menuRef.current && !menuRef.current.contains(e.target)) {
                setOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [menuRef]);

    return (
        <>
            <div className="relative" ref={menuRef}>
                <div
                    onClick={() => setOpen(!open)}
                    className="cursor-pointer transition-transform hover:scale-105 active:scale-95"
                >
                    {user?.photoURL ? (
                        <img
                            src={user.photoURL}
                            alt="Profile"
                            className="rounded-full object-cover h-9 w-9 border-2 border-red-500/80 shadow-md"
                            referrerPolicy="no-referrer"
                        />
                    ) : (
                        <FaUserCircle className="h-9 w-9 text-gray-300 hover:text-white transition-colors" />
                    )}
                </div>

                {open && (
                    <div className="absolute top-12 right-0 bg-[#0f172a] text-white rounded-xl shadow-2xl border border-gray-800 p-3 w-[220px] z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                        <div className="px-2 py-1.5 border-b border-gray-800">
                            <h4 className="text-sm font-bold text-white truncate">
                                {user?.displayName || 'User'}
                            </h4>
                            <p className="text-xs text-gray-400 truncate mt-0.5">
                                {user?.email}
                            </p>
                        </div>

                        <ul className="flex flex-col gap-1 mt-2">
                            <DropdownItem
                                icon={<FaUser className="text-base text-gray-400 group-hover:text-red-500" />}
                                label="Profile"
                                href="/profile"
                                onClick={() => setOpen(false)}
                            />
                            <DropdownItem
                                icon={<BsBookmarkFill className="text-base text-gray-400 group-hover:text-red-500" />}
                                label="Watchlist"
                                href="/watchlist"
                                onClick={() => setOpen(false)}
                            />
                            <li
                                onClick={() => {
                                    setOpen(false);
                                    setShowLogoutModal(true);
                                }}
                                className="group flex items-center gap-3 text-sm font-medium px-2.5 py-2 rounded-lg text-red-400 hover:bg-red-600/10 hover:text-red-500 cursor-pointer transition-colors mt-1"
                            >
                                <RiLogoutBoxRLine className="text-base text-red-400 group-hover:text-red-500" />
                                <span>Sign Out</span>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <LogoutModal
                showModal={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={handleConfirmSignout}
                loading={signingOut}
            />
        </>
    );
};

const DropdownItem = ({ icon, label, href, onClick }) => {
    return (
        <Link to={href} onClick={onClick}>
            <li className="group flex items-center gap-3 text-sm font-medium px-2.5 py-2 rounded-lg text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-colors">
                {icon}
                <span>{label}</span>
            </li>
        </Link>
    );
};

export default Dropdown;