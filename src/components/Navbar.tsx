import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';
import { useRouter } from '@/lib/router';

const navLinks = [
  { label: 'Trang chủ', path: '/' },
  { label: 'Dự án', path: '/projects' },
  { label: 'Liên hệ', path: '/contact' },
];

export default function Navbar() {
  const { path, navigate } = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleNavigate = (to: string) => {
    navigate(to);
    setMenuOpen(false);
  };

  const isActive = (linkPath: string) => {
    if (linkPath === '/') return path === '/';
    return path.startsWith(linkPath);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled || menuOpen
          ? 'bg-stone-900/95 backdrop-blur-md shadow-lg'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-20">
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-2 group"
        >
          <span className="text-2xl font-serif tracking-wide text-stone-100 group-hover:text-amber-400 transition-colors duration-300">
            La Creatión
          </span>
        </button>

        {/* Desktop nav */}
        <ul className="hidden md:flex items-center gap-10">
          {navLinks.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => handleNavigate(link.path)}
                className={`text-sm uppercase tracking-widest font-medium transition-colors duration-300 relative ${
                  isActive(link.path)
                    ? 'text-amber-400'
                    : 'text-stone-200 hover:text-amber-400'
                }`}
              >
                {link.label}
                <span
                  className={`absolute -bottom-1 left-0 h-px bg-amber-400 transition-all duration-300 ${
                    isActive(link.path) ? 'w-full' : 'w-0'
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-stone-100"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 bg-stone-900/95 backdrop-blur-md ${
          menuOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <ul className="px-6 py-4 space-y-4">
          {navLinks.map((link) => (
            <li key={link.path}>
              <button
                onClick={() => handleNavigate(link.path)}
                className={`text-sm uppercase tracking-widest font-medium transition-colors duration-300 ${
                  isActive(link.path)
                    ? 'text-amber-400'
                    : 'text-stone-200 hover:text-amber-400'
                }`}
              >
                {link.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </header>
  );
}
