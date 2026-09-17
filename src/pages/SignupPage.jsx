import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../store/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import OAuth from '../components/OAuth';
import Spinner from '../components/Spinner';

const initialValues = {
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
};

const signupSchema = Yup.object().shape({
    name: Yup.string().min(2, 'Too Short!').max(50, 'Too Long!').required('Full name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required').matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number'),
    password: Yup.string()
        .required('Password is required')
        .min(6, 'Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/, 'Must contain uppercase, lowercase & number'),
    confirmPassword: Yup.string()
        .required('Please confirm your password')
        .oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

const SignupPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const navigate = useNavigate();
    const { signup } = useAuthContext();

    const onSubmit = async (values) => {
        try {
            await signup(values.name, values.email, values.password, values.phone);
            toast.success("Account created successfully!");
            navigate('/');
        } catch (error) {
            toast.error(`Signup failed: ${error.message}`);
        }
    };

    const { handleChange, handleBlur, values, handleSubmit, errors, touched, isSubmitting, isValid } = useFormik({
        initialValues,
        validationSchema: signupSchema,
        onSubmit,
    });

    return (
        <section className="min-h-screen pt-24 pb-12 flex justify-center items-center px-4 bg-gradient-to-b from-[#0a1128] via-[#0f172a] to-[#0a1128]">
            <form
                className="flex flex-col w-full max-w-lg bg-[#14213d]/80 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl my-6"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-6">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Create Account</h1>
                    <p className="text-sm text-gray-400 mt-2">Join Movie Flick to save watchlists and explore</p>
                </div>

                {/* Name */}
                <div className="mb-4">
                    <label htmlFor="name" className="text-sm font-semibold text-gray-300 block mb-1.5">
                        Full Name
                    </label>
                    <input
                        type="text"
                        placeholder="John Doe"
                        id="name"
                        className={`w-full h-11 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 text-sm transition-all ${
                            errors.name && touched.name
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.name}
                    />
                    {errors.name && touched.name && (
                        <p className="text-red-400 font-medium mt-1 text-xs">{errors.name}</p>
                    )}
                </div>

                {/* Email */}
                <div className="mb-4">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-300 block mb-1.5">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        id="email"
                        className={`w-full h-11 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 text-sm transition-all ${
                            errors.email && touched.email
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && (
                        <p className="text-red-400 font-medium mt-1 text-xs">{errors.email}</p>
                    )}
                </div>

                {/* Phone */}
                <div className="mb-4">
                    <label htmlFor="phone" className="text-sm font-semibold text-gray-300 block mb-1.5">
                        Phone Number
                    </label>
                    <input
                        type="tel"
                        placeholder="+1 234 567 890"
                        id="phone"
                        className={`w-full h-11 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 text-sm transition-all ${
                            errors.phone && touched.phone
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.phone}
                    />
                    {errors.phone && touched.phone && (
                        <p className="text-red-400 font-medium mt-1 text-xs">{errors.phone}</p>
                    )}
                </div>

                {/* Password */}
                <div className="mb-4 relative">
                    <label htmlFor="password" className="text-sm font-semibold text-gray-300 block mb-1.5">
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Create a strong password"
                            id="password"
                            className={`w-full h-11 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 pr-12 text-sm transition-all ${
                                errors.password && touched.password
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                    : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                            }`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.password}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    {errors.password && touched.password && (
                        <p className="text-red-400 font-medium mt-1 text-xs">{errors.password}</p>
                    )}
                </div>

                {/* Confirm Password */}
                <div className="mb-6 relative">
                    <label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-300 block mb-1.5">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Confirm your password"
                            id="confirmPassword"
                            className={`w-full h-11 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 pr-12 text-sm transition-all ${
                                errors.confirmPassword && touched.confirmPassword
                                    ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                    : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                            }`}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.confirmPassword}
                        />
                        <button
                            type="button"
                            className="absolute top-1/2 -translate-y-1/2 right-4 text-gray-400 hover:text-white transition-colors"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                        </button>
                    </div>
                    {errors.confirmPassword && touched.confirmPassword && (
                        <p className="text-red-400 font-medium mt-1 text-xs">{errors.confirmPassword}</p>
                    )}
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                    disabled={isSubmitting || !isValid}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <Spinner borderColor="border-white" />
                            <span>Creating Account...</span>
                        </div>
                    ) : (
                        'Sign Up'
                    )}
                </button>

                {/* Login Redirect */}
                <p className="text-sm text-center text-gray-400 mt-5">
                    Already have an account?{' '}
                    <Link to="/login" className="text-white font-semibold hover:text-red-400 hover:underline">
                        Sign In
                    </Link>
                </p>

                {/* Divider & OAuth */}
                <div className="relative flex py-4 items-center my-1">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-gray-500 uppercase">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <OAuth />
            </form>
        </section>
    );
};

export default SignupPage;