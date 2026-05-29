import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Zap, TrendingUp, MapPin, ArrowRight, AlertCircle, Target,
  GraduationCap, IndianRupee, Briefcase, ChevronDown, CheckCircle2,
  Trophy, Star, Info,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import { formatFees, formatPackage } from '@/lib/format';
import { heroImageUrl, siteUrl, withBaseUrl } from '@/lib/site-meta';
import RatingStars from '@/components/RatingStars';

/* ─── Constants ─────────────────────────────────────────── */

const EXAMS = [
  { value: 'JEE Advanced',       label: 'JEE Advanced',       hint: 'IITs & premium institutes' },
  { value: 'JEE Mains',          label: 'JEE Mains',          hint: 'NITs, IIITs & GFTIs' },
  { value: 'CAT',                label: 'CAT',                 hint: 'IIMs & top B-schools' },
  { value: 'GATE',               label: 'GATE',                hint: 'M.Tech & PSU recruitment' },
  { value: 'Management Quota',   label: 'Management Quota',    hint: 'Direct admission seats' },
  { value: 'BITSAT',             label: 'BITSAT',              hint: 'BITS Pilani campuses' },
  { value: 'VITEEE',             label: 'VITEEE',              hint: 'VIT University campuses' },
];

const RANK_HINTS: Record<string, { ranges: { label: string; max: number; color: string; desc: string }[] }> = {
  'JEE Advanced': {
    ranges: [
      { label: 'Top IITs', max: 1000,  color: 'text-emerald-600', desc: 'IIT Bombay, Delhi, Madras' },
      { label: 'Good IITs', max: 5000, color: 'text-blue-600',    desc: 'IIT Roorkee, Kharagpur, Kanpur' },
      { label: 'All IITs',  max: 15000, color: 'text-amber-600',  desc: 'Newer IITs & branches' },
    ],
  },
  'JEE Mains': {
    ranges: [
      { label: 'Top NITs',  max: 10000,  color: 'text-emerald-600', desc: 'NIT Trichy, Warangal, Surathkal' },
      { label: 'Good NITs', max: 50000,  color: 'text-blue-600',    desc: 'Most NITs & IIITs' },
      { label: 'All NITs',  max: 200000, color: 'text-amber-600',   desc: 'All NITs & state colleges' },
    ],
  },
  'CAT': {
    ranges: [
      { label: 'IIM A/B/C',    max: 100,  color: 'text-emerald-600', desc: 'Top 3 IIMs' },
      { label: 'Top IIMs',     max: 500,  color: 'text-blue-600',    desc: 'IIM Lucknow, Kozhikode' },
      { label: 'All IIMs',     max: 2000, color: 'text-amber-600',   desc: 'All IIMs & top B-schools' },
    ],
  },
};

const TYPE_COLORS: Record<string, string> = {
  IIT:     'bg-blue-100 text-blue-700 border-blue-200',
  NIT:     'bg-green-100 text-green-700 border-green-200',
  IIM:     'bg-purple-100 text-purple-700 border-purple-200',
  IIIT:    'bg-cyan-100 text-cyan-700 border-cyan-200',
  Private: 'bg-orange-100 text-orange-700 border-orange-200',
  Deemed:  'bg-rose-100 text-rose-700 border-rose-200',
  State:   'bg-teal-100 text-teal-700 border-teal-200',
};

const TYPE_GRADIENT: Record<string, string> = {
  IIT:     'from-blue-500 to-blue-600',
  NIT:     'from-green-500 to-green-600',
  IIM:     'from-purple-500 to-purple-600',
  IIIT:    'from-cyan-500 to-cyan-600',
  Private: 'from-orange-400 to-orange-500',
  Deemed:  'from-rose-400 to-rose-500',
  State:   'from-teal-500 to-teal-600',
};

/* ─── Helpers ────────────────────────────────────────────── */

function getInitials(name: string) {
  return name.split(' ').filter((w) => w.length > 2).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
}

