import { Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useWishlist } from '@/contexts/WishlistContext';

interface WishlistButtonProps {
  collegeId: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'icon' | 'pill';
  className?: string;
  onClick?: (e: React.MouseEvent) => void;
}

export default function WishlistButton({
  collegeId,
  size = 'md',
  variant = 'icon',
  className = '',
  onClick,
}: WishlistButtonProps) {
  const { isWishlisted, toggleWishlist } = useWishlist();
  const wishlisted = isWishlisted(collegeId);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(collegeId);
    onClick?.(e);
  };

  const iconSize = size === 'sm' ? 13 : size === 'lg' ? 20 : 15;

  if (variant === 'pill') {
    return (
      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.92 }}
        title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
        className={`flex items-center gap-2 border font-semibold text-sm px-4 py-2 rounded-lg transition-colors ${
          wishlisted
            ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
            : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-500'
        } ${className}`}
      >
        <Heart
          size={iconSize}
          className={wishlisted ? 'fill-rose-500 text-rose-500' : ''}
        />
        {wishlisted ? 'Saved' : 'Save'}
      </motion.button>
    );
  }

  return (
    <motion.button
      onClick={handleClick}
      whileTap={{ scale: 0.85 }}
      title={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
      className={`flex items-center justify-center rounded-xl border transition-colors ${
        size === 'sm' ? 'w-7 h-7' : size === 'lg' ? 'w-11 h-11' : 'w-10 h-10'
      } ${
        wishlisted
          ? 'bg-rose-50 border-rose-200 text-rose-500'
          : 'border-gray-200 text-gray-400 hover:border-rose-300 hover:text-rose-400'
      } ${className}`}
    >
      <AnimatePresence mode="wait" initial={false}>
        <motion.span
          key={wishlisted ? 'filled' : 'empty'}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <Heart
            size={iconSize}
            className={wishlisted ? 'fill-rose-500 text-rose-500' : ''}
          />
        </motion.span>
      </AnimatePresence>
    </motion.button>
  );
}
