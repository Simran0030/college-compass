import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, ArrowRight, BookOpen, BarChart2, Zap, GraduationCap, MapPin, Users, Star, TrendingUp, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import CollegeCard from '@/components/CollegeCard';
import CardSkeleton from '@/components/CardSkeleton';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
};

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

// Floating particle config
const PARTICLES = Array.from({ length: 18 }, (_, i) => ({
  id: i,
  size: 3 + (i % 4) * 3,
  left: `${5 + (i * 5.3) % 90}%`,
  top: `${10 + (i * 7.1) % 80}%`,
  delay: (i * 0.35) % 4,
  duration: 5 + (i % 4) * 2,
  xRange: (i % 2 === 0 ? 1 : -1) * (12 + (i % 3) * 8),
}));

// Animated counter hook
function useCounter(target: number, duration = 1500, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function AnimatedStat({ value, label, icon, suffix = '' }: { value: number; label: string; icon: React.ReactNode; suffix?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  const count = useCounter(value, 1400, inView);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([entry]) => { if (entry.isIntersecting) setInView(true); }, { threshold: 0.5 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div ref={ref} className="flex flex-col items-center gap-2 py-2">
      <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center mb-1">
        {icon}
      </div>
      <div className="text-3xl font-bold text-gray-900 tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-sm text-gray-500 font-medium">{label}</div>
    </div>
  );
}

const QUICK_FILTERS = [
  { label: 'IITs', query: 'type=IIT' },
  { label: 'NITs', query: 'type=NIT' },
  { label: 'IIMs', query: 'type=IIM' },
  { label: 'IIITs', query: 'type=IIIT' },
  { label: 'Private', query: 'type=Private' },
  { label: 'Mumbai', query: 'search=Mumbai' },
  { label: 'Delhi', query: 'search=Delhi' },
  { label: 'Bangalore', query: 'search=Bangalore' },
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const { data: featuredData, isLoading } = useQuery({
    queryKey: ['colleges', 'featured'],
    queryFn: async () => {
      const res = await fetch('/api/colleges?limit=6&page=1');
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json();
    },
  });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/colleges?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/colleges');
    }
  };

  return (
    <>
      <Helmet>
        <title>College Compass — Find Your Perfect College in India</title>
        <meta name="description" content="Discover, compare, and predict college admissions across India's top IITs, NITs, IIMs, and private universities. Make informed decisions with real data." />
        <link rel="canonical" href="https://osovrwkgq3.preview.c36.airoapp.ai/" />
        <meta property="og:title" content="College Compass — Find Your Perfect College in India" />
        <meta property="og:description" content="Discover, compare, and predict college admissions across India's top IITs, NITs, IIMs, and private universities. Make informed decisions with real data." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://osovrwkgq3.preview.c36.airoapp.ai/" />
        <meta property="og:image" content="https://osovrwkgq3.preview.c36.airoapp.ai/airo-assets/images/pages/home/hero" />
        <meta property="og:image:alt" content="College Compass — India's college discovery platform" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="College Compass — Find Your Perfect College in India" />
        <meta name="twitter:description" content="Discover, compare, and predict college admissions across India's top IITs, NITs, IIMs, and private universities." />
        <meta name="twitter:image" content="https://osovrwkgq3.preview.c36.airoapp.ai/airo-assets/images/pages/home/hero" />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "College Compass",
          "url": "https://osovrwkgq3.preview.c36.airoapp.ai/",
          "description": "India's #1 college discovery platform. Explore 40+ top colleges, compare fees and placements, and predict your admission chances.",
          "potentialAction": {
            "@type": "SearchAction",
            "target": {
              "@type": "EntryPoint",
              "urlTemplate": "https://osovrwkgq3.preview.c36.airoapp.ai/colleges?search={search_term_string}"
            },
            "query-input": "required name=search_term_string"
          }
        })}</script>
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "Organization",
          "name": "College Compass",
          "url": "https://osovrwkgq3.preview.c36.airoapp.ai/",
          "description": "India's leading college discovery and comparison platform for students.",
          "sameAs": []
        })}</script>
      </Helmet>

      {/* ── Hero ── */}
      <section className="relative text-white overflow-hidden min-h-[88vh] flex items-center">
        <div className="absolute inset-0">
          <img
            src="/airo-assets/images/pages/home/hero"
            alt="University campus"
            className="w-full h-full object-cover"
            fetchPriority="high"
          />
          {/* Layered gradient for depth */}
          <div className="absolute inset-0 bg-gradient-to-r from-gray-950/90 via-gray-900/75 to-gray-900/50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/60 via-transparent to-transparent" />

          {/* Animated green glow orb — top left */}
          <motion.div
            className="absolute -top-32 -left-32 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(21,128,61,0.35) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.15, 1], opacity: [0.6, 1, 0.6] }}
            transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' as const }}
          />

          {/* Animated teal glow orb — bottom right */}
          <motion.div
            className="absolute -bottom-24 -right-24 w-[420px] h-[420px] rounded-full pointer-events-none"
            style={{ background: 'radial-gradient(circle, rgba(21,128,115,0.28) 0%, transparent 70%)' }}
            animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.9, 0.5] }}
            transition={{ duration: 9, repeat: Infinity, ease: 'easeInOut' as const, delay: 2 }}
          />

          {/* Floating particles */}
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              className="absolute rounded-full bg-white pointer-events-none"
              style={{
                width: p.size,
                height: p.size,
                left: p.left,
                top: p.top,
                opacity: 0,
              }}
              animate={{
                y: [-10, -40, -10],
                x: [0, p.xRange, 0],
                opacity: [0, 0.18, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Infinity,
                ease: 'easeInOut' as const,
              }}
            />
          ))}

          {/* Diagonal shimmer sweep */}
          <motion.div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.04) 50%, transparent 60%)',
              backgroundSize: '200% 100%',
            }}
            animate={{ backgroundPosition: ['200% 0%', '-200% 0%'] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'linear' as const, repeatDelay: 3 }}
          />
        </div>

        <div className="relative w-full max-w-6xl mx-auto px-4 py-24 md:py-32">
          <motion.div initial="hidden" animate="visible" variants={stagger} className="max-w-3xl">
            {/* Badge */}
            <motion.div variants={fadeUp}>
              <span className="inline-flex items-center gap-2 bg-primary/20 border border-primary/40 text-emerald-300 text-sm font-semibold px-4 py-1.5 rounded-full mb-6">
                <GraduationCap size={15} />
                India's #1 College Discovery Platform
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1 variants={fadeUp} className="text-5xl md:text-7xl font-bold leading-[1.1] mb-5 tracking-tight">
              Find Your{' '}
              <span className="text-emerald-400">Perfect</span>
              <br />College in India
            </motion.h1>

            <motion.p variants={fadeUp} className="text-lg md:text-xl text-white/70 max-w-xl mb-10 leading-relaxed">
              Explore 40+ top colleges. Compare fees, placements &amp; courses. Predict your admission chances — all in one place.
            </motion.p>

            {/* Search bar */}
            <motion.form variants={fadeUp} onSubmit={handleSearch} className="max-w-2xl mb-6">
              <div className="flex gap-2 bg-white rounded-2xl p-2 shadow-2xl shadow-black/30">
                <div className="flex items-center gap-3 flex-1 px-4">
                  <Search size={18} className="text-gray-400 shrink-0" />
                  <input
                    type="text"
                    placeholder="Search by college name, city or type..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="flex-1 text-gray-900 placeholder-gray-400 outline-none text-base bg-transparent py-1"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-white font-bold px-7 py-3 rounded-xl hover:bg-primary/90 transition-colors shrink-0 text-sm"
                >
                  Search
                </button>
              </div>
            </motion.form>

            {/* Quick filter chips */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-2 mb-10">
              {QUICK_FILTERS.map((f) => (
                <button
                  key={f.label}
                  onClick={() => navigate(`/colleges?${f.query}`)}
                  className="text-xs font-semibold bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white px-3.5 py-1.5 rounded-full transition-colors"
                >
                  {f.label}
                </button>
              ))}
            </motion.div>

            {/* CTA buttons */}
            <motion.div variants={fadeUp} className="flex flex-wrap gap-3">
              <Link
                to="/colleges"
                className="flex items-center gap-2 bg-emerald-400 text-gray-900 font-bold px-7 py-3.5 rounded-xl hover:bg-emerald-300 transition-colors text-sm"
              >
                Browse All Colleges <ArrowRight size={16} />
              </Link>
              <Link
                to="/predictor"
                className="flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-7 py-3.5 rounded-xl hover:bg-white/20 transition-colors text-sm"
              >
                <Zap size={16} /> Predict My Chances
              </Link>
            </motion.div>
          </motion.div>

          {/* Floating trust card */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6, ease: 'easeOut' as const }}
            className="hidden lg:flex absolute right-4 top-1/2 -translate-y-1/2 flex-col gap-3"
          >
            {[
              { icon: <Star size={16} className="text-amber-400 fill-amber-400" />, text: '4.8 avg rating', sub: 'across all colleges' },
              { icon: <TrendingUp size={16} className="text-emerald-400" />, text: '85%+ placement', sub: 'top IITs & NITs' },
              { icon: <Users size={16} className="text-blue-400" />, text: '1 Lakh+ students', sub: 'made decisions here' },
            ].map((item) => (
              <div key={item.text} className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-4 py-3 flex items-center gap-3 min-w-[200px]">
                <div className="w-8 h-8 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  {item.icon}
                </div>
                <div>
                  <div className="text-white font-bold text-sm">{item.text}</div>
                  <div className="text-white/50 text-xs">{item.sub}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-gray-100">
            <AnimatedStat value={40} suffix="+" label="Colleges Listed" icon={<GraduationCap size={22} className="text-primary" />} />
            <AnimatedStat value={15} suffix="+" label="States Covered" icon={<MapPin size={22} className="text-primary" />} />
            <AnimatedStat value={100000} suffix="+" label="Students Helped" icon={<Users size={22} className="text-primary" />} />
            <AnimatedStat value={98} suffix="%" label="Satisfaction Rate" icon={<Star size={22} className="text-amber-400" />} />
          </div>
        </div>
      </section>

      {/* ── Featured Colleges ── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
          <motion.div variants={fadeUp} className="flex items-end justify-between mb-10">
            <div>
              <p className="text-primary font-semibold text-sm mb-1 uppercase tracking-wide">Top Picks</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Featured Colleges</h2>
              <p className="text-gray-500 mt-2">India's most prestigious institutions, curated for you</p>
            </div>
            <Link
              to="/colleges"
              className="hidden sm:flex items-center gap-1.5 text-primary font-semibold text-sm border border-primary/30 px-4 py-2 rounded-lg hover:bg-primary/5 transition-colors"
            >
              View all <ChevronRight size={15} />
            </Link>
          </motion.div>

          <motion.div variants={stagger} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {isLoading
              ? Array.from({ length: 6 }).map((_, i) => (
                  <motion.div key={i} variants={fadeUp}><CardSkeleton /></motion.div>
                ))
              : featuredData?.colleges?.map((college: CollegeCardData) => (
                  <motion.div key={college.id} variants={fadeUp}>
                    <CollegeCard college={college} />
                  </motion.div>
                ))}
          </motion.div>

          <motion.div variants={fadeUp} className="text-center mt-10 sm:hidden">
            <Link to="/colleges" className="inline-flex items-center gap-2 text-primary font-semibold border border-primary/30 px-6 py-2.5 rounded-lg hover:bg-primary/5 transition-colors">
              View all colleges <ArrowRight size={15} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Feature highlights ── */}
      <section className="bg-gradient-to-b from-gray-50 to-white py-20">
        <div className="max-w-5xl mx-auto px-4">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp} className="text-center mb-14">
              <p className="text-primary font-semibold text-sm mb-2 uppercase tracking-wide">Why College Compass</p>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Everything You Need to Decide</h2>
              <p className="text-gray-500 max-w-xl mx-auto">Research, compare, and predict — all the tools you need in one place.</p>
            </motion.div>

            <motion.div variants={stagger} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <Search size={26} className="text-primary" />,
                  title: 'Smart Search & Filters',
                  desc: 'Filter by location, fees, type, exam, and more. Find colleges that match your exact criteria in seconds.',
                  link: '/colleges',
                  cta: 'Search Colleges',
                  color: 'bg-primary/10',
                },
                {
                  icon: <BarChart2 size={26} className="text-secondary" />,
                  title: 'Side-by-Side Compare',
                  desc: 'Compare up to 3 colleges on fees, placements, ratings, and more with our visual comparison table.',
                  link: '/compare',
                  cta: 'Compare Now',
                  color: 'bg-secondary/10',
                },
                {
                  icon: <Zap size={26} className="text-accent" />,
                  title: 'Admission Predictor',
                  desc: 'Enter your exam and rank to instantly see which colleges you\'re likely to get admission into.',
                  link: '/predictor',
                  cta: 'Predict Chances',
                  color: 'bg-accent/10',
                },
              ].map((feature, i) => (
                <motion.div
                  key={feature.title}
                  variants={fadeUp}
                  custom={i}
                  className="group bg-white rounded-2xl p-7 border border-gray-100 hover:border-primary/20 hover:shadow-lg transition-all duration-300"
                >
                  <div className={`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                    {feature.icon}
                  </div>
                  <h3 className="font-bold text-gray-900 text-lg mb-2">{feature.title}</h3>
                  <p className="text-gray-500 text-sm mb-5 leading-relaxed">{feature.desc}</p>
                  <Link
                    to={feature.link}
                    className="inline-flex items-center gap-1.5 text-primary font-semibold text-sm hover:gap-2.5 transition-all"
                  >
                    {feature.cta} <ArrowRight size={14} />
                  </Link>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="bg-primary py-20 relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-black/10 rounded-full translate-y-1/2 -translate-x-1/4 blur-3xl pointer-events-none" />

        <div className="relative max-w-3xl mx-auto px-4 text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={stagger}>
            <motion.div variants={fadeUp}>
              <div className="w-16 h-16 bg-white/15 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <BookOpen size={32} className="text-white" />
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Find Your College?</h2>
              <p className="text-white/70 mb-8 text-lg max-w-xl mx-auto">
                Join thousands of students who used College Compass to make their most important decision.
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link
                  to="/predictor"
                  className="inline-flex items-center gap-2 bg-white text-primary font-bold px-8 py-3.5 rounded-xl hover:bg-gray-50 transition-colors"
                >
                  <Zap size={16} /> Predict My Admission
                </Link>
                <Link
                  to="/colleges"
                  className="inline-flex items-center gap-2 bg-white/10 border border-white/25 text-white font-semibold px-8 py-3.5 rounded-xl hover:bg-white/20 transition-colors"
                >
                  Browse Colleges <ArrowRight size={16} />
                </Link>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </>
  );
}

// Type alias for use in JSX
type CollegeCardData = import('@/components/CollegeCard').CollegeCardData;
