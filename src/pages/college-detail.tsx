import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  MapPin, Calendar, Star, IndianRupee, TrendingUp, BookOpen,
  ChevronRight, Plus, Check, Zap, GraduationCap, BarChart2,
  Info, Image, MessageSquare, Trophy, Briefcase, Building2,
  Users, Award, Target,
} from 'lucide-react';
import { motion } from 'motion/react';
import ShareButton from '@/components/ShareButton';
import WishlistButton from '@/components/WishlistButton';
import { Helmet } from '@dr.pogodin/react-helmet';
import { Skeleton } from '@/components/ui/skeleton';
import RatingStars from '@/components/RatingStars';
import CollegeGallery, { type GalleryImage } from '@/components/CollegeGallery';
import ReviewsSection from '@/components/ReviewsSection';
import { formatFees, formatPackage } from '@/lib/format';
import { useCompare } from '@/contexts/CompareContext';

const TYPE_COLORS: Record<string, string> = {
  IIT: 'bg-blue-100 text-blue-700 border-blue-200',
  NIT: 'bg-green-100 text-green-700 border-green-200',
  IIM: 'bg-purple-100 text-purple-700 border-purple-200',
  IIIT: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Private: 'bg-orange-100 text-orange-700 border-orange-200',
  Deemed: 'bg-rose-100 text-rose-700 border-rose-200',
  State: 'bg-teal-100 text-teal-700 border-teal-200',
};

const TYPE_GRADIENT: Record<string, string> = {
  IIT: 'from-blue-600 to-blue-700',
  NIT: 'from-green-600 to-green-700',
  IIM: 'from-purple-600 to-purple-700',
  IIIT: 'from-cyan-600 to-cyan-700',
  Private: 'from-orange-500 to-orange-600',
  Deemed: 'from-rose-500 to-rose-600',
  State: 'from-teal-600 to-teal-700',
};

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
  description: string;
  exam: string[];
  cutoff_rank: number;
  gallery: GalleryImage[];
}

const TABS = [
  { id: 'Overview', icon: <Info size={14} /> },
  { id: 'Courses', icon: <BookOpen size={14} /> },
  { id: 'Placements', icon: <TrendingUp size={14} /> },
  { id: 'Gallery', icon: <Image size={14} /> },
  { id: 'Reviews', icon: <MessageSquare size={14} /> },
  { id: 'Info', icon: <Building2 size={14} /> },
] as const;

type Tab = typeof TABS[number]['id'];

function getInitials(name: string) {
  return name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

// Animated bar component
function AnimatedBar({ pct, color = 'bg-green-500' }: { pct: number; color?: string }) {
  return (
    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
      <motion.div
        className={`h-full ${color} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${pct}%` }}
        transition={{ duration: 0.9, ease: 'easeOut' as const, delay: 0.2 }}
      />
    </div>
  );
}

