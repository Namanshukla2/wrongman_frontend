import Link from 'next/link';
import Skull from './Skull';

export default function Footer() {
  return (
    <footer id="contact" style={{ background: 'var(--bg-2)', borderTop: '1px solid var(--border)' }}>
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 bg-red-600 rounded-lg flex items-center justify-center">
                <Skull className="w-5 h-5 text-white" />
              </div>
              <span className="text-lg font-black" style={{ color: 'var(--fg)' }}>
                WRONG<span className="text-red-600">MAN</span>
              </span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>
              Your Gen Z streetwear destination. Top brands at prices that won&apos;t kill your wallet.
            </p>
            <div className="flex gap-3">
              {['Instagram', 'Twitter', 'Facebook'].map((s) => (
                <a key={s} href="#" className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors text-xs font-bold"
                  style={{ background: 'var(--bg-3)', color: 'var(--fg-2)' }}>
                  {s[0]}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-bold mb-4 text-red-600">Quick Links</h3>
            <ul className="space-y-2">
              {[
                { label: 'Home', href: '/' },
                { label: 'Shop', href: '/shop' },
                { label: 'T-Shirts', href: '/shop?category=tshirts' },
                { label: 'Jackets', href: '/shop?category=jackets' },
                { label: 'Caps', href: '/shop?category=caps' },
              ].map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="text-sm hover:text-red-600 transition-colors" style={{ color: 'var(--muted)' }}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold mb-4 text-red-600">Contact Us</h3>
            <ul className="space-y-2 text-sm" style={{ color: 'var(--muted)' }}>
              <li>📧 support@wrongman.in</li>
              <li>📱 +91 98765 43210</li>
              <li>📍 New Delhi, India</li>
              <li className="pt-2">
                <span className="font-medium" style={{ color: 'var(--fg)' }}>Hours:</span><br />
                Mon–Sat: 10am – 7pm
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t pt-6 flex flex-col md:flex-row justify-between items-center gap-4" style={{ borderColor: 'var(--border)' }}>
          <p className="text-xs" style={{ color: 'var(--muted)' }}>
            © {new Date().getFullYear()} WrongMan. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs" style={{ color: 'var(--muted)' }}>
            <a href="#" className="hover:text-red-600 transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-red-600 transition-colors">Terms of Service</a>
            <a href="#" className="hover:text-red-600 transition-colors">Refund Policy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}