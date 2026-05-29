import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Search, SlidersHorizontal, X, ArrowUpDown, GraduationCap, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Helmet } from '@dr.pogodin/react-helmet';
import CollegeCard, { type CollegeCardData } from '@/components/CollegeCard';
import CardSkeleton from '@/components/CardSkeleton';
import { heroImageUrl, siteUrl, withBaseUrl } from '@/lib/site-meta';

const COLLEGE_TYPES = ['IIT', 'NIT', 'IIM', 'IIIT', 'Private', 'Deemed', 'State'];

const SORT_OPTIONS = [
  { value: 'rating',    label: 'Top Rated' },
  { value: 'placement', label: 'Best Placement' },
  { value: 'package',   label: 'Highest Package' },
  { value: 'fees_asc',  label: 'Fees: Low → High' },
  { value: 'fees_desc', label: 'Fees: High → Low' },
  { value: 'name',      label: 'Name: A–Z' },
];

const TYPE_COLORS: Record<string, string> = {
  IIT: 'bg-blue-100 text-blue-700 border-blue-200',
  NIT: 'bg-green-100 text-green-700 border-green-200',
  IIM: 'bg-purple-100 text-purple-700 border-purple-200',
  IIIT: 'bg-cyan-100 text-cyan-700 border-cyan-200',
  Private: 'bg-orange-100 text-orange-700 border-orange-200',
  Deemed: 'bg-rose-100 text-rose-700 border-rose-200',
  State: 'bg-teal-100 text-teal-700 border-teal-200',
};

function SidebarSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-gray-100 last:border-0 pb-4 last:pb-0">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center justify-between w-full py-3 text-sm font-bold text-gray-800 hover:text-primary transition-colors"
      >
        {title}
        {open ? <ChevronUp size={15} className="text-gray-400" /> : <ChevronDown size={15} className="text-gray-400" />}
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function CollegesPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [location, setLocation] = useState(searchParams.get('location') || 'all');
  const [minFees, setMinFees] = useState(0);
  const [maxFees, setMaxFees] = useState(2500000);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(() => {
    const t = searchParams.get('type');
    return t ? [t] : [];
  });
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState('rating');
  const pageUrl = withBaseUrl('/colleges');
  const rootUrl = siteUrl || withBaseUrl('/');

  const { data: locations } = useQuery({
    queryKey: ['locations'],
    queryFn: async () => {
      const res = await fetch('/api/locations');
      return res.json() as Promise<string[]>;
    },
  });

  const queryParams = new URLSearchParams({
    page: String(page),
    limit: '12',
    sort,
    ...(search && { search }),
    ...(location !== 'all' && { location }),
    ...(minFees > 0 && { minFees: String(minFees) }),
    ...(maxFees < 2500000 && { maxFees: String(maxFees) }),
    ...(selectedTypes.length > 0 && { type: selectedTypes.join(',') }),
  });

  const { data, isLoading } = useQuery({
    queryKey: ['colleges', search, location, minFees, maxFees, selectedTypes, sort, page],
    queryFn: async () => {
      const res = await fetch(`/api/colleges?${queryParams}`);
      if (!res.ok) throw new Error('Failed to fetch');
      return res.json() as Promise<{ colleges: CollegeCardData[]; total: number; page: number; totalPages: number }>;
    },
  });

  useEffect(() => { setPage(1); }, [search, location, minFees, maxFees, selectedTypes, sort]);

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); };

  const toggleType = (type: string) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const clearFilters = () => {
    setSearch(''); setLocation('all'); setMinFees(0); setMaxFees(2500000);
    setSelectedTypes([]); setSort('rating'); setPage(1); setSearchParams({});
  };

  const formatFeesLabel = (val: number) => {
    if (val === 0) return '₹0';
    if (val >= 100000) return `₹${(val / 100000).toFixed(0)}L`;
    return `₹${(val / 1000).toFixed(0)}K`;
  };

  // Active filter chips
  const activeFilters: { label: string; onRemove: () => void }[] = [
    ...(search ? [{ label: `"${search}"`, onRemove: () => setSearch('') }] : []),
    ...(location !== 'all' ? [{ label: location, onRemove: () => setLocation('all') }] : []),
    ...(minFees > 0 ? [{ label: `Min ${formatFeesLabel(minFees)}`, onRemove: () => setMinFees(0) }] : []),
    ...(maxFees < 2500000 ? [{ label: `Max ${formatFeesLabel(maxFees)}`, onRemove: () => setMaxFees(2500000) }] : []),
    ...selectedTypes.map((t) => ({ label: t, onRemove: () => toggleType(t) })),
  ];

  const hasFilters = activeFilters.length > 0;

  return (
    <>
      <Helmet>
        <title>Browse Colleges — College Compass</title>
        <meta name="description" content="Browse and filter India's top engineering, management, and science colleges. Filter by location, fees, type, and placement rate across 40+ institutions." />
        <link rel="canonical" href={pageUrl} />
        <meta property="og:title" content="Browse Colleges — College Compass" />
        <meta property="og:description" content="Explore 40+ top Indian colleges — IITs, NITs, IIMs, IIITs, and private universities. Filter by fees, location, placement rate, and more." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={pageUrl} />
        <meta property="og:image" content={heroImageUrl} />
        <meta property="og:image:alt" content="Browse top colleges in India on College Compass" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Browse Colleges — College Compass" />
        <meta name="twitter:description" content="Explore 40+ top Indian colleges. Filter by fees, location, placement rate, and more." />
        <meta name="twitter:image" content={heroImageUrl} />
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          "name": "Browse Colleges — College Compass",
          "description": "Browse and filter India's top engineering, management, and science colleges including IITs, NITs, IIMs, and private universities.",
          "url": pageUrl,
          "isPartOf": {
            "@type": "WebSite",
            "name": "College Compass",
            "url": rootUrl
          }
        })}</script>
      </Helmet>

      {/* Page header */}
      <div className="bg-gradient-to-r from-primary to-secondary text-white">
        <div className="max-w-6xl mx-auto px-4 py-10 md:py-14">
          <div className="flex items-center gap-3 mb-2">
            <GraduationCap size={22} className="text-white/70" />
            <span className="text-white/70 text-sm font-medium uppercase tracking-wide">College Directory</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-1">Browse Colleges</h1>
          <p className="text-white/70 mb-7">
            Explore {data?.total ?? '40+'} colleges across India — filter by type, location, fees &amp; more
          </p>

          {/* Inline search */}
          <form onSubmit={handleSearch} className="max-w-2xl">
            <div className="flex gap-2 bg-white rounded-xl p-1.5 shadow-lg shadow-black/20">
              <div className="flex items-center gap-2 flex-1 px-3">
                <Search size={16} className="text-gray-400 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by college name or city..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="flex-1 outline-none text-sm text-gray-900 placeholder-gray-400 bg-transparent py-1.5"
                />
                {search && (
                  <button type="button" onClick={() => setSearch('')}>
                    <X size={14} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
              <button type="submit" className="bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-bold hover:bg-primary/90 transition-colors shrink-0">
                Search
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Mobile filter toggle */}
        <div className="flex items-center justify-between mb-4 md:hidden">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-semibold transition-colors ${showFilters ? 'bg-primary text-white border-primary' : 'bg-white border-gray-200 text-gray-700'}`}
          >
            <SlidersHorizontal size={15} />
            Filters {hasFilters && `(${activeFilters.length})`}
          </button>
          {hasFilters && (
            <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
              Clear all
            </button>
          )}
        </div>

        {/* Active filter chips */}
        <AnimatePresence>
          {hasFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="flex flex-wrap gap-2 mb-5 overflow-hidden"
            >
              {activeFilters.map((f) => (
                <span
                  key={f.label}
                  className="inline-flex items-center gap-1.5 bg-primary/10 text-primary border border-primary/20 text-xs font-semibold px-3 py-1.5 rounded-full"
                >
                  {f.label}
                  <button onClick={f.onRemove} className="hover:text-primary/60 transition-colors">
                    <X size={11} />
                  </button>
                </span>
              ))}
              <button
                onClick={clearFilters}
                className="text-xs text-gray-400 hover:text-gray-600 font-medium px-2 py-1.5 transition-colors"
              >
                Clear all
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex gap-6">
          {/* Sidebar */}
          <aside className={`w-60 shrink-0 ${showFilters ? 'block' : 'hidden md:block'}`}>
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sticky top-4 space-y-1">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-bold text-gray-900 text-sm">Filters</h3>
                {hasFilters && (
                  <button onClick={clearFilters} className="text-xs text-primary font-semibold hover:underline">
                    Reset
                  </button>
                )}
              </div>

              {/* College Type */}
              <SidebarSection title="College Type">
                <div className="flex flex-wrap gap-1.5 pb-1">
                  {COLLEGE_TYPES.map((type) => (
                    <button
                      key={type}
                      onClick={() => toggleType(type)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                        selectedTypes.includes(type)
                          ? `${TYPE_COLORS[type]} ring-1 ring-offset-1 ring-current`
                          : 'bg-gray-50 text-gray-600 border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </SidebarSection>

              {/* Location */}
              <SidebarSection title="Location">
                <select
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-700 outline-none focus:border-primary bg-white mb-1"
                >
                  <option value="all">All Locations</option>
                  {locations?.map((loc) => (
                    <option key={loc} value={loc}>{loc}</option>
                  ))}
                </select>
              </SidebarSection>

              {/* Fees range */}
              <SidebarSection title="Annual Fees">
                <div className="space-y-3 pb-1">
                  <div className="flex justify-between text-xs text-gray-500 font-medium">
                    <span>{formatFeesLabel(minFees)}</span>
                    <span>{formatFeesLabel(maxFees)}</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Min fees</label>
                      <input
                        type="range" min={0} max={2500000} step={50000} value={minFees}
                        onChange={(e) => setMinFees(Math.min(Number(e.target.value), maxFees - 50000))}
                        className="w-full accent-primary"
                      />
                    </div>
                    <div>
                      <label className="text-xs text-gray-400 mb-1 block">Max fees</label>
                      <input
                        type="range" min={0} max={2500000} step={50000} value={maxFees}
                        onChange={(e) => setMaxFees(Math.max(Number(e.target.value), minFees + 50000))}
                        className="w-full accent-primary"
                      />
                    </div>
                  </div>
                </div>
              </SidebarSection>
            </div>
          </aside>

          {/* Main content */}
          <div className="flex-1 min-w-0">
            {/* Results bar */}
            <div className="flex items-center justify-between mb-5 gap-3 flex-wrap">
              <div className="text-sm text-gray-500">
                {isLoading ? (
                  <span className="inline-block w-32 h-4 bg-gray-100 rounded animate-pulse" />
                ) : (
                  <>
                    <span className="font-semibold text-gray-900">{data?.colleges.length ?? 0}</span>
                    {' '}of{' '}
                    <span className="font-semibold text-gray-900">{data?.total ?? 0}</span>
                    {' '}colleges
                    {hasFilters && <span className="text-primary font-medium"> · filtered</span>}
                  </>
                )}
              </div>
              <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-1.5">
                <ArrowUpDown size={13} className="text-gray-400 shrink-0" />
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="text-sm text-gray-700 outline-none bg-transparent font-medium"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
                {Array.from({ length: 12 }).map((_, i) => <CardSkeleton key={i} />)}
              </div>
            ) : data?.colleges.length === 0 ? (
              <div className="text-center py-24 bg-white rounded-2xl border border-gray-100">
                <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Search size={28} className="text-gray-300" />
                </div>
                <h3 className="font-bold text-gray-700 text-lg mb-1">No colleges found</h3>
                <p className="text-gray-400 text-sm mb-5">Try adjusting your filters or search query.</p>
                <button
                  onClick={clearFilters}
                  className="bg-primary text-white text-sm font-semibold px-5 py-2.5 rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              <motion.div
                key={`${page}-${search}-${location}-${sort}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5"
              >
                {data?.colleges.map((college) => (
                  <CollegeCard key={college.id} college={college} />
                ))}
              </motion.div>
            )}

            {/* Pagination */}
            {data && data.totalPages > 1 && (
              <div className="flex items-center justify-center gap-1.5 mt-10">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  ← Prev
                </button>
                {Array.from({ length: data.totalPages }).map((_, i) => {
                  const p = i + 1;
                  const isActive = page === p;
                  const isNear = Math.abs(page - p) <= 1 || p === 1 || p === data.totalPages;
                  if (!isNear) {
                    if (p === 2 || p === data.totalPages - 1) return <span key={p} className="text-gray-300 text-sm px-1">…</span>;
                    return null;
                  }
                  return (
                    <button
                      key={p}
                      onClick={() => setPage(p)}
                      className={`w-9 h-9 rounded-lg text-sm font-semibold transition-colors ${
                        isActive ? 'bg-primary text-white shadow-sm' : 'border border-gray-200 text-gray-600 hover:border-primary hover:text-primary'
                      }`}
                    >
                      {p}
                    </button>
                  );
                })}
                <button
                  onClick={() => setPage((p) => Math.min(data.totalPages, p + 1))}
                  disabled={page === data.totalPages}
                  className="px-4 py-2 rounded-lg border border-gray-200 text-sm font-semibold text-gray-600 hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
