import React from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAuthContext } from '../store/authContext';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import Spinner from './Spinner';
import { FaKey, FaArrowLeft } from 'react-icons/fa';

const initialValues = {
    email: '',
};

const schema = Yup.object().shape({
    email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
});

const ResetPassword = () => {
    const navigate = useNavigate();
    const { resetPassword } = useAuthContext();

    const onSubmit = async (values) => {
        try {
            await resetPassword(values.email);
            toast.success("Password reset link sent to your email!");
            navigate('/login');
        } catch (error) {
            toast.error(`Reset failed: ${error.message}`);
        }
    };

    const { handleChange, handleBlur, values, handleSubmit, errors, touched, isSubmitting, isValid } = useFormik({
        initialValues,
        validationSchema: schema,
        onSubmit,
    });

    return (
        <section className="min-h-screen pt-24 pb-12 flex justify-center items-center px-4 bg-gradient-to-b from-[#0a1128] via-[#0f172a] to-[#0a1128]">
            <form
                className="flex flex-col w-full max-w-md bg-[#14213d]/80 backdrop-blur-md p-8 md:p-10 rounded-2xl border border-gray-800 shadow-2xl relative"
                onSubmit={handleSubmit}
            >
                {/* Header Icon */}
                <div className="flex flex-col items-center text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-4 shadow-xl">
                        <FaKey size={22} />
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">Reset Password</h1>
                    <p className="text-sm text-gray-400 mt-2 leading-relaxed">
                        Enter your email address and we'll send you a link to reset your password.
                    </p>
                </div>

                {/* Email Field */}
                <div className="mb-6">
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

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold text-base shadow-lg shadow-red-600/30 transition-all hover:scale-[1.01] active:scale-[0.99] cursor-pointer mb-6"
                    disabled={isSubmitting || !isValid}
                >
                    {isSubmitting ? (
                        <div className="flex items-center justify-center gap-3">
                            <Spinner borderColor="border-white" />
                            <span>Sending Reset Link...</span>
                        </div>
                    ) : (
                        'Send Reset Link'
                    )}
                </button>

                {/* Back to Login Redirect */}
                <div className="text-center pt-4 border-t border-gray-800">
                    <Link
                        to="/login"
                        className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors font-medium"
                    >
                        <FaArrowLeft size={12} />
                        <span>Back to Sign In</span>
                    </Link>
                </div>
            </form>
        </section>
    );
};

export default ResetPassword;