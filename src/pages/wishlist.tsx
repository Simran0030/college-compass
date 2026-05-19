import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Heart, Trash2, ArrowRight, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useWishlist } from '@/contexts/WishlistContext';
import CollegeCard, { type CollegeCardData } from '@/components/CollegeCard';
import CardSkeleton from '@/components/CardSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.08 } },
};

// Floating heart particle config
const HEARTS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 10 + (i % 4) * 6,
  left: `${8 + (i * 7.5) % 88}%`,
  delay: (i * 0.4) % 3,
  duration: 4 + (i % 3) * 1.5,
  opacity: 0.08 + (i % 3) * 0.05,
}));

export default function WishlistPage() {
  const { wishlistIds, clearWishlist, count } = useWishlist();

  // Fetch all colleges and filter client-side (avoids needing a batch endpoint)
  const { data, isLoading } = useQuery({
    queryKey: ['colleges', 'all-for-wishlist'],
    queryFn: async () => {
      const res = await fetch('/api/colleges?limit=100&page=1');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<{ colleges: CollegeCardData[] }>;
    },
    enabled: count > 0,
  });

  const wislistedColleges = data?.colleges.filter((c) => wishlistIds.includes(c.id)) ?? [];

  return (
    <>
      <Helmet>
        <title>My Saved Colleges — College Compass</title>
        <meta name="description" content="Your shortlisted colleges on College Compass. Review, compare, and make your final decision from your saved institutions." />
        <link rel="canonical" href="https://osovrwkgq3.preview.c36.airoapp.ai/wishlist" />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:title" content="My Saved Colleges — College Compass" />
        <meta property="og:description" content="Review and compare your shortlisted colleges on College Compass." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://osovrwkgq3.preview.c36.airoapp.ai/wishlist" />
        <meta name="twitter:card" content="summary" />
        <meta name="twitter:title" content="My Saved Colleges — College Compass" />
        <meta name="twitter:description" content="Review and compare your shortlisted colleges on College Compass." />
      </Helmet>

      {/* Header */}
      <div className="bg-gradient-to-r from-rose-600 to-rose-500 text-white relative overflow-hidden">
        {/* Floating heart particles */}
        {HEARTS.map((h) => (
          <motion.div
            key={h.id}
            className="absolute pointer-events-none"
            style={{ left: h.left, bottom: '-10%' }}
            animate={{ y: [0, -220], opacity: [0, h.opacity, 0], rotate: [0, 15, -10, 5] }}
            transition={{
              duration: h.duration,
              delay: h.delay,
              repeat: Infinity,
              ease: 'easeOut' as const,
            }}
          >
            <Heart
              size={h.size}
              className="fill-white text-white"
            />
          </motion.div>
        ))}

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Heart size={20} className="text-white/70 fill-white/70" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wide">Saved Colleges</span>
          </div>
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">My Wishlist</h1>
              <p className="text-white/70">
                {count === 0
                  ? 'No colleges saved yet'
                  : `${count} college${count !== 1 ? 's' : ''} saved`}
              </p>
            </div>
            {count > 0 && (
              <button
                onClick={clearWishlist}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <Trash2 size={15} />
                Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {count === 0 ? (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Heart size={36} className="text-rose-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">
              Browse colleges and tap the heart icon to save your favourites here.
            </p>
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <GraduationCap size={16} />
              Browse Colleges
            </Link>
          </motion.div>
        ) : isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: count }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <>
            <motion.div
              initial="hidden"
              animate="visible"
              variants={stagger}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
            >
              <AnimatePresence>
                {wislistedColleges.map((college) => (
                  <motion.div
                    key={college.id}
                    variants={fadeUp}
                    exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                    layout
                  >
                    <CollegeCard college={college} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>

            {/* Compare CTA */}
            {wislistedColleges.length >= 2 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="mt-10 bg-gradient-to-r from-primary/5 to-secondary/5 border border-primary/15 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4"
              >
                <div>
                  <h3 className="font-bold text-gray-900 mb-1">Ready to compare?</h3>
                  <p className="text-gray-500 text-sm">You have {wislistedColleges.length} saved colleges — add them to compare side-by-side.</p>
                </div>
                <Link
                  to="/compare"
                  className="inline-flex items-center gap-2 bg-primary text-white font-bold px-6 py-3 rounded-xl hover:bg-primary/90 transition-colors shrink-0 text-sm"
                >
                  Go to Compare <ArrowRight size={15} />
                </Link>
              </motion.div>
            )}
          </>
        )}
      </div>
    </>
  );
}