export default function CollegeDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<Tab>('Overview');
  const { isSelected, addCollege, removeCollege, canAdd } = useCompare();

  const { data: college, isLoading, isError } = useQuery<College>({
    queryKey: ['college', id],
    queryFn: async () => {
      const res = await fetch(`/api/colleges/${id}`);
      if (!res.ok) throw new Error('College not found');
      return res.json();
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Skeleton className="h-4 w-48 mb-6" />
        <Skeleton className="h-52 rounded-2xl mb-6" />
        <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <Skeleton className="h-48 rounded-xl" />
            <Skeleton className="h-32 rounded-xl" />
          </div>
          <Skeleton className="h-64 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError || !college) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">College Not Found</h2>
        <p className="text-gray-500 mb-6">The college you're looking for doesn't exist.</p>
        <Link to="/colleges" className="bg-primary text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-primary/90 transition-colors">
          Browse Colleges
        </Link>
      </div>
    );
  }

  const selected = isSelected(college.id);
  const gradient = TYPE_GRADIENT[college.type] || 'from-gray-600 to-gray-700';

  return (
    <>
      <Helmet>
        <title>{college.name} — Fees, Placements & Courses | College Compass</title>
        <meta name="description" content={`${college.name} in ${college.location} — Annual fees ${formatFees(college.fees)}, ${college.placement_percentage}% placement rate, avg package ${formatPackage(college.avg_package)}. View courses, reviews, and admission details.`} />
        <link rel="canonical" href={`https://osovrwkgq3.preview.c36.airoapp.ai/colleges/${college.id}`} />
        <meta property="og:title" content={`${college.name} — College Compass`} />
        <meta property="og:description" content={`${college.name} in ${college.location}. Fees: ${formatFees(college.fees)} | Placement: ${college.placement_percentage}% | Avg Package: ${formatPackage(college.avg_package)}`} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={`https://osovrwkgq3.preview.c36.airoapp.ai/colleges/${college.id}`} />
        <meta property="og:image" content="https://osovrwkgq3.preview.c36.airoapp.ai/airo-assets/images/college-gallery/campus-aerial" />
        <meta property="og:image:alt" content={`${college.name} campus`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${college.name} — College Compass`} />
        <meta name="twitter:description" content={`${college.name} in ${college.location}. Fees: ${formatFees(college.fees)} | Placement: ${college.placement_percentage}%`} />
        <meta name="twitter:image" content="https://osovrwkgq3.preview.c36.airoapp.ai/airo-assets/images/college-gallery/campus-aerial" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "EducationalOrganization",
          "name": college.name,
          "url": `https://osovrwkgq3.preview.c36.airoapp.ai/colleges/${college.id}`,
          "description": college.description,
          "address": {
            "@type": "PostalAddress",
            "addressLocality": college.location,
            "addressCountry": "IN"
          },
          "foundingDate": college.established.toString(),
          "numberOfEmployees": { "@type": "QuantitativeValue", "value": 1000 },
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": college.rating.toFixed(1),
            "bestRating": "5",
            "worstRating": "1",
            "ratingCount": 50
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://osovrwkgq3.preview.c36.airoapp.ai/" },
            { "@type": "ListItem", "position": 2, "name": "Colleges", "item": "https://osovrwkgq3.preview.c36.airoapp.ai/colleges" },
            { "@type": "ListItem", "position": 3, "name": college.name, "item": `https://osovrwkgq3.preview.c36.airoapp.ai/colleges/${college.id}` }
          ]
        })}</script>
      </Helmet>

      {/* ── Breadcrumb ── */}
      <div className="bg-gray-50 border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <nav className="flex items-center gap-1 text-sm text-gray-500">
            <Link to="/" className="hover:text-primary transition-colors">Home</Link>
            <ChevronRight size={14} />
            <Link to="/colleges" className="hover:text-primary transition-colors">Colleges</Link>
            <ChevronRight size={14} />
            <span className="text-gray-900 font-medium truncate">{college.name}</span>
          </nav>
        </div>
      </div>

      {/* ── Hero Banner ── */}
      <div className={`relative bg-gradient-to-br ${gradient} text-white overflow-hidden`}>
        {/* Animated background orbs */}
        <motion.div
          className="absolute -top-16 -right-16 w-64 h-64 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.12) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
          transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
        />
        <motion.div
          className="absolute -bottom-10 -left-10 w-48 h-48 rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)' }}
          animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
        />

        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col md:flex-row md:items-center gap-6"
          >
            {/* Avatar */}
            <div className="w-20 h-20 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center shrink-0 shadow-lg">
              <span className="text-white font-bold text-2xl">{getInitials(college.name)}</span>
            </div>

            {/* Name + meta */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border bg-white/15 border-white/30 text-white`}>
                  {college.type}
                </span>
                <span className="text-white/60 text-xs">Est. {college.established}</span>
              </div>
              <h1 className="text-2xl md:text-4xl font-bold leading-tight mb-2">{college.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-white/80 text-sm">
                <span className="flex items-center gap-1.5">
                  <MapPin size={14} className="text-white/60" />
                  {college.location}
                </span>
                <span className="flex items-center gap-1.5">
                  <Star size={14} className="fill-amber-300 text-amber-300" />
                  <span className="font-bold text-white">{college.rating.toFixed(1)}</span>
                  <span className="text-white/60">/ 5.0</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <Users size={14} className="text-white/60" />
                  {college.courses.length} programs
                </span>
              </div>
            </div>

            {/* Share */}
            <div className="shrink-0">
              <ShareButton
                url={`https://osovrwkgq3.preview.c36.airoapp.ai/colleges/${college.id}`}
                title={`Check out ${college.name} on College Compass`}
                description={`${college.name} in ${college.location}. Fees: ${formatFees(college.fees)} | Placement: ${college.placement_percentage}% | Avg Package: ${formatPackage(college.avg_package)}`}
              />
            </div>
          </motion.div>

          {/* Quick stats bar */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-8"
          >
            {[
              { label: 'Annual Fees', value: formatFees(college.fees), icon: <IndianRupee size={15} /> },
              { label: 'Placement Rate', value: `${college.placement_percentage}%`, icon: <TrendingUp size={15} /> },
              { label: 'Avg Package', value: formatPackage(college.avg_package), icon: <Briefcase size={15} /> },
              { label: 'Cutoff Rank', value: `≤ ${college.cutoff_rank.toLocaleString()}`, icon: <Target size={15} /> },
            ].map((stat) => (
              <div key={stat.label} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-3">
                <div className="flex items-center gap-1.5 text-white/60 text-xs mb-1">
                  {stat.icon}
                  {stat.label}
                </div>
                <div className="text-white font-bold text-lg leading-tight">{stat.value}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── Main content ── */}
          <div className="flex-1 min-w-0">

            {/* Tabs */}
            <div className="flex gap-1 overflow-x-auto mb-6 border-b border-gray-100 pb-0">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex items-center gap-1.5 px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors ${
                    activeTab === tab.id
                      ? 'text-primary'
                      : 'text-gray-500 hover:text-gray-800'
                  }`}
                >
                  {tab.icon}
                  {tab.id}
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="tab-indicator"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
                    />
                  )}
                </button>
              ))}
            </div>

            {/* ── Overview ── */}
            {activeTab === 'Overview' && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-5"
              >
                {/* About */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-3 flex items-center gap-2">
                    <GraduationCap size={18} className="text-primary" />
                    About {college.name}
                  </h2>
                  <p className="text-gray-600 leading-relaxed">{college.description}</p>
                </div>

                {/* Key metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { icon: <IndianRupee size={22} className="text-primary" />, value: formatFees(college.fees), label: 'Annual Fees', bg: 'bg-primary/5', border: 'border-primary/10' },
                    { icon: <TrendingUp size={22} className="text-green-600" />, value: `${college.placement_percentage}%`, label: 'Placement Rate', bg: 'bg-green-50', border: 'border-green-100' },
                    { icon: <Briefcase size={22} className="text-amber-600" />, value: formatPackage(college.avg_package), label: 'Avg Package', bg: 'bg-amber-50', border: 'border-amber-100' },
                  ].map((m) => (
                    <div key={m.label} className={`${m.bg} border ${m.border} rounded-2xl p-5 text-center`}>
                      <div className="flex justify-center mb-2">{m.icon}</div>
                      <div className="text-2xl font-bold text-gray-900">{m.value}</div>
                      <div className="text-sm text-gray-500 mt-0.5">{m.label}</div>
                    </div>
                  ))}
                </div>

                {/* Rating card */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Star size={16} className="text-amber-400 fill-amber-400" />
                    Overall Rating
                  </h3>
                  <div className="flex items-center gap-6">
                    <div className="text-center">
                      <div className="text-5xl font-bold text-gray-900">{college.rating.toFixed(1)}</div>
                      <RatingStars rating={college.rating} size="md" />
                      <p className="text-xs text-gray-400 mt-1">out of 5.0</p>
                    </div>
                    <div className="flex-1 space-y-2">
                      {[5, 4, 3, 2, 1].map((star) => {
                        const pct = star === Math.round(college.rating) ? 60 : star === Math.floor(college.rating) ? 25 : Math.max(0, (star - 1) * 3);
                        return (
                          <div key={star} className="flex items-center gap-2 text-xs text-gray-500">
                            <span className="w-3 text-right">{star}</span>
                            <Star size={10} className="text-amber-400 fill-amber-400 shrink-0" />
                            <div className="flex-1">
                              <AnimatedBar pct={pct} color="bg-amber-400" />
                            </div>
                            <span className="w-6 text-right">{pct}%</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Exams accepted */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                    <Award size={16} className="text-primary" />
                    Exams Accepted
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {college.exam.map((e) => (
                      <span key={e} className="bg-primary/5 border border-primary/15 text-primary text-sm font-semibold px-3 py-1.5 rounded-lg">
                        {e}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Courses ── */}
            {activeTab === 'Courses' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <div className="flex items-center justify-between mb-5">
                    <h2 className="font-bold text-gray-900 text-lg flex items-center gap-2">
                      <BookOpen size={18} className="text-primary" />
                      Courses Offered
                    </h2>
                    <span className="text-sm font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full">
                      {college.courses.length} programs
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {college.courses.map((course, i) => (
                      <motion.div
                        key={course}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.04 }}
                        className="flex items-center gap-3 bg-gray-50 hover:bg-primary/5 border border-gray-100 hover:border-primary/20 px-4 py-3 rounded-xl transition-colors group"
                      >
                        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center shrink-0 group-hover:bg-primary/20 transition-colors">
                          <BookOpen size={14} className="text-primary" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{course}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {/* ── Placements ── */}
            {activeTab === 'Placements' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                {/* Big stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 text-center">
                    <TrendingUp size={28} className="mx-auto mb-2 text-white/80" />
                    <div className="text-4xl font-bold mb-1">{college.placement_percentage}%</div>
                    <div className="text-white/80 text-sm">Students Placed</div>
                  </div>
                  <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 text-center">
                    <Briefcase size={28} className="mx-auto mb-2 text-white/80" />
                    <div className="text-4xl font-bold mb-1">{formatPackage(college.avg_package)}</div>
                    <div className="text-white/80 text-sm">Average Package</div>
                  </div>
                </div>

                {/* Placement rate bar */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <BarChart2 size={16} className="text-primary" />
                    Placement Rate Breakdown
                  </h3>
                  <div className="space-y-4">
                    {[
                      { label: 'Overall Placement', pct: college.placement_percentage, color: 'bg-green-500' },
                      { label: 'Core Sector', pct: Math.round(college.placement_percentage * 0.65), color: 'bg-blue-500' },
                      { label: 'IT / Software', pct: Math.round(college.placement_percentage * 0.45), color: 'bg-purple-500' },
                      { label: 'Finance / Consulting', pct: Math.round(college.placement_percentage * 0.25), color: 'bg-amber-500' },
                    ].map((row) => (
                      <div key={row.label}>
                        <div className="flex justify-between text-sm mb-1.5">
                          <span className="font-medium text-gray-700">{row.label}</span>
                          <span className="font-bold text-gray-900">{row.pct}%</span>
                        </div>
                        <AnimatedBar pct={row.pct} color={row.color} />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Highlights */}
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h3 className="font-bold text-gray-900 mb-4 flex items-center gap-2">
                    <Trophy size={16} className="text-amber-500" />
                    Placement Highlights
                  </h3>
                  <ul className="space-y-3">
                    {[
                      `${college.placement_percentage}% of eligible students received placement offers`,
                      `Average package of ${formatPackage(college.avg_package)} per annum`,
                      `Top recruiters include leading MNCs and Indian conglomerates`,
                      `Strong alumni network across 500+ companies globally`,
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.07 }}
                        className="flex items-start gap-3 text-sm text-gray-600"
                      >
                        <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                          <Check size={11} className="text-green-600" />
                        </div>
                        {item}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            )}

            {/* ── Gallery ── */}
            {activeTab === 'Gallery' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <CollegeGallery images={college.gallery ?? []} collegeName={college.name} />
                </div>
              </motion.div>
            )}

            {/* ── Reviews ── */}
            {activeTab === 'Reviews' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
                <ReviewsSection collegeId={college.id} />
              </motion.div>
            )}

            {/* ── Info ── */}
            {activeTab === 'Info' && (
              <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
                <div className="bg-white rounded-2xl border border-gray-100 p-6">
                  <h2 className="font-bold text-gray-900 text-lg mb-5 flex items-center gap-2">
                    <Building2 size={18} className="text-primary" />
                    College Information
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                      { label: 'Established', value: college.established.toString(), icon: <Calendar size={16} className="text-primary" /> },
                      { label: 'Location', value: college.location, icon: <MapPin size={16} className="text-primary" /> },
                      { label: 'College Type', value: college.type, icon: <Building2 size={16} className="text-primary" /> },
                      { label: 'Cutoff Rank', value: `Rank ≤ ${college.cutoff_rank.toLocaleString()}`, icon: <Target size={16} className="text-primary" /> },
                      { label: 'Total Programs', value: `${college.courses.length} programs`, icon: <BookOpen size={16} className="text-primary" /> },
                      { label: 'Exams Accepted', value: college.exam.join(', '), icon: <Award size={16} className="text-primary" /> },
                    ].map((item, i) => (
                      <motion.div
                        key={item.label}
                        initial={{ opacity: 0, y: 6 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-start gap-3 bg-gray-50 rounded-xl p-4"
                      >
                        <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                          {item.icon}
                        </div>
                        <div>
                          <div className="text-xs text-gray-400 mb-0.5">{item.label}</div>
                          <div className="font-semibold text-gray-900 text-sm">{item.value}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Type badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border text-sm font-semibold ${TYPE_COLORS[college.type] || 'bg-gray-100 text-gray-600 border-gray-200'}`}>
                  <GraduationCap size={15} />
                  {college.type} Institution
                </div>
              </motion.div>
            )}
          </div>

          {/* ── Sticky Sidebar ── */}
          <aside className="lg:w-72 shrink-0">
            <div className="sticky top-20 space-y-3">

              {/* Key stats card */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                {/* Colored top strip */}
                <div className={`h-1.5 bg-gradient-to-r ${gradient}`} />
                <div className="p-5 space-y-4">
                  {/* Fees */}
                  <div>
                    <div className="text-xs text-gray-400 mb-0.5">Annual Fees</div>
                    <div className="text-2xl font-bold text-gray-900">{formatFees(college.fees)}</div>
                  </div>

                  {/* Placement + Package */}
                  <div className="grid grid-cols-2 gap-3 pt-1 border-t border-gray-50">
                    <div className="bg-green-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-green-700">{college.placement_percentage}%</div>
                      <div className="text-xs text-gray-500 mt-0.5">Placement</div>
                    </div>
                    <div className="bg-amber-50 rounded-xl p-3 text-center">
                      <div className="text-lg font-bold text-amber-700">{formatPackage(college.avg_package)}</div>
                      <div className="text-xs text-gray-500 mt-0.5">Avg Package</div>
                    </div>
                  </div>

                  {/* Placement bar */}
                  <div>
                    <div className="flex justify-between text-xs text-gray-400 mb-1">
                      <span>Placement rate</span>
                      <span className="font-semibold text-green-600">{college.placement_percentage}%</span>
                    </div>
                    <AnimatedBar pct={college.placement_percentage} color="bg-green-500" />
                  </div>

                  {/* Rating */}
                  <div className="flex items-center justify-between pt-1 border-t border-gray-50">
                    <span className="text-xs text-gray-400">Rating</span>
                    <div className="flex items-center gap-1.5">
                      <RatingStars rating={college.rating} size="sm" />
                      <span className="text-sm font-bold text-gray-900">{college.rating.toFixed(1)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action buttons */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 space-y-2.5">
                <button
                  onClick={() => selected ? removeCollege(college.id) : addCollege(college.id)}
                  disabled={!selected && !canAdd}
                  className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-semibold text-sm transition-colors ${
                    selected
                      ? 'bg-primary text-white hover:bg-primary/90'
                      : canAdd
                      ? 'border border-primary text-primary hover:bg-primary/5'
                      : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  {selected ? <Check size={15} /> : <Plus size={15} />}
                  {selected ? 'Added to Compare' : canAdd ? 'Add to Compare' : 'Compare Full (3/3)'}
                </button>

                <WishlistButton collegeId={college.id} variant="pill" size="md" className="w-full justify-center" />

                <Link
                  to="/predictor"
                  className="w-full flex items-center justify-center gap-2 bg-amber-400 text-gray-900 py-2.5 rounded-xl font-semibold text-sm hover:bg-amber-300 transition-colors"
                >
                  <Zap size={15} />
                  Predict My Chances
                </Link>
              </div>

              {/* Cutoff info */}
              <div className="bg-primary/5 border border-primary/15 rounded-2xl p-4">
                <div className="flex items-center gap-2 mb-1">
                  <Target size={14} className="text-primary" />
                  <span className="text-xs font-bold text-primary uppercase tracking-wide">Cutoff Rank</span>
                </div>
                <div className="text-2xl font-bold text-gray-900">≤ {college.cutoff_rank.toLocaleString()}</div>
                <p className="text-xs text-gray-500 mt-1">Approximate rank required for admission</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