function getConfidence(rankGap: number, cutoff: number): { label: string; color: string; bg: string; pct: number } {
  const ratio = rankGap / cutoff;
  if (ratio > 0.3)  return { label: 'High Chance',    color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200', pct: 92 };
  if (ratio > 0.1)  return { label: 'Good Chance',    color: 'text-blue-700',    bg: 'bg-blue-50 border-blue-200',       pct: 75 };
  if (ratio > 0)    return { label: 'Moderate Chance', color: 'text-amber-700',  bg: 'bg-amber-50 border-amber-200',     pct: 55 };
  return              { label: 'Borderline',           color: 'text-rose-700',   bg: 'bg-rose-50 border-rose-200',       pct: 35 };
}

/* ─── Interfaces ─────────────────────────────────────────── */

interface PredictedCollege {
  id: number; name: string; location: string; fees: number;
  rating: number; type: string; placement_percentage: number;
  avg_package: number; cutoff_rank: number; exam: string[];
}

interface PredictResult { colleges: PredictedCollege[]; exam: string; rank: number; }

/* ─── Sub-components ─────────────────────────────────────── */

function RankHintBox({ exam, rank }: { exam: string; rank: number }) {
  const hints = RANK_HINTS[exam];
  if (!hints) return null;
  const active = hints.ranges.find((r) => rank <= r.max);
  if (!active) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -6 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-xl px-4 py-3 mt-2"
    >
      <Info size={14} className="text-primary mt-0.5 shrink-0" />
      <div>
        <span className={`text-xs font-bold ${active.color}`}>{active.label}: </span>
        <span className="text-xs text-gray-600">{active.desc}</span>
      </div>
    </motion.div>
  );
}

