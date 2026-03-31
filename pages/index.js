import Link from 'next/link';
import { useRouter } from 'next/router';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';
import SEO from '../components/SEO';

export default function Home() {
  const router = useRouter();
  const { user } = useAuth();
  const { getFeaturedProducts } = useProducts();
  const { addToCart } = useCart();
  const featured = getFeaturedProducts().slice(0, 4);

  const add = (p) => {
    addToCart(p, p.sizes[0]);
    toast.success(`${p.name} added!`);
  };

  const categories = [
    { name: 'T-Shirts', slug: 'tshirts', img: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop', count: '50+' },
    { name: 'Pants', slug: 'pants', img: 'https://images.unsplash.com/photo-1542272604-787c3835535d?w=300&h=400&fit=crop', count: '30+' },
    { name: 'Jackets', slug: 'jackets', img: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop', count: '25+' },
    { name: 'Shirts', slug: 'shirts', img: 'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=300&h=400&fit=crop', count: '40+' },
    { name: 'Caps', slug: 'caps', img: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?w=300&h=400&fit=crop', count: '20+' },
  ];

  return (
    <>
      <SEO />
      <div className="skull-pattern" style={{ background: 'var(--bg)' }}>
        {/* HERO */}
        <section className="relative min-h-screen flex items-center overflow-hidden">
          <div className="absolute -top-40 -right-40 w-[600px] h-[600px] rounded-full bg-red-600/10 blur-3xl"></div>
          <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-red-600/5 blur-3xl"></div>
          <div className="absolute top-28 left-8 animate-float opacity-[var(--skull-opacity)]">
            <Skull className="w-24 h-24 md:w-40 md:h-40 text-red-600" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 pt-28 pb-16 w-full">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="text-center lg:text-left">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-6 bg-red-600/10 border border-red-600/20">
                  <Skull className="w-4 h-4 text-red-600" />
                  <span className="text-red-600 font-bold text-xs tracking-wider uppercase">Top Brands • Killer Prices</span>
                  <Skull className="w-4 h-4 text-red-600" />
                </div>
                <h1 className="font-bebas text-6xl sm:text-7xl lg:text-[110px] leading-[0.9] mb-6" style={{ color: 'var(--fg)' }}>
                  DRESS LIKE A
                  <span className="block text-red-600 text-glow-red">WRONG MAN</span>
                </h1>
                <p className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-4" style={{ color: 'var(--fg)' }}>
                  Dress well, Look well, Live well
                </p>
                <p className="text-lg md:text-xl max-w-xl mx-auto lg:mx-0 mb-8" style={{ color: 'var(--muted)' }}>
                  Your Gen Z streetwear destination — top brands at prices that won&apos;t kill your wallet.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                  <Link href="/shop" className="group bg-red-600 hover:bg-red-700 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all hover:scale-105 inline-flex items-center justify-center gap-2">
                    <Skull className="w-6 h-6 text-white" />
                    Shop Now
                  </Link>
                  <Link href="/shop?category=tshirts" className="font-bold py-4 px-8 rounded-xl text-lg border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white inline-flex items-center justify-center gap-2">
                    ☠️ New Arrivals
                  </Link>
                </div>
                <div className="flex gap-6 md:gap-10 mt-12 justify-center lg:justify-start">
                  {[{ n: '10K+', l: 'Happy Rebels' }, { n: '50+', l: 'Top Brands' }, { n: '500+', l: 'Styles' }].map((s) => (
                    <div key={s.l} className="text-center">
                      <div className="font-bebas text-3xl md:text-4xl text-red-600">{s.n}</div>
                      <div className="text-xs md:text-sm" style={{ color: 'var(--muted)' }}>{s.l}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative hidden lg:block">
                <div className="relative z-10 rounded-3xl overflow-hidden shadow-2xl border-4 border-red-600/20">
                  <img src="https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?w=500&h=650&fit=crop" alt="Wrong Man Fashion" className="w-full h-[550px] object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-red-900/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <div className="flex items-center gap-2">
                      <Skull className="w-8 h-8 text-white skull-glow" />
                      <div>
                        <div className="text-white font-black text-xl">REBEL COLLECTION</div>
                        <div className="text-red-200 text-sm">Starting at ₹999</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES BAR */}
        <section className="bg-red-600 py-4">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
            {[{ i: '📦', t: 'Free Shipping ₹999+' }, { i: '🔄', t: 'Easy Returns' }, { i: '🔒', t: 'Secure Payment' }, { i: '⚡', t: '24/7 Support' }].map((f) => (
              <div key={f.t} className="flex items-center justify-center gap-2 text-sm font-bold">
                <span>{f.i}</span><span>{f.t}</span>
              </div>
            ))}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="py-16 md:py-24 px-4" style={{ background: 'var(--bg)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <div className="flex items-center justify-center gap-3 mb-3">
                <div className="w-12 h-[2px] bg-red-600"></div>
                <Skull className="w-7 h-7 text-red-600 skull-glow" />
                <div className="w-12 h-[2px] bg-red-600"></div>
              </div>
              <h2 className="font-bebas text-4xl md:text-6xl mb-3" style={{ color: 'var(--fg)' }}>
                SHOP BY <span className="text-red-600">CATEGORY</span>
              </h2>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {categories.map((c) => (
                <Link key={c.slug} href={`/shop?category=${c.slug}`} className="group relative h-64 md:h-72 rounded-2xl overflow-hidden border-2 hover:border-red-600 transition-all" style={{ borderColor: 'var(--border)' }}>
                  <img src={c.img} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-white font-bold text-lg">{c.name}</h3>
                    <p className="text-white/70 text-sm">{c.count} Products</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* FEATURED PRODUCTS */}
        <section className="py-16 md:py-24 px-4" style={{ background: 'var(--bg-2)' }}>
          <div className="max-w-7xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-4">
              <h2 className="font-bebas text-4xl md:text-6xl" style={{ color: 'var(--fg)' }}>
                TRENDING <span className="text-red-600">NOW</span> 🔥
              </h2>
              <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl inline-flex items-center gap-2">
                View All
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              {featured.map((p) => (
                <div key={p.id} className="group rounded-2xl overflow-hidden border-2 hover:border-red-600 transition-all" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <Link href={`/product/${p.id}`} className="block relative aspect-[3/4] overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    {p.salePrice && (
                      <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">SALE</div>
                    )}
                  </Link>
                  <div className="p-4">
                    {p.brand && <span className="text-red-600 text-xs font-bold uppercase">{p.brand}</span>}
                    <Link href={`/product/${p.id}`}>
                      <h3 className="font-bold mb-1 line-clamp-1 group-hover:text-red-600" style={{ color: 'var(--fg)' }}>{p.name}</h3>
                    </Link>
                    <div className="flex items-center gap-2 mb-3">
                      {p.salePrice ? (
                        <>
                          <span className="text-red-600 font-bold text-lg">₹{p.salePrice}</span>
                          <span className="line-through text-sm" style={{ color: 'var(--muted)' }}>₹{p.price}</span>
                        </>
                      ) : (
                        <span className="font-bold text-lg" style={{ color: 'var(--fg)' }}>₹{p.price}</span>
                      )}
                    </div>
                    <button onClick={() => add(p)} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl">
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* NEWSLETTER */}
        {!user && (
          <section className="py-16 md:py-24 px-4 bg-red-600">
            <div className="max-w-3xl mx-auto text-center">
              <Skull className="w-16 h-16 text-white mx-auto mb-5" />
              <h2 className="font-bebas text-4xl md:text-6xl text-white mb-4">JOIN THE REBELLION</h2>
              <p className="text-white/90 mb-8 text-lg">Subscribe for 15% OFF your first order</p>
              <form onSubmit={(e) => { e.preventDefault(); router.push('/login'); }} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
                <input type="email" placeholder="Enter your email..." className="flex-1 px-5 py-3.5 rounded-xl bg-white/15 border-2 border-white/30 text-white placeholder-white/60 outline-none" />
                <button type="submit" className="bg-white text-red-600 font-bold px-7 py-3.5 rounded-xl hover:bg-zinc-100 transition-colors">Subscribe</button>
              </form>
            </div>
          </section>
        )}
      </div>
    </>
  );
}