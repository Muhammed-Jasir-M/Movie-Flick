import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { IoClose } from 'react-icons/io5';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../store/authContext';
import { FaEye, FaEyeSlash, FaLock } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Spinner from './Spinner';

const ChangePasswordModal = ({ showModal, onClose, user }) => {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);

    const { updateUserPassword } = useAuthContext();

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

    const initialValues = {
        currentPassword: '',
        newPassword: '',
    };

    const updatePasswordSchema = Yup.object().shape({
        currentPassword: Yup.string()
            .required('Current password is required')
            .min(6, 'Password must be at least 6 characters long'),
        newPassword: Yup.string()
            .required('New password is required')
            .min(6, 'Password must be at least 6 characters long')
            .matches(
                /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{6,}$/,
                'Password must contain at least one letter and one number'
            ),
    });

    const onSubmit = async (values, { setSubmitting }) => {
        try {
            await updateUserPassword(values.currentPassword, values.newPassword);
            toast.success('Password updated successfully!');
            onClose();
        } catch (error) {
            toast.error(`Error updating password: ${error.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    const { handleChange, handleBlur, values, handleSubmit, errors, touched, isSubmitting, isValid } = useFormik({
        initialValues,
        validationSchema: updatePasswordSchema,
        onSubmit,
    });

    if (!showModal) return null;

    return ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex justify-center items-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-[#14213d] border border-gray-800 rounded-2xl shadow-2xl p-6 max-w-sm w-full relative flex flex-col items-center">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 p-1 rounded-lg text-gray-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                    <IoClose size={20} />
                </button>

                {/* Lock Icon Badge */}
                <div className="w-14 h-14 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3 shadow-lg">
                    <FaLock size={22} />
                </div>

                <h3 className="text-xl font-extrabold text-white text-center mb-4">Change Password</h3>

                <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
                    {/* Current Password Input */}
                    <div className="w-full relative">
                        <label htmlFor="currentPassword" className="text-xs font-semibold text-gray-300 block mb-1">
                            Current Password
                        </label>
                        <div className="relative">
                            <input
                                type={showCurrentPassword ? 'text' : 'password'}
                                placeholder="Enter current password"
                                id="currentPassword"
                                className={`w-full h-10 rounded-xl bg-slate-900 border text-white text-sm px-3 pr-10 outline-none transition-colors ${
                                    errors.currentPassword && touched.currentPassword
                                        ? 'border-red-500'
                                        : 'border-gray-700 focus:border-amber-400'
                                }`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.currentPassword}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                            >
                                {showCurrentPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                        {errors.currentPassword && touched.currentPassword && (
                            <p className="text-red-400 text-xs font-medium mt-1">{errors.currentPassword}</p>
                        )}
                    </div>

                    {/* New Password Input */}
                    <div className="w-full relative">
                        <label htmlFor="newPassword" className="text-xs font-semibold text-gray-300 block mb-1">
                            New Password
                        </label>
                        <div className="relative">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                placeholder="Enter new password"
                                id="newPassword"
                                className={`w-full h-10 rounded-xl bg-slate-900 border text-white text-sm px-3 pr-10 outline-none transition-colors ${
                                    errors.newPassword && touched.newPassword
                                        ? 'border-red-500'
                                        : 'border-gray-700 focus:border-amber-400'
                                }`}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                value={values.newPassword}
                            />
                            <button
                                type="button"
                                className="absolute right-3 top-2.5 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setShowNewPassword(!showNewPassword)}
                            >
                                {showNewPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                            </button>
                        </div>
                        {errors.newPassword && touched.newPassword && (
                            <p className="text-red-400 text-xs font-medium mt-1">{errors.newPassword}</p>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between gap-3 mt-3 w-full">
                        <button
                            type="button"
                            className="flex-1 py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-gray-300 font-semibold text-sm rounded-xl transition-colors cursor-pointer"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="flex-1 py-2.5 px-4 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-2"
                            disabled={isSubmitting || !isValid}
                        >
                            {isSubmitting ? (
                                <div className="flex items-center justify-center gap-2">
                                    <Spinner borderColor="border-slate-950" />
                                    <span>Updating...</span>
                                </div>
                            ) : (
                                'Update'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>,
        document.body
    );
};

export default ChangePasswordModal;