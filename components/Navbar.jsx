// components/Navbar.jsx
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import Skull from './Skull';

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState('');
  const { setIsCartOpen, getCartCount } = useCart();
  const { theme, toggle } = useTheme();
  const { user, logout } = useAuth();
  const router = useRouter();

  const search = (e) => {
    e.preventDefault();
    if (q.trim()) {
      router.push(`/shop?search=${encodeURIComponent(q)}`);
      setQ('');
      setOpen(false);
    }
  };

  const handleLogout = () => {
    logout();
    setOpen(false);
  };

  // Scroll to footer function
  const scrollToContact = (e) => {
    e.preventDefault();
    setOpen(false); // Close mobile menu if open
    
    const footer = document.getElementById('contact');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl border-b"
      style={{
        background: 'var(--nav-bg)',
        borderColor: 'var(--border)',
      }}
    >
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 md:h-18">
          
          {/* Left: Logo + Nav Links */}
          <div className="flex items-center gap-8">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 group">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center shadow-lg shadow-red-600/20 group-hover:scale-105 transition-transform">
                <Skull className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black tracking-tight hidden sm:block" style={{ color: 'var(--fg)' }}>
                WRONG<span className="text-red-600">MAN</span>
              </span>
            </Link>

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              <Link
                href="/"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-600/10 hover:text-red-600"
                style={{ color: 'var(--fg-2)' }}
              >
                Home
              </Link>
              <Link
                href="/shop"
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-600/10 hover:text-red-600"
                style={{ color: 'var(--fg-2)' }}
              >
                Shop
              </Link>
              {/* Contact Us - Scrolls to Footer */}
              <button
                onClick={scrollToContact}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-600/10 hover:text-red-600"
                style={{ color: 'var(--fg-2)' }}
              >
                Contact Us
              </button>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  className="px-4 py-2 rounded-lg text-sm font-medium transition-colors hover:bg-red-600/10 text-red-600"
                >
                  Admin
                </Link>
              )}
            </div>
          </div>

          {/* Center: Search Box (Desktop) */}
          <form onSubmit={search} className="hidden lg:flex items-center flex-1 max-w-md mx-8">
            <div className="relative w-full">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full px-5 py-2.5 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                }}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {q && (
                <button
                  type="submit"
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full text-xs font-medium transition-colors"
                >
                  Search
                </button>
              )}
            </div>
          </form>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            {/* Theme Toggle */}
            <button
              onClick={toggle}
              className="p-2.5 rounded-full transition-colors hover:bg-red-600/10"
              style={{ color: 'var(--fg-2)' }}
              title={theme === 'light' ? 'Dark mode' : 'Light mode'}
            >
              {theme === 'light' ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                  />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              )}
            </button>

            {/* Cart */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2.5 rounded-full transition-colors hover:bg-red-600/10"
              style={{ color: 'var(--fg-2)' }}
              title="Cart"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              {getCartCount() > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-lg">
                  {getCartCount()}
                </span>
              )}
            </button>

            {/* Login / Logout (Desktop) */}
            <div className="hidden md:flex items-center gap-2 ml-2">
              {user ? (
                <>
                  <span
                    className="text-xs px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--bg-3)', color: 'var(--muted)' }}
                  >
                    {user.name || user.email?.split('@')[0]}
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <Link
                  href="/login"
                  className="px-5 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
                >
                  Login
                </Link>
              )}
            </div>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setOpen(!open)}
              className="md:hidden p-2.5 rounded-full transition-colors hover:bg-red-600/10"
              style={{ color: 'var(--fg)' }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {open ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {open && (
        <div
          className="md:hidden border-t"
          style={{ borderColor: 'var(--border)', background: 'var(--bg)' }}
        >
          <div className="px-4 py-4 space-y-3">
            {/* Mobile Search */}
            <form onSubmit={search} className="relative">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="w-full rounded-full px-5 py-3 pl-11 text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  color: 'var(--fg)',
                }}
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4"
                style={{ color: 'var(--muted)' }}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>

            {/* Mobile Nav Links */}
            <div className="flex flex-col gap-1">
              <Link
                href="/"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-600/10"
                style={{ color: 'var(--fg)' }}
              >
                Home
              </Link>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-600/10"
                style={{ color: 'var(--fg)' }}
              >
                Shop
              </Link>
              {/* Contact Us - Scrolls to Footer */}
              <button
                onClick={scrollToContact}
                className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-600/10 text-left"
                style={{ color: 'var(--fg)' }}
              >
                Contact Us
              </button>
              {user?.role === 'admin' && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-medium transition-colors hover:bg-red-600/10 text-red-600"
                >
                  Admin Panel
                </Link>
              )}
            </div>

            {/* Mobile Auth */}
            <div className="pt-2 border-t" style={{ borderColor: 'var(--border)' }}>
              {user ? (
                <div className="flex items-center justify-between">
                  <span className="text-sm" style={{ color: 'var(--muted)' }}>
                    Signed in as <strong style={{ color: 'var(--fg)' }}>{user.name || user.email}</strong>
                  </span>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setOpen(false)}
                  className="block w-full text-center px-4 py-3 rounded-full text-sm font-medium bg-red-600 text-white hover:bg-red-700 transition-colors"
                >
                  Login / Sign up
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}