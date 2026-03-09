// components/Footer.jsx
import Link from 'next/link';
import Skull from './Skull';

const Footer = () => (
  <footer
    id="contact"
    className="border-t relative overflow-hidden"
    style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}
  >
    <div className="absolute right-0 top-1/2 -translate-y-1/2 opacity-[0.02]">
      <Skull className="w-80 h-80 text-red-600" />
    </div>

    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
        {/* Brand */}
        <div>
          <Link href="/" className="flex items-center gap-2.5 mb-4 group">
            <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-red-600/25">
              <Skull className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-black leading-none" style={{ color: 'var(--fg)' }}>
                WRONG<span className="text-red-600">MAN</span>
              </span>
              <span className="text-[8px] tracking-[0.25em]" style={{ color: 'var(--muted)' }}>
                MULTI-BRAND STORE
              </span>
            </div>
          </Link>
          <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
            ☠️ Your Gen Z multi-brand streetwear destination. Top brands at killer prices.
          </p>
          <div className="flex gap-3">
            {[
              { name: 'instagram', icon: 'I', href: 'https://instagram.com' },
              { name: 'facebook', icon: 'F', href: 'https://facebook.com' },
              { name: 'twitter', icon: 'X', href: 'https://twitter.com' },
            ].map((s) => (
              <a
                key={s.name}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-colors bg-red-600/10 hover:bg-red-600 text-red-600 hover:text-white"
              >
                <span className="text-sm font-bold">{s.icon}</span>
              </a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Quick Links
          </h3>
          <ul className="space-y-2">
            {[
              { t: 'Shop All', l: '/shop' },
              { t: 'T-Shirts', l: '/shop?category=tshirts' },
              { t: 'Pants', l: '/shop?category=pants' },
              { t: 'Jackets', l: '/shop?category=jackets' },
              { t: 'Caps', l: '/shop?category=caps' },
            ].map((i) => (
              <li key={i.t}>
                <Link
                  href={i.l}
                  className="hover:text-red-600 transition-colors text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  {i.t}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Support */}
        <div>
          <h3 className="font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Support
          </h3>
          <ul className="space-y-2">
            {[
              { t: 'Track Order', l: '#' },
              { t: 'Shipping Info', l: '#' },
              { t: 'Returns & Exchange', l: '#' },
              { t: 'Size Guide', l: '#' },
              { t: 'FAQs', l: '#' },
            ].map((item) => (
              <li key={item.t}>
                <a
                  href={item.l}
                  className="hover:text-red-600 transition-colors text-sm"
                  style={{ color: 'var(--muted)' }}
                >
                  {item.t}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h3 className="font-bold mb-4" style={{ color: 'var(--fg)' }}>
            Contact Us
          </h3>
          <ul className="space-y-3 text-sm" style={{ color: 'var(--muted)' }}>
            <li className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                📧
              </span>
              support@wrongman.com
            </li>
            <li className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                📞
              </span>
              +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                💬
              </span>
              WhatsApp: +91 98765 43210
            </li>
            <li className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-lg bg-red-600/10 flex items-center justify-center text-red-600">
                📍
              </span>
              New Delhi, India
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div
        className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4"
        style={{ borderColor: 'var(--border)' }}
      >
        <p className="text-sm flex items-center gap-2" style={{ color: 'var(--muted)' }}>
          <Skull className="w-4 h-4 text-red-600" />
          © 2025 Wrong Man. All rights reserved. ☠️
        </p>
        <div className="flex items-center gap-4 text-sm" style={{ color: 'var(--muted)' }}>
          <a href="#" className="hover:text-red-600 transition-colors">
            Privacy Policy
          </a>
          <span>•</span>
          <a href="#" className="hover:text-red-600 transition-colors">
            Terms of Service
          </a>
          <span>•</span>
          <a href="#" className="hover:text-red-600 transition-colors">
            Refund Policy
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;