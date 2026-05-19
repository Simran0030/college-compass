import { Helmet } from '@dr.pogodin/react-helmet';
import { Compass } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AuthPage from './AuthPage';

export default function LoginPage() {
  return (
    <>
      <Helmet>
        <title>Sign In — College Compass</title>
        <meta name="description" content="Sign in to College Compass to save colleges, track your wishlist, and compare institutions." />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-green-50/30 flex flex-col">
        {/* Minimal header */}
        <div className="px-6 py-5">
          <Link to="/" className="inline-flex items-center gap-2 font-bold text-primary text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Compass size={18} className="text-white" />
            </div>
            College Compass
          </Link>
        </div>

        {/* Card */}
        <div className="flex-1 flex items-center justify-center px-4 py-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-md"
          >
            {/* Decorative top bar */}
            <div className="h-1 bg-gradient-to-r from-primary via-secondary to-accent rounded-t-2xl" />

            <div className="bg-white rounded-b-2xl shadow-lg border border-gray-100 border-t-0 px-8 py-8">
              {/* Heading */}
              <div className="text-center mb-7">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Welcome back</h1>
                <p className="text-sm text-gray-500">Sign in to your College Compass account</p>
              </div>

              <AuthPage mode="login" />

              <p className="mt-5 text-center text-sm text-gray-500">
                Don't have an account?{' '}
                <Link to="/signup" className="text-primary font-semibold hover:underline">
                  Create one free
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              By signing in, you agree to our{' '}
              <span className="underline cursor-pointer">Terms</span> and{' '}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
