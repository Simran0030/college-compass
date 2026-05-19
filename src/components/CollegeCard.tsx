import { Link } from 'react-router-dom';
import { MapPin, IndianRupee, TrendingUp, Plus, Check, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import RatingStars from './RatingStars';
import WishlistButton from './WishlistButton';
import { formatFees, formatPackage } from '@/lib/format';
import { useCompare } from '@/contexts/CompareContext';

export interface CollegeCardData {
  id: number;
  name: string;
  location: string;
  fees: number;
  rating: number;
  type: string;
  placement_percentage: number;
  avg_package: number;
}

const TYPE_COLORS: Record<string, string> = {
  IIT: 'bg-blue-50 text-blue-700 border-blue-100',
  NIT: 'bg-green-50 text-green-700 border-green-100',
  IIM: 'bg-purple-50 text-purple-700 border-purple-100',
  IIIT: 'bg-cyan-50 text-cyan-700 border-cyan-100',
  Private: 'bg-orange-50 text-orange-700 border-orange-100',
  Deemed: 'bg-rose-50 text-rose-700 border-rose-100',
  State: 'bg-teal-50 text-teal-700 border-teal-100',
};

// Initials avatar color per type
const TYPE_BG: Record<string, string> = {
  IIT: 'from-blue-500 to-blue-600',
  NIT: 'from-green-500 to-green-600',
  IIM: 'from-purple-500 to-purple-600',
  IIIT: 'from-cyan-500 to-cyan-600',
  Private: 'from-orange-500 to-orange-600',
  Deemed: 'from-rose-500 to-rose-600',
  State: 'from-teal-500 to-teal-600',
};

function getInitials(name: string) {
  return name
    .split(' ')
    .filter((w) => w.length > 2)
    .slice(0, 2)
    .map((w) => w[0].toUpperCase())
    .join('');
}

interface CollegeCardProps {
  college: CollegeCardData;
  variant?: 'default' | 'compact';
}

export default function CollegeCard({ college, variant = 'default' }: CollegeCardProps) {
  const { isSelected, addCollege, removeCollege, canAdd } = useCompare();
  const selected = isSelected(college.id);

  const handleCompare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (selected) removeCollege(college.id);
    else if (canAdd) addCollege(college.id);
  };

  const gradientClass = TYPE_BG[college.type] || 'from-gray-500 to-gray-600';

  return (
    <motion.div
      whileHover={{ y: -3, boxShadow: '0 16px 40px rgba(0,0,0,0.10)' }}
      transition={{ duration: 0.2, ease: 'easeOut' as const }}
      className="bg-white rounded-2xl border border-gray-100 overflow-hidden group flex flex-col"
    >
      {/* Card top accent strip */}
      <div className={`h-1 w-full bg-gradient-to-r ${gradientClass}`} />

      <div className="p-5 flex flex-col flex-1">
        {/* Header row: avatar + name + type badge */}
        <div className="flex items-start gap-3 mb-4">
          {/* Initials avatar */}
          <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${gradientClass} flex items-center justify-center shrink-0 shadow-sm`}>
            <span className="text-white font-bold text-sm">{getInitials(college.name)}</span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full border ${TYPE_COLORS[college.type] || 'bg-gray-50 text-gray-600 border-gray-100'}`}>
                {college.type}
              </span>
            </div>
            <h3 className="font-bold text-gray-900 text-sm leading-snug line-clamp-2 group-hover:text-primary transition-colors">
              {college.name}
            </h3>
          </div>
        </div>

        {/* Location + rating row */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1 text-gray-400 text-xs">
            <MapPin size={12} className="shrink-0" />
            <span className="truncate max-w-[120px]">{college.location}</span>
          </div>
          <RatingStars rating={college.rating} size="sm" />
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-3 gap-2 mb-5">
          <div className="bg-gray-50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-0.5 text-gray-400 mb-1">
              <IndianRupee size={10} />
              <span className="text-[10px] font-medium">Fees</span>
            </div>
            <div className="font-bold text-gray-900 text-xs leading-tight">{formatFees(college.fees)}</div>
          </div>
          <div className="bg-green-50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-0.5 text-green-500 mb-1">
              <TrendingUp size={10} />
              <span className="text-[10px] font-medium">Placed</span>
            </div>
            <div className="font-bold text-green-700 text-xs leading-tight">{college.placement_percentage}%</div>
          </div>
          <div className="bg-amber-50 rounded-xl p-2.5 text-center">
            <div className="flex items-center justify-center gap-0.5 text-amber-500 mb-1">
              <Briefcase size={10} />
              <span className="text-[10px] font-medium">Pkg</span>
            </div>
            <div className="font-bold text-amber-700 text-xs leading-tight">{formatPackage(college.avg_package)}</div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-auto">
          <Link
            to={`/colleges/${college.id}`}
            className="flex-1 text-center bg-primary text-white text-sm font-semibold py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
          >
            View Details
          </Link>
          <WishlistButton collegeId={college.id} size="md" />
          <button
            onClick={handleCompare}
            title={selected ? 'Remove from compare' : canAdd ? 'Add to compare' : 'Max 3 colleges'}
            className={`w-10 h-10 rounded-xl border text-sm font-semibold transition-colors flex items-center justify-center shrink-0 ${
              selected
                ? 'bg-primary text-white border-primary'
                : canAdd
                ? 'border-gray-200 text-gray-500 hover:border-primary hover:text-primary'
                : 'border-gray-100 text-gray-300 cursor-not-allowed'
            }`}
          >
            {selected ? <Check size={15} /> : <Plus size={15} />}
          </button>
        </div>
      </div>
    </motion.div>
  );
}
