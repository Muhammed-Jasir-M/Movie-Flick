import React, { useState, useRef } from 'react';
import { useAuthContext } from '../store/authContext';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { FaUserCircle } from 'react-icons/fa';
import Spinner from '../components/Spinner';
import { ImPencil } from 'react-icons/im';
import { toast } from 'react-toastify';
import DeleteModal from '../components/DeleteModal';
import ChangePasswordModal from '../components/ChangePasswordModal';

const Profile = () => {
    const [imageFile, setImageFile] = useState(null);
    const [imageFileUrl, setImageFileUrl] = useState(null);
    const [isEditing, setIsEditing] = useState(false);

    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

    const imagePickerRef = useRef(null);
    const { user, userData, uploadImage, updateUserProfile } = useAuthContext();

    const initialValues = {
        name: user?.displayName || '',
        email: user?.email || '',
        phone: user?.phoneNumber || userData?.phone || '',
    };

    const profileSchema = Yup.object().shape({
        name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
        phone: Yup.string().required('Phone number is required').matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    });

    const onSubmit = async (values) => {
        try {
            if (imageFile) {
                const imageURL = await uploadImage(imageFile);
                await updateUserProfile(values.name, values.phone, imageURL);
            } else {
                await updateUserProfile(values.name, values.phone);
            }

            toast.success('Profile updated successfully');
            setIsEditing(false);
        } catch (error) {
            toast.error(`Failed to update profile: ${error.message}`);
        }
    };

    const { handleChange, handleBlur, values, handleSubmit, errors, touched, isSubmitting, isValid } = useFormik({
        initialValues,
        validationSchema: profileSchema,
        onSubmit,
    });

    const handleChangeImage = (e) => {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            if (file.size <= 2 * 1024 * 1024) {
                setImageFile(file);
                setImageFileUrl(URL.createObjectURL(file));
            } else {
                toast.error('Please select an image file smaller than 2MB.');
            }
        } else {
            toast.error('Please select a valid image file.');
        }
    };

    return (
        <section className="pt-24 pb-12 min-h-screen flex flex-col items-center px-4 bg-gradient-to-b from-[#0a1128] via-[#0f172a] to-[#0a1128]">
            <div className="w-full max-w-lg bg-[#14213d]/80 backdrop-blur-md p-8 rounded-2xl border border-gray-800 shadow-2xl mt-4">
                <h1 className="text-3xl font-extrabold text-white text-center mb-6">Account Profile</h1>

                <form className="flex flex-col gap-5" onSubmit={handleSubmit}>
                    {/* Avatar Upload */}
                    <div className="w-full flex justify-center relative my-2">
                        <div className="relative group cursor-pointer" onClick={() => imagePickerRef.current.click()}>
                            {user?.photoURL || imageFileUrl ? (
                                <img
                                    src={imageFileUrl || user.photoURL}
                                    alt="Profile"
                                    className="rounded-full border-4 border-red-500/80 object-cover h-28 w-28 shadow-xl"
                                    referrerPolicy="no-referrer"
                                />
                            ) : (
                                <FaUserCircle className="h-28 w-28 text-gray-400" />
                            )}
                            <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <ImPencil className="text-white text-xl" />
                            </div>
                        </div>

                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleChangeImage}
                            ref={imagePickerRef}
                            className="hidden"
                        />
                    </div>

                    {/* Name */}
                    <div className="relative">
                        <label htmlFor="name" className="text-sm font-semibold text-gray-300 block mb-1.5">
                            Full Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            placeholder="Name"
                            className={`w-full h-11 rounded-xl text-white font-medium px-4 text-sm border outline-none transition-all ${
                                !isEditing ? 'bg-slate-900/60 border-transparent text-gray-300' : 'bg-[#0f172a] border-gray-700 focus:border-red-500'
                            } ${isEditing && errors.name && touched.name && 'border-red-500'}`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            readOnly={!isEditing}
                            value={values.name}
                        />
                        {isEditing && errors.name && touched.name && (
                            <p className="text-red-400 font-medium mt-1 text-xs">{errors.name}</p>
                        )}
                        {!isEditing && (
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                <ImPencil size={14} />
                            </button>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <label htmlFor="email" className="text-sm font-semibold text-gray-300 block mb-1.5">
                            Email Address (Read only)
                        </label>
                        <input
                            type="text"
                            id="email"
                            className="w-full h-11 rounded-xl bg-slate-900/60 text-gray-400 font-medium px-4 text-sm border border-transparent outline-none cursor-not-allowed"
                            readOnly={true}
                            value={values.email}
                        />
                    </div>

                    {/* Phone */}
                    <div className="relative">
                        <label htmlFor="phone" className="text-sm font-semibold text-gray-300 block mb-1.5">
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Phone"
                            className={`w-full h-11 rounded-xl text-white font-medium px-4 text-sm border outline-none transition-all ${
                                !isEditing ? 'bg-slate-900/60 border-transparent text-gray-300' : 'bg-[#0f172a] border-gray-700 focus:border-red-500'
                            } ${isEditing && errors.phone && touched.phone && 'border-red-500'}`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            readOnly={!isEditing}
                            value={values.phone}
                        />
                        {isEditing && errors.phone && touched.phone && (
                            <p className="text-red-400 font-medium mt-1 text-xs">{errors.phone}</p>
                        )}
                        {!isEditing && (
                            <button
                                type="button"
                                className="absolute right-3 top-9 text-gray-400 hover:text-white transition-colors"
                                onClick={() => setIsEditing(true)}
                            >
                                <ImPencil size={14} />
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    {isEditing && (
                        <div className="flex gap-3 mt-2">
                            <button
                                type="submit"
                                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2.5 rounded-xl font-bold text-sm shadow-md transition-all cursor-pointer"
                                disabled={isSubmitting || !isValid}
                            >
                                {isSubmitting ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <Spinner borderColor="border-white" />
                                        <span>Saving...</span>
                                    </div>
                                ) : (
                                    'Save Changes'
                                )}
                            </button>
                            <button
                                type="button"
                                className="bg-gray-800 hover:bg-gray-700 text-gray-300 px-4 py-2.5 rounded-xl font-semibold text-sm transition-colors cursor-pointer"
                                onClick={() => setIsEditing(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    )}
                </form>

                {/* Account Settings Controls */}
                <div className="pt-6 mt-6 border-t border-gray-800 flex flex-wrap justify-between items-center gap-3">
                    {user?.providerData?.[0]?.providerId === 'password' && (
                        <button
                            type="button"
                            className="bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-gray-700"
                            onClick={() => setShowChangePasswordModal(true)}
                        >
                            Change Password
                        </button>
                    )}

                    <button
                        type="button"
                        className="bg-red-950/60 hover:bg-red-900/80 text-red-400 hover:text-red-300 px-4 py-2 text-xs font-semibold rounded-lg transition-colors cursor-pointer border border-red-900/50"
                        onClick={() => setShowDeleteModal(true)}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

            <DeleteModal showModal={showDeleteModal} onClose={() => setShowDeleteModal(false)} user={user} />
            <ChangePasswordModal showModal={showChangePasswordModal} onClose={() => setShowChangePasswordModal(false)} user={user} />
        </section>
    );
};

export default Profile;