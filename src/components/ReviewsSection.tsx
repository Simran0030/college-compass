import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Star, MessageSquare, ThumbsUp, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface Review {
  id: number;
  collegeId: number;
  name: string;
  rating: number;
  title: string;
  body: string;
  category: string;
  createdAt: string;
}

interface ReviewsResponse {
  reviews: Review[];
  avgRating: number | null;
  total: number;
}

const CATEGORIES = ['General', 'Academics', 'Campus Life', 'Placements', 'Faculty', 'Infrastructure'];

function StarPicker({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
          aria-label={`Rate ${star} stars`}
        >
          <Star
            size={24}
            className={`transition-colors ${
              star <= (hovered || value)
                ? 'fill-amber-400 text-amber-400'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
}

function RatingBar({ label, count, total }: { label: string; count: number; total: number }) {
  const pct = total > 0 ? (count / total) * 100 : 0;
  return (
    <div className="flex items-center gap-2 text-sm">
      <span className="w-12 text-gray-500 shrink-0">{label}</span>
      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-amber-400 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <span className="w-6 text-right text-gray-400 shrink-0">{count}</span>
    </div>
  );
}

function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
  });
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl border border-gray-100 p-5"
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <User size={16} className="text-primary" />
          </div>
          <div>
            <div className="font-semibold text-gray-900 text-sm">{review.name}</div>
            <div className="text-xs text-gray-400">{date}</div>
          </div>
        </div>
        <span className="text-xs bg-primary/10 text-primary font-medium px-2.5 py-1 rounded-full shrink-0">
          {review.category}
        </span>
      </div>

      <div className="flex items-center gap-2 mb-2">
        <div className="flex gap-0.5">
          {[1, 2, 3, 4, 5].map((s) => (
            <Star
              key={s}
              size={14}
              className={s <= review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
            />
          ))}
        </div>
        <span className="text-xs font-semibold text-gray-700">{review.rating}.0</span>
      </div>

      <h4 className="font-semibold text-gray-900 mb-1">{review.title}</h4>
      <p className="text-sm text-gray-600 leading-relaxed">{review.body}</p>
    </motion.div>
  );
}

export default function ReviewsSection({ collegeId }: { collegeId: number }) {
  const queryClient = useQueryClient();
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [name, setName] = useState('');
  const [rating, setRating] = useState(0);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [category, setCategory] = useState('General');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data, isLoading } = useQuery<ReviewsResponse>({
    queryKey: ['reviews', collegeId],
    queryFn: async () => {
      const res = await fetch(`/api/reviews?collegeId=${collegeId}`);
      if (!res.ok) throw new Error('Failed to fetch reviews');
      return res.json();
    },
  });

  const mutation = useMutation({
    mutationFn: async (payload: object) => {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to submit');
      }
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['reviews', collegeId] });
      setSubmitted(true);
      setShowForm(false);
      setName(''); setRating(0); setTitle(''); setBody(''); setCategory('General');
    },
  });

  const validate = () => {
    const e: Record<string, string> = {};
    if (!name.trim()) e.name = 'Name is required';
    if (!rating) e.rating = 'Please select a rating';
    if (!title.trim()) e.title = 'Title is required';
    if (body.trim().length < 20) e.body = 'Review must be at least 20 characters';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    mutation.mutate({ collegeId, name, rating, title, body, category });
  };

  // Rating distribution
  const dist = [5, 4, 3, 2, 1].map((star) => ({
    label: `${star}★`,
    count: data?.reviews.filter((r) => r.rating === star).length ?? 0,
  }));

  return (
    <div className="space-y-6">
      {/* Summary header */}
      <div className="bg-white rounded-xl border border-gray-100 p-6">
        <div className="flex items-center gap-2 mb-5">
          <MessageSquare size={18} className="text-primary" />
          <h2 className="font-bold text-gray-900 text-lg">Student Reviews</h2>
          {data && <span className="text-xs text-gray-400 font-medium ml-1">{data.total} review{data.total !== 1 ? 's' : ''}</span>}
        </div>

        {isLoading ? (
          <div className="h-20 bg-gray-50 rounded-lg animate-pulse" />
        ) : data && data.total > 0 ? (
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            {/* Big avg */}
            <div className="text-center shrink-0">
              <div className="text-5xl font-bold text-gray-900">{data.avgRating?.toFixed(1)}</div>
              <div className="flex justify-center gap-0.5 my-1">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star
                    key={s}
                    size={16}
                    className={s <= Math.round(data.avgRating ?? 0) ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}
                  />
                ))}
              </div>
              <div className="text-xs text-gray-400">{data.total} reviews</div>
            </div>
            {/* Distribution bars */}
            <div className="flex-1 space-y-1.5 w-full">
              {dist.map((d) => (
                <RatingBar key={d.label} label={d.label} count={d.count} total={data.total} />
              ))}
            </div>
          </div>
        ) : (
          <p className="text-gray-500 text-sm">No reviews yet. Be the first to share your experience!</p>
        )}

        {/* Write review button */}
        <div className="mt-5 pt-4 border-t border-gray-50">
          {submitted && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 text-green-600 text-sm font-medium mb-3"
            >
              <ThumbsUp size={15} />
              Thanks for your review! It's been posted.
            </motion.div>
          )}
          <button
            onClick={() => { setShowForm(!showForm); setSubmitted(false); }}
            className="flex items-center gap-2 bg-primary text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            <Star size={15} />
            {showForm ? 'Cancel' : 'Write a Review'}
          </button>
        </div>
      </div>

      {/* Review form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="bg-white rounded-xl border border-primary/20 p-6"
          >
            <h3 className="font-bold text-gray-900 mb-5">Share Your Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name + Category row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Your Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Rahul Sharma"
                    className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors ${errors.name ? 'border-red-400' : 'border-gray-200'}`}
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Category</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors bg-white"
                  >
                    {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              {/* Rating */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Overall Rating</label>
                <StarPicker value={rating} onChange={setRating} />
                {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
              </div>

              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Review Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Summarise your experience in one line"
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors ${errors.title ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
              </div>

              {/* Body */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Your Review
                  <span className="text-gray-400 font-normal ml-1">({body.length}/1000)</span>
                </label>
                <textarea
                  value={body}
                  onChange={(e) => setBody(e.target.value.slice(0, 1000))}
                  rows={4}
                  placeholder="Tell future students about academics, campus life, placements, faculty..."
                  className={`w-full border rounded-lg px-3 py-2.5 text-sm outline-none focus:border-primary transition-colors resize-none ${errors.body ? 'border-red-400' : 'border-gray-200'}`}
                />
                {errors.body && <p className="text-xs text-red-500 mt-1">{errors.body}</p>}
              </div>

              <button
                type="submit"
                disabled={mutation.isPending}
                className="flex items-center gap-2 bg-primary text-white px-6 py-2.5 rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <Send size={15} />
                {mutation.isPending ? 'Submitting…' : 'Submit Review'}
              </button>

              {mutation.isError && (
                <p className="text-sm text-red-500">{(mutation.error as Error).message}</p>
              )}
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Review list */}
      {!isLoading && data && data.reviews.length > 0 && (
        <div className="space-y-4">
          {data.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      )}
    </div>
  );
}
