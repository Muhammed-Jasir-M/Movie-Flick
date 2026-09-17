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
    email: '',
    password: '',
};

const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().required('Password is required'),
});

const LoginPage = () => {
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const { login } = useAuthContext();

    const onSubmit = async (values) => {
        try {
            await login(values.email, values.password);
            toast.success("Welcome back!");
            navigate('/');
        } catch (error) {
            toast.error(`Login failed: ${error.message}`);
        }
    };

    const { handleChange, handleBlur, values, handleSubmit, errors, touched, isSubmitting, isValid } = useFormik({
        initialValues,
        validationSchema: loginSchema,
        onSubmit,
    });

    return (
        <section className="min-h-screen pt-24 pb-12 flex justify-center items-center px-4 bg-gradient-to-b from-[#0a1128] via-[#0f172a] to-[#0a1128]">
            <form
                className="flex flex-col w-full max-w-md bg-[#14213d]/80 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl"
                onSubmit={handleSubmit}
            >
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Welcome Back</h1>
                    <p className="text-sm text-gray-400 mt-2">Sign in to your Movie Flick account</p>
                </div>

                {/* Email Field */}
                <div className="mb-5">
                    <label htmlFor="email" className="text-sm font-semibold text-gray-300 block mb-2">
                        Email Address
                    </label>
                    <input
                        type="email"
                        placeholder="you@example.com"
                        id="email"
                        className={`w-full h-12 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 text-sm transition-all ${
                            errors.email && touched.email
                                ? 'border-red-500 focus:ring-2 focus:ring-red-500/50'
                                : 'border-gray-700 focus:border-red-500 focus:ring-2 focus:ring-red-500/30'
                        }`}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        value={values.email}
                    />
                    {errors.email && touched.email && (
                        <p className="text-red-400 font-medium mt-1.5 text-xs">{errors.email}</p>
                    )}
                </div>

                {/* Password Field */}
                <div className="mb-6 relative">
                    <div className="flex justify-between items-center mb-2">
                        <label htmlFor="password" className="text-sm font-semibold text-gray-300">
                            Password
                        </label>
                        <Link to="/reset" className="text-xs text-red-400 hover:text-red-300 transition-colors font-medium">
                            Forgot Password?
                        </Link>
                    </div>

                    <div className="relative">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Enter your password"
                            id="password"
                            className={`w-full h-12 rounded-xl bg-[#0f172a] text-white border outline-none font-medium px-4 pr-12 text-sm transition-all ${
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
                        <p className="text-red-400 font-medium mt-1.5 text-xs">{errors.password}</p>
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
                            <span>Signing In...</span>
                        </div>
                    ) : (
                        'Sign In'
                    )}
                </button>

                {/* Signup Redirect */}
                <p className="text-sm text-center text-gray-400 mt-6">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-white font-semibold hover:text-red-400 hover:underline">
                        Sign Up
                    </Link>
                </p>

                {/* Divider & OAuth */}
                <div className="relative flex py-5 items-center my-2">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-xs font-semibold text-gray-500 uppercase">OR</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                <OAuth />
            </form>
        </section>
    );
};

export default LoginPage;