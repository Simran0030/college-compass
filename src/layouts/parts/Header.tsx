import { useState, useRef, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Compass, Menu, X, BarChart2, Heart, User, LogOut, ChevronDown, LogIn } from 'lucide-react';
import { useCompare } from '@/contexts/CompareContext';
import { useWishlist } from '@/contexts/WishlistContext';
import { useSession, signOut } from '@/lib/auth/auth-client';

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { compareIds } = useCompare();
  const { count: wishlistCount } = useWishlist();
  const { session, isAuthenticated } = useSession();
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close user menu on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setUserMenuOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  async function handleSignOut() {
    await signOut();
    setUserMenuOpen(false);
    navigate('/');
  }

  const navLinks = [
    { to: '/colleges', label: 'Colleges' },
    { to: '/predictor', label: 'Predictor' },
  ];

  const userInitial = session?.user?.name?.[0]?.toUpperCase() || session?.user?.email?.[0]?.toUpperCase() || 'U';
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || 'Account';

  return (
    <header className="bg-white border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Compass size={18} className="text-white" />
            </div>
            <span>College Compass</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/compare"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <BarChart2 size={15} />
              Compare
              {compareIds.length > 0 && (
                <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/wishlist"
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`
              }
            >
              <Heart size={15} className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Auth section */}
            {isAuthenticated ? (
              <div className="relative ml-1" ref={menuRef}>
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:border-primary/30 hover:bg-gray-50 transition-colors"
                >
                  <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center text-white text-xs font-bold">
                    {userInitial}
                  </div>
                  <span className="text-sm font-semibold text-gray-700 max-w-[90px] truncate">{userName}</span>
                  <ChevronDown size={13} className={`text-gray-400 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-xl border border-gray-100 shadow-lg py-1.5 z-50">
                    <div className="px-4 py-2.5 border-b border-gray-50">
                      <p className="text-xs font-semibold text-gray-900 truncate">{session?.user?.name || 'User'}</p>
                      <p className="text-xs text-gray-400 truncate">{session?.user?.email}</p>
                    </div>
                    <button
                      onClick={handleSignOut}
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut size={14} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2 ml-1">
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-semibold text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
                >
                  <LogIn size={14} />
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-bold bg-primary text-white hover:bg-primary/90 transition-colors"
                >
                  <User size={14} />
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile nav */}
        {mobileOpen && (
          <div className="md:hidden border-t border-gray-100 py-3 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                    isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <NavLink
              to="/compare"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <BarChart2 size={15} />
              Compare
              {compareIds.length > 0 && (
                <span className="bg-primary text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {compareIds.length}
                </span>
              )}
            </NavLink>
            <NavLink
              to="/wishlist"
              onClick={() => setMobileOpen(false)}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  isActive ? 'bg-rose-50 text-rose-600' : 'text-gray-600 hover:bg-gray-50'
                }`
              }
            >
              <Heart size={15} className={wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''} />
              Wishlist
              {wishlistCount > 0 && (
                <span className="bg-rose-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </NavLink>

            {/* Mobile auth */}
            <div className="pt-2 border-t border-gray-100 mt-2">
              {isAuthenticated ? (
                <>
                  <div className="px-4 py-2 text-xs text-gray-500 font-medium">{session?.user?.email}</div>
                  <button
                    onClick={() => { handleSignOut(); setMobileOpen(false); }}
                    className="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg text-sm font-semibold text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut size={15} />
                    Sign Out
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
                  >
                    <LogIn size={15} />
                    Sign In
                  </Link>
                  <Link
                    to="/signup"
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-bold text-primary hover:bg-primary/5 transition-colors"
                  >
                    <User size={15} />
                    Create Account
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
