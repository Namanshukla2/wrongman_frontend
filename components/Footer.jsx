import Link from 'next/link';
import Skull from './Skull';
import { FaInstagram, FaFacebook, FaTwitter, FaWhatsapp } from 'react-icons/fa';
import { HiUserGroup } from 'react-icons/hi';

export default function Footer() {
  const socialLinks = [
    {
      name: 'Instagram',
      icon: FaInstagram,
      href: 'https://www.instagram.com/wrong.man11?igsh=a3JjZnU0MjM3M2Yz',
      color: '#E4405F'
    },
    {
      name: 'Facebook',
      icon: FaFacebook,
      href: 'https://facebook.com/wrongman',
      color: '#1877F2'
    },
    {
      name: 'Twitter',
      icon: FaTwitter,
      href: 'https://twitter.com/wrongman_',
      color: '#1DA1F2'
    },
    {
      name: 'WhatsApp',
      icon: FaWhatsapp,
      href: 'https://wa.me/918519081136',
      color: '#25D366'
    },
    {
      name: 'WhatsApp Group',
      icon: HiUserGroup,
      href: 'https://chat.whatsapp.com/FmhoUcmZr5j5sxmXo0qari?mode=gi_t', // Replace with your actual WhatsApp group link
      color: '#25D366'
    }
  ];

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
              Your Gen Z streetwear destination. Top brands at prices that won't kill your wallet.
            </p>
            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon;
                return (
                  <a
                    key={social.name}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    title={social.name}
                    className="w-9 h-9 rounded-full flex items-center justify-center hover:scale-110 transition-all duration-300"
                    style={{ background: 'var(--bg-3)', color: 'var(--fg-2)' }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = social.color;
                      e.currentTarget.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'var(--bg-3)';
                      e.currentTarget.style.color = 'var(--fg-2)';
                    }}
                    aria-label={social.name}
                  >
                    <Icon size={16} />
                  </a>
                );
              })}
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
              <li>📧 ajay0524sharma@gmail.com</li>
              <li>
                <a 
                  href="https://wa.me/918519081136" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="hover:text-green-500 transition-colors"
                >
                  📱 +91 8519081136
                </a>
              </li>
              <li>📍 Bhopal, Madhya Pradesh</li>
              <li className="pt-2">
                <span className="font-medium" style={{ color: 'var(--fg)' }}>Hours:</span><br />
                Mon–Sat: 10am – 7pm
              </li>
              <li className="pt-2">
                <a 
                  href="https://chat.whatsapp.com/FmhoUcmZr5j5sxmXo0qari?mode=gi_t"
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 bg-green-500 text-white px-3 py-2 rounded-lg hover:bg-green-600 transition-colors text-xs font-medium"
                >
                  <FaWhatsapp size={14} />
                  Join Our WhatsApp Group
                </a>
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