function ResultCard({ college, index, userRank }: { college: PredictedCollege; index: number; userRank: number }) {
  const rankGap = college.cutoff_rank - userRank;
  const confidence = getConfidence(rankGap, college.cutoff_rank);
  const gradient = TYPE_GRADIENT[college.type] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.4 }}
      className="bg-white rounded-2xl border border-gray-100 hover:border-primary/25 hover:shadow-md transition-all overflow-hidden group"
    >
      {/* Colored top strip */}
      <div className={`h-1 bg-gradient-to-r ${gradient}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Avatar */}
          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-sm">{getInitials(college.name)}</span>
          </div>

          <div className="flex-1 min-w-0">
            {/* Header row */}
            <div className="flex items-start justify-between gap-2 mb-1">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-1.5 mb-1">
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[college.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                    {college.type}
                  </span>
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full border ${confidence.bg} ${confidence.color}`}>
                    {confidence.label}
                  </span>
                </div>
                <h3 className="font-bold text-gray-900 text-base leading-tight">{college.name}</h3>
                <div className="flex items-center gap-3 text-xs text-gray-500 mt-1">
                  <span className="flex items-center gap-1"><MapPin size={11} />{college.location}</span>
                  <RatingStars rating={college.rating} size="sm" />
                  <span className="font-medium text-gray-700">{college.rating.toFixed(1)}</span>
                </div>
              </div>

              {/* Rank badge */}
              <div className="shrink-0 text-center">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center font-bold text-primary text-sm">
                  #{index + 1}
                </div>
              </div>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-2 mt-3">
              <div className="bg-gray-50 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-0.5"><IndianRupee size={12} className="text-gray-400" /></div>
                <div className="text-xs font-bold text-gray-900">{formatFees(college.fees)}</div>
                <div className="text-[10px] text-gray-400">Annual Fees</div>
              </div>
              <div className="bg-green-50 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-0.5"><TrendingUp size={12} className="text-green-500" /></div>
                <div className="text-xs font-bold text-green-700">{college.placement_percentage}%</div>
                <div className="text-[10px] text-gray-400">Placement</div>
              </div>
              <div className="bg-amber-50 rounded-xl p-2.5 text-center">
                <div className="flex justify-center mb-0.5"><Briefcase size={12} className="text-amber-500" /></div>
                <div className="text-xs font-bold text-amber-700">{formatPackage(college.avg_package)}</div>
                <div className="text-[10px] text-gray-400">Avg Package</div>
              </div>
            </div>

            {/* Cutoff + rank gap */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-50">
              <div className="flex items-center gap-3 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Target size={11} />
                  Cutoff: <span className="font-semibold text-gray-800">Rank {college.cutoff_rank.toLocaleString()}</span>
                </span>
                {rankGap > 0 && (
                  <span className="flex items-center gap-1 text-emerald-600 font-semibold">
                    <CheckCircle2 size={11} />
                    {rankGap.toLocaleString()} ranks ahead
                  </span>
                )}
              </div>
              <Link
                to={`/colleges/${college.id}`}
                className="flex items-center gap-1 text-primary font-semibold text-xs hover:gap-2 transition-all"
              >
                View Details <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Page ───────────────────────────────────────────────── */

export default function PredictorPage() {
  const pageUrl = withBaseUrl('/predictor');
  const rootUrl = siteUrl || withBaseUrl('/');
  const [exam, setExam] = useState('');
  const [rank, setRank] = useState('');
  const [result, setResult] = useState<PredictResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const rankNum = parseInt(rank, 10);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setResult(null);
    if (!exam) { setError('Please select an exam.'); return; }
    if (!rank || isNaN(rankNum) || rankNum < 1) { setError('Please enter a valid rank (positive number).'); return; }
    setIsLoading(true);
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ exam, rank: rankNum }),
      });
      if (!res.ok) { const d = await res.json(); throw new Error(d.error || 'Prediction failed'); }
      setResult(await res.json());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const selectedExam = EXAMS.find((e) => e.value === exam);

  return (
    <>
      <Helmet>
        <title>College Admission Predictor — College Compass</title>
        <meta name="description" content="Predict which Indian colleges you can get admission to based on your JEE, CAT, GATE, or BITSAT rank. Instant results from 40+ top institutions." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="College Admission Predictor — College Compass" />
        <meta property="og:description" content="Enter your exam and rank to instantly see which IITs, NITs, IIMs, and private colleges you're eligible for. Free admission predictor tool." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={heroImageUrl} />
        <meta property="og:image:alt" content="College admission predictor tool on College Compass" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Admission Predictor — College Compass" />
        <meta name="twitter:description" content="Enter your exam and rank to instantly see which colleges you're eligible for. Free tool." />
        <meta name="twitter:image" content={heroImageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebApplication",
          "name": "College Admission Predictor",
          "url": pageUrl,
          "description": "Predict college admissions based on your JEE, CAT, GATE, or BITSAT rank.",
          "applicationCategory": "EducationApplication",
          "operatingSystem": "Web",
          "isPartOf": { "@type": "WebSite", "name": "College Compass", "url": rootUrl }
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <div className="relative bg-gradient-to-br from-gray-900 via-[#1a2f4a] to-[#0f2040] text-white overflow-hidden">
        {/* Orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(21,128,61,0.25) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute -bottom-16 -left-16 w-56 h-56 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(251,191,36,0.15) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        />

        <div className="relative max-w-4xl mx-auto px-4 py-14 text-center">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="w-16 h-16 bg-amber-400/20 border border-amber-400/30 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Zap size={30} className="text-amber-400" />
            </div>
            <h1 className="text-3xl md:text-5xl font-bold mb-3 tracking-tight">
              College Admission <span className="text-amber-400">Predictor</span>
            </h1>
            <p className="text-white/65 text-lg max-w-xl mx-auto mb-8">
              Enter your exam and rank to instantly discover which top colleges you're eligible for.
            </p>

            {/* Trust chips */}
            <div className="flex flex-wrap justify-center gap-3">
              {[
                { icon: <GraduationCap size={13} />, text: '40+ colleges analysed' },
                { icon: <Target size={13} />,        text: 'Rank-based matching' },
                { icon: <Star size={13} />,          text: 'Confidence indicators' },
              ].map((chip) => (
                <span key={chip.text} className="flex items-center gap-1.5 bg-white/10 border border-white/15 text-white/80 text-xs font-medium px-3.5 py-1.5 rounded-full">
                  {chip.icon} {chip.text}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* ── Form card ── */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-8"
        >
          <div className="bg-gradient-to-r from-primary/5 to-transparent border-b border-gray-100 px-7 py-5">
            <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
              <Target size={18} className="text-primary" />
              Enter Your Details
            </h2>
            <p className="text-sm text-gray-500 mt-0.5">We'll match your rank against cutoffs from 40+ colleges</p>
          </div>

          <form onSubmit={handleSubmit} className="p-7 space-y-5">
            {/* Exam selector */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Exam Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <select
                  value={exam}
                  onChange={(e) => setExam(e.target.value)}
                  className="w-full appearance-none border border-gray-200 rounded-xl px-4 py-3 pr-10 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm bg-white transition-colors"
                >
                  <option value="">Select your exam...</option>
                  {EXAMS.map((e) => (
                    <option key={e.value} value={e.value}>{e.label} — {e.hint}</option>
                  ))}
                </select>
                <ChevronDown size={16} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
              {selectedExam && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-xs text-primary font-medium mt-1.5 flex items-center gap-1"
                >
                  <CheckCircle2 size={11} /> {selectedExam.hint}
                </motion.p>
              )}
            </div>

            {/* Rank input */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Your All India Rank (AIR) <span className="text-red-400">*</span>
              </label>
              <input
                type="number"
                min={1}
                placeholder="e.g. 5000"
                value={rank}
                onChange={(e) => setRank(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-gray-900 outline-none focus:border-primary focus:ring-2 focus:ring-primary/15 text-sm transition-colors"
              />
              <p className="text-xs text-gray-400 mt-1.5">Lower rank = better. Enter the rank from your official scorecard.</p>

              {/* Dynamic rank hint */}
              <AnimatePresence>
                {exam && rank && !isNaN(rankNum) && rankNum > 0 && (
                  <RankHintBox exam={exam} rank={rankNum} />
                )}
              </AnimatePresence>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm"
                >
                  <AlertCircle size={15} className="shrink-0" />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary text-white font-bold py-3.5 rounded-xl hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 flex items-center justify-center gap-2 text-sm shadow-sm shadow-primary/20"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Analysing your rank...
                </>
              ) : (
                <>
                  <Zap size={16} />
                  Predict My Colleges
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* ── Results ── */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              {/* Results header */}
              <div className="flex items-center justify-between mb-5">
                <div>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                    <Trophy size={20} className="text-amber-500" />
                    Your College Matches
                  </h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {result.exam} · Rank {result.rank.toLocaleString()} ·{' '}
                    <span className="font-semibold text-primary">{result.colleges.length} college{result.colleges.length !== 1 ? 's' : ''} found</span>
                  </p>
                </div>

                {/* Confidence legend */}
                <div className="hidden sm:flex flex-col gap-1 text-[10px] text-gray-500">
                  {[
                    { label: 'High Chance',     color: 'bg-emerald-400' },
                    { label: 'Good Chance',     color: 'bg-blue-400' },
                    { label: 'Moderate Chance', color: 'bg-amber-400' },
                    { label: 'Borderline',      color: 'bg-rose-400' },
                  ].map((l) => (
                    <span key={l.label} className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full ${l.color}`} />
                      {l.label}
                    </span>
                  ))}
                </div>
              </div>

              {result.colleges.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-white rounded-2xl border border-gray-100 p-12 text-center"
                >
                  <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <AlertCircle size={32} className="text-amber-400" />
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">No colleges matched</h3>
                  <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
                    No colleges matched your rank for <strong>{result.exam}</strong>. Try a different exam or verify your rank.
                  </p>
                  <div className="flex flex-wrap justify-center gap-3">
                    <button
                      onClick={() => { setResult(null); setRank(''); setExam(''); }}
                      className="bg-primary text-white font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      Try Again
                    </button>
                    <Link to="/colleges" className="border border-gray-200 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                      Browse All Colleges
                    </Link>
                  </div>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {result.colleges.map((college, i) => (
                    <ResultCard key={college.id} college={college} index={i} userRank={result.rank} />
                  ))}

                  {/* Footer CTA */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: result.colleges.length * 0.06 + 0.2 }}
                    className="bg-primary/5 border border-primary/15 rounded-2xl p-5 text-center mt-6"
                  >
                    <p className="text-sm text-gray-600 mb-3">
                      Want to compare your top matches side by side?
                    </p>
                    <Link
                      to="/compare"
                      className="inline-flex items-center gap-2 bg-primary text-white font-semibold text-sm px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
                    >
                      Compare Colleges <ArrowRight size={14} />
                    </Link>
                  </motion.div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── How it works (shown before first prediction) ── */}
        {!result && !isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-2"
          >
            <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-4 text-center">How it works</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { step: '1', icon: <GraduationCap size={20} className="text-primary" />, title: 'Select your exam', desc: 'Choose from JEE, CAT, GATE, BITSAT, and more.' },
                { step: '2', icon: <Target size={20} className="text-primary" />,        title: 'Enter your rank', desc: 'Input your All India Rank from your scorecard.' },
                { step: '3', icon: <Trophy size={20} className="text-amber-500" />,      title: 'Get your matches', desc: 'See colleges you\'re eligible for with confidence scores.' },
              ].map((item) => (
                <div key={item.step} className="bg-white rounded-2xl border border-gray-100 p-5 text-center">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center mx-auto mb-3">
                    {item.icon}
                  </div>
                  <div className="text-xs font-bold text-primary/60 mb-1">Step {item.step}</div>
                  <div className="font-bold text-gray-900 text-sm mb-1">{item.title}</div>
                  <div className="text-xs text-gray-500 leading-relaxed">{item.desc}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </>
  );
}
