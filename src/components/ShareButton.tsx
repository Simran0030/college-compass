import { useState } from 'react';
import { Share2, Twitter, Linkedin, Link2, Check, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface ShareButtonProps {
  url: string;
  title: string;
  description?: string;
}

interface ShareOption {
  label: string;
  icon: React.ReactNode;
  color: string;
  action: () => void;
}

export default function ShareButton({ url, title, description = '' }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);
  const encodedDesc = encodeURIComponent(description);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback for older browsers
      const el = document.createElement('input');
      el.value = url;
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const options: ShareOption[] = [
    {
      label: 'Twitter / X',
      icon: <Twitter size={16} />,
      color: 'hover:bg-black hover:text-white',
      action: () => {
        window.open(
          `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
          '_blank',
          'noopener,noreferrer,width=600,height=400'
        );
        setOpen(false);
      },
    },
    {
      label: 'WhatsApp',
      icon: <MessageCircle size={16} />,
      color: 'hover:bg-green-500 hover:text-white',
      action: () => {
        window.open(
          `https://wa.me/?text=${encodedTitle}%20${encodedUrl}`,
          '_blank',
          'noopener,noreferrer'
        );
        setOpen(false);
      },
    },
    {
      label: 'LinkedIn',
      icon: <Linkedin size={16} />,
      color: 'hover:bg-blue-600 hover:text-white',
      action: () => {
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}&title=${encodedTitle}&summary=${encodedDesc}`,
          '_blank',
          'noopener,noreferrer,width=600,height=500'
        );
        setOpen(false);
      },
    },
    {
      label: copied ? 'Copied!' : 'Copy Link',
      icon: copied ? <Check size={16} /> : <Link2 size={16} />,
      color: copied ? 'bg-green-50 text-green-600' : 'hover:bg-gray-100',
      action: copyLink,
    },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 border border-gray-200 text-gray-600 hover:border-primary hover:text-primary px-3.5 py-2 rounded-lg text-sm font-semibold transition-colors"
        aria-label="Share this college"
      >
        <Share2 size={15} />
        Share
      </button>

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setOpen(false)}
            />

            {/* Dropdown */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -6 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -6 }}
              transition={{ duration: 0.15 }}
              className="absolute right-0 top-full mt-2 w-48 bg-white rounded-xl border border-gray-100 shadow-lg z-50 overflow-hidden"
            >
              <div className="p-1.5">
                <p className="text-xs text-gray-400 font-medium px-2.5 py-1.5">Share via</p>
                {options.map((opt) => (
                  <button
                    key={opt.label}
                    onClick={opt.action}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 transition-colors ${opt.color}`}
                  >
                    {opt.icon}
                    {opt.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
