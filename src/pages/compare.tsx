import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { X, Plus, BarChart2, ArrowRight, Trophy, MapPin, BookOpen, GraduationCap, Zap, IndianRupee, TrendingUp, Briefcase, Star } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { useCompare } from '@/contexts/CompareContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { formatFees, formatPackage } from '@/lib/format';
import { heroImageUrl, siteUrl, withBaseUrl } from '@/lib/site-meta';
import RatingStars from '@/components/RatingStars';

interface College {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  type: string;
  courses: string[];
  placement_percentage: number;
  avg_package: number;
  established: number;
  exam: string[];
}

type MetricKey = 'fees' | 'rating' | 'placement_percentage' | 'avg_package';

function getBestIndex(colleges: College[], key: MetricKey, mode: 'min' | 'max'): number {
  if (colleges.length === 0) return -1;
  let bestIdx = 0;
  for (let i = 1; i < colleges.length; i++) {
    const curr = colleges[i][key] as number;
    const best = colleges[bestIdx][key] as number;
    if (mode === 'min' ? curr < best : curr > best) bestIdx = i;
  }
  return bestIdx;
}

function getInitials(name: string) {
  return name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

const TYPE_BG: Record<string, string> = {
  IIT: 'from-blue-500 to-blue-600',
  NIT: 'from-green-500 to-green-600',
  IIM: 'from-purple-500 to-purple-600',
  IIIT: 'from-cyan-500 to-cyan-600',
  Private: 'from-orange-500 to-orange-600',
  Deemed: 'from-rose-500 to-rose-600',
  State: 'from-teal-500 to-teal-600',
};

const TYPE_COLORS: Record<string, string> = {
  IIT: 'bg-blue-50 text-blue-700 border-blue-100',
  NIT: 'bg-green-50 text-green-700 border-green-100',
  IIM: 'bg-purple-50 text-purple-700 border-purple-100',
  IIIT: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  Private: 'bg-orange-50 text-orange-700 border-orange-100',
  Deemed: 'bg-rose-50 text-rose-700 border-rose-100',
  State: 'bg-teal-50 text-teal-700 border-teal-100',
};

// Floating orb particles for header
const ORBS = [
  { size: 180, top: '-20%', left: '-5%', delay: 0, duration: 8 },
  { size: 120, top: '30%', right: '5%', delay: 1.5, duration: 10 },
  { size: 80, bottom: '-10%', left: '40%', delay: 3, duration: 7 },
];

interface MetricRowProps {
  label: string;
  icon: React.ReactNode;
  colleges: College[];
  bestIdx: number;
  renderValue: (c: College, isBest: boolean) => React.ReactNode;
  renderBar?: (c: College) => number; // 0-100
  winLabel?: string;
  isLast?: boolean;
}

function MetricRow({ label, icon, colleges, bestIdx, renderValue, renderBar, winLabel = 'Best', isLast }: MetricRowProps) {
  const maxBar = renderBar ? Math.max(...colleges.map(renderBar)) : 0;

  return (
    <div className={`grid gap-0 ${!isLast ? 'border-b border-gray-100' : ''}`}
      style={{ gridTemplateColumns: `180px repeat(${colleges.length}, 1fr)` }}
    >
      {/* Label cell */}
      <div className="flex items-center gap-2 px-5 py-4 bg-gray-50/70">
        <span className="text-gray-400">{icon}</span>
        <span className="text-sm font-semibold text-gray-700">{label}</span>
      </div>

      {/* Value cells */}
      {colleges.map((c, i) => {
        const isBest = i === bestIdx;
        const barPct = renderBar ? (renderBar(c) / (maxBar || 1)) * 100 : 0;
        return (
          <div
            key={c.id}
            className={`px-4 py-4 flex flex-col items-center justify-center gap-1.5 transition-colors ${isBest ? 'bg-emerald-50/60' : ''}`}
          >
            {isBest && (
              <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 border border-emerald-200 px-2 py-0.5 rounded-full">
                <Trophy size={9} /> {winLabel}
              </span>
            )}
            <div className={`text-sm font-bold ${isBest ? 'text-emerald-700' : 'text-gray-800'}`}>
              {renderValue(c, isBest)}
            </div>
            {renderBar && (
              <div className="w-full max-w-[80px] h-1.5 bg-gray-200 rounded-full overflow-hidden">
                <motion.div
                  className={`h-full rounded-full ${isBest ? 'bg-emerald-500' : 'bg-gray-400'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${barPct}%` }}
                  transition={{ duration: 0.8, delay: 0.3, ease: 'easeOut' as const }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function ComparePage() {
  const { compareIds, removeCollege, clearAll } = useCompare();
  const { wishlistIds, addToWishlist } = useWishlist();
  const pageUrl = withBaseUrl('/compare');
  const rootUrl = siteUrl || withBaseUrl('/');

  const { data: colleges, isLoading } = useQuery<College[]>({
    queryKey: ['compare', compareIds],
    queryFn: async () => {
      if (compareIds.length === 0) return [];
      const res = await fetch(`/api/compare?ids=${compareIds.join(',')}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
    enabled: compareIds.length > 0,
  });

  const data = colleges ?? [];

  const bestFees = getBestIndex(data, 'fees', 'min');
  const bestRating = getBestIndex(data, 'rating', 'max');
  const bestPlacement = getBestIndex(data, 'placement_percentage', 'max');
  const bestPackage = getBestIndex(data, 'avg_package', 'max');

  return (
    <>
      <Helmet>
        <title>Compare Colleges Side-by-Side — College Compass</title>
        <meta name="description" content="Compare up to 3 Indian colleges side-by-side on fees, placement rates, average packages, ratings, and more. Make a confident college choice." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Compare Colleges Side-by-Side — College Compass" />
        <meta property="og:description" content="Compare up to 3 colleges on fees, placements, ratings, and more with our visual comparison tool. Find the best college for you." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={heroImageUrl} />
        <meta property="og:image:alt" content="College comparison tool on College Compass" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Compare Colleges Side-by-Side — College Compass" />
        <meta name="twitter:description" content="Compare up to 3 colleges on fees, placements, ratings, and more. Find the best college for you." />
        <meta name="twitter:image" content={heroImageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Compare Colleges — College Compass",
          "description": "Compare up to 3 Indian colleges side-by-side on fees, placement rates, average packages, and ratings.",
          "url": pageUrl,
          "isPartOf": {
            "@type": "WebSite",
            "name": "College Compass",
            "url": rootUrl
          }
        })}</script>
      </Helmet>

      {/* ── Header ── */}
      <div className="relative bg-gradient-to-r from-primary to-secondary text-white overflow-hidden">
        {/* Animated orbs */}
        {ORBS.map((orb, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: orb.size,
              height: orb.size,
              top: orb.top,
              left: 'left' in orb ? orb.left : undefined,
              right: 'right' in orb ? (orb as { right: string }).right : undefined,
              bottom: 'bottom' in orb ? (orb as { bottom: string }).bottom : undefined,
              background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)',
            }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: orb.duration, delay: orb.delay, repeat: Infinity, ease: 'easeInOut' as const }}
          />
        ))}

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <div className="flex items-end justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <BarChart2 size={18} className="text-white/70" />
                <span className="text-white/70 text-sm font-medium uppercase tracking-wide">Side-by-side</span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold mb-1">Compare Colleges</h1>
              <p className="text-white/70">
                {data.length > 0
                  ? `Comparing ${data.length} college${data.length !== 1 ? 's' : ''} — green highlights show the best value`
                  : 'Add colleges from the listing page to compare them here'}
              </p>
            </div>
            {data.length > 0 && (
              <button
                onClick={clearAll}
                className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/25 text-white text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors"
              >
                <X size={14} /> Clear All
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {compareIds.length < 2 ? (
          /* ── Empty state ── */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-24 bg-white rounded-2xl border border-gray-100"
          >
            <div className="w-20 h-20 bg-primary/5 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <BarChart2 size={36} className="text-primary/40" />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              {compareIds.length === 0 ? 'No colleges selected' : 'Add one more college'}
            </h2>
            <p className="text-gray-400 text-sm mb-7 max-w-xs mx-auto">
              {compareIds.length === 0
                ? 'Browse colleges and click the "+" button on any card to add them here.'
                : 'You need at least 2 colleges to compare. Add one more from the listing page.'}
            </p>
            <Link
              to="/colleges"
              className="inline-flex items-center gap-2 bg-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors"
            >
              <GraduationCap size={16} /> Browse Colleges
            </Link>
          </motion.div>
        ) : isLoading ? (
          /* ── Loading skeleton ── */
          <div className="space-y-4">
            <div className="grid gap-4" style={{ gridTemplateColumns: `180px repeat(${compareIds.length}, 1fr)` }}>
              <div />
              {compareIds.map((id) => (
                <div key={id} className="h-36 bg-gray-100 rounded-2xl animate-pulse" />
              ))}
            </div>
            <div className="h-64 bg-gray-100 rounded-2xl animate-pulse" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            {/* ── College header cards ── */}
            <div
              className="grid mb-5 items-stretch"
              style={{ gridTemplateColumns: `180px repeat(${data.length}, 1fr)` }}
            >
              {/* Label column header */}
              <div className="flex items-end pb-3 px-2">
                <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Metric</span>
              </div>

              {/* College cards */}
              <AnimatePresence>
                {data.map((college, idx) => {
                  const gradient = TYPE_BG[college.type] || 'from-gray-500 to-gray-600';
                  const typeColor = TYPE_COLORS[college.type] || 'bg-gray-50 text-gray-600 border-gray-100';
                  const isWishlisted = wishlistIds.includes(college.id);
                  return (
                    <motion.div
                      key={college.id}
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.08 }}
                      className="px-2"
                    >
                      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden relative">
                        {/* Top accent */}
                        <div className={`h-1.5 w-full bg-gradient-to-r ${gradient}`} />
                        <div className="p-4">
                          {/* Remove button */}
                          <button
                            onClick={() => removeCollege(college.id)}
                            className="absolute top-3 right-3 w-6 h-6 flex items-center justify-center rounded-full bg-gray-100 hover:bg-red-100 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X size={12} />
                          </button>

                          {/* Avatar + name */}
                          <div className="flex flex-col items-center text-center gap-2">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-sm`}>
                              <span className="text-white font-bold text-sm">{getInitials(college.name)}</span>
                            </div>
                            <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${typeColor}`}>
                              {college.type}
                            </span>
                            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2">
                              {college.name}
                            </h3>
                            <div className="flex items-center gap-1 text-gray-400 text-xs">
                              <MapPin size={11} />
                              <span>{college.location}</span>
                            </div>
                            <RatingStars rating={college.rating} size="sm" />
                          </div>

                          {/* Actions */}
                          <div className="mt-3 flex gap-1.5">
                            <Link
                              to={`/colleges/${college.id}`}
                              className="flex-1 text-center text-xs font-semibold bg-primary/10 text-primary py-1.5 rounded-lg hover:bg-primary/20 transition-colors"
                            >
                              View
                            </Link>
                            {!isWishlisted && (
                              <button
                                onClick={() => addToWishlist(college.id)}
                                className="text-xs font-semibold border border-gray-200 text-gray-500 px-2 py-1.5 rounded-lg hover:border-rose-300 hover:text-rose-500 transition-colors"
                                title="Save to wishlist"
                              >
                                ♡
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* ── Metrics table ── */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <MetricRow
                label="Annual Fees"
                icon={<IndianRupee size={14} />}
                colleges={data}
                bestIdx={bestFees}
                winLabel="Lowest"
                renderValue={(c) => formatFees(c.fees)}
                renderBar={(c) => 1 / c.fees * 1e8}
              />
              <MetricRow
                label="Rating"
                icon={<Star size={14} />}
                colleges={data}
                bestIdx={bestRating}
                winLabel="Highest"
                renderValue={(c) => (
                  <div className="flex flex-col items-center gap-1">
                    <span>{c.rating.toFixed(1)}</span>
                    <RatingStars rating={c.rating} size="sm" />
                  </div>
                )}
                renderBar={(c) => c.rating * 20}
              />
              <MetricRow
                label="Placement %"
                icon={<TrendingUp size={14} />}
                colleges={data}
                bestIdx={bestPlacement}
                winLabel="Best"
                renderValue={(c) => `${c.placement_percentage}%`}
                renderBar={(c) => c.placement_percentage}
              />
              <MetricRow
                label="Avg Package"
                icon={<Briefcase size={14} />}
                colleges={data}
                bestIdx={bestPackage}
                winLabel="Highest"
                renderValue={(c) => formatPackage(c.avg_package)}
                renderBar={(c) => c.avg_package}
              />
              <MetricRow
                label="Location"
                icon={<MapPin size={14} />}
                colleges={data}
                bestIdx={-1}
                renderValue={(c) => <span className="text-gray-700 font-normal">{c.location}</span>}
              />
              <MetricRow
                label="Established"
                icon={<GraduationCap size={14} />}
                colleges={data}
                bestIdx={-1}
                renderValue={(c) => <span className="text-gray-700 font-normal">{c.established}</span>}
              />
              <MetricRow
                label="Courses"
                icon={<BookOpen size={14} />}
                colleges={data}
                bestIdx={-1}
                renderValue={(c) => (
                  <span className="text-gray-700 font-normal">{c.courses.length} programs</span>
                )}
              />
              <MetricRow
                label="Exams Accepted"
                icon={<Zap size={14} />}
                colleges={data}
                bestIdx={-1}
                isLast
                renderValue={(c) => (
                  <div className="flex flex-wrap justify-center gap-1">
                    {c.exam.map((e) => (
                      <span key={e} className="text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded font-medium">
                        {e}
                      </span>
                    ))}
                  </div>
                )}
              />
            </div>

            {/* ── Footer row ── */}
            <div className="mt-5 flex items-center justify-between flex-wrap gap-3">
              {/* Legend */}
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <div className="w-3 h-3 bg-emerald-100 rounded border border-emerald-300" />
                <span>Green = best value in that category</span>
              </div>

              {/* Add more / browse */}
              {data.length < 3 ? (
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-2 border border-dashed border-primary text-primary text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-primary/5 transition-colors"
                >
                  <Plus size={15} /> Add Another College
                </Link>
              ) : (
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-2 text-primary text-sm font-semibold hover:underline"
                >
                  Browse more colleges <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
