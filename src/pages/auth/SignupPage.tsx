import { Helmet } from '@dr.pogodin/react-helmet';
import { Compass, GraduationCap, Heart, BarChart2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import AuthPage from './AuthPage';

const PERKS = [
  { icon: <Heart size={14} className="text-rose-500" />, text: 'Save colleges to your wishlist' },
  { icon: <BarChart2 size={14} className="text-primary" />, text: 'Compare colleges side-by-side' },
  { icon: <GraduationCap size={14} className="text-secondary" />, text: 'Track your admission journey' },
];

export default function SignupPage() {
  return (
    <>
      <Helmet>
        <title>Create Account — College Compass</title>
        <meta name="description" content="Create a free College Compass account to save colleges, compare institutions, and track your admission journey." />
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
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Create your account</h1>
                <p className="text-sm text-gray-500">Free forever. No credit card needed.</p>
              </div>

              {/* Perks */}
              <div className="flex flex-wrap justify-center gap-3 mb-6">
                {PERKS.map((p) => (
                  <span key={p.text} className="flex items-center gap-1.5 bg-gray-50 border border-gray-100 text-gray-600 text-xs font-medium px-3 py-1.5 rounded-full">
                    {p.icon} {p.text}
                  </span>
                ))}
              </div>

              <AuthPage mode="signup" />

              <p className="mt-5 text-center text-sm text-gray-500">
                Already have an account?{' '}
                <Link to="/login" className="text-primary font-semibold hover:underline">
                  Sign in
                </Link>
              </p>
            </div>

            <p className="text-center text-xs text-gray-400 mt-5">
              By creating an account, you agree to our{' '}
              <span className="underline cursor-pointer">Terms</span> and{' '}
              <span className="underline cursor-pointer">Privacy Policy</span>.
            </p>
          </motion.div>
        </div>
      </div>
    </>
  );
}
