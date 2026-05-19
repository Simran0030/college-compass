import { Link } from 'react-router-dom';
import { Compass } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          {/* Logo + tagline */}
          <div>
            <Link to="/" className="flex items-center gap-2 font-bold text-primary text-lg mb-1">
              <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                <Compass size={15} className="text-white" />
              </div>
              College Compass
            </Link>
            <p className="text-sm text-gray-500">Your guide to India's best colleges.</p>
          </div>

          {/* Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2">
            {[
              { to: '/colleges', label: 'Colleges' },
              { to: '/compare', label: 'Compare' },
              { to: '/predictor', label: 'Predictor' },
            ].map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className="text-sm text-gray-500 hover:text-primary transition-colors font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="border-t border-gray-100 mt-6 pt-6 text-center text-xs text-gray-400">
          © {new Date().getFullYear()} College Compass. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
