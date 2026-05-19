import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface WishlistContextType {
  wishlistIds: number[];
  addToWishlist: (id: number) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (id: number) => void;
  isWishlisted: (id: number) => boolean;
  clearWishlist: () => void;
  count: number;
}

const WishlistContext = createContext<WishlistContextType | null>(null);

const STORAGE_KEY = 'college-compass-wishlist';

export function WishlistProvider({ children }: { children: ReactNode }) {
  const [wishlistIds, setWishlistIds] = useState<number[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Persist to localStorage on every change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(wishlistIds));
    } catch {
      // ignore storage errors
    }
  }, [wishlistIds]);

  const addToWishlist = (id: number) => {
    setWishlistIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const removeFromWishlist = (id: number) => {
    setWishlistIds((prev) => prev.filter((cid) => cid !== id));
  };

  const toggleWishlist = (id: number) => {
    setWishlistIds((prev) =>
      prev.includes(id) ? prev.filter((cid) => cid !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id: number) => wishlistIds.includes(id);

  const clearWishlist = () => setWishlistIds([]);

  return (
    <WishlistContext.Provider
      value={{ wishlistIds, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted, clearWishlist, count: wishlistIds.length }}
    >
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist must be used within WishlistProvider');
  return ctx;
}
