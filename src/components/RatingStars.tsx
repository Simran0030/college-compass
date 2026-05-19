import { Star } from 'lucide-react';

interface RatingStarsProps {
  rating: number;
  showValue?: boolean;
  size?: 'sm' | 'md';
}

export default function RatingStars({ rating, showValue = true, size = 'sm' }: RatingStarsProps) {
  const starSize = size === 'sm' ? 12 : 16;
  const full = Math.floor(rating);
  const partial = rating % 1;

  return (
    <div className="flex items-center gap-1">
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            size={starSize}
            className={
              i < full
                ? 'fill-amber-400 text-amber-400'
                : i === full && partial >= 0.5
                ? 'fill-amber-200 text-amber-400'
                : 'fill-gray-200 text-gray-300'
            }
          />
        ))}
      </div>
      {showValue && (
        <span className="text-xs font-semibold text-gray-700">{rating.toFixed(1)}</span>
      )}
    </div>
  );
}
