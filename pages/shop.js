import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useProducts } from '../context/ProductContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';
import SEO from '../components/SEO';

export default function Shop() {
  const router = useRouter();
  const { getProductsByCategory } = useProducts();
  const { addToCart } = useCart();

  const [cat, setCat] = useState('all');
  const [sub, setSub] = useState('');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState('featured');
  const [filtered, setFiltered] = useState([]);
  
  // Track hovered product for image swap
  const [hoveredId, setHoveredId] = useState(null);

  // Main categories (fixed)
  const cats = [
    { name: 'All', slug: 'all' },
    { name: 'T-Shirts', slug: 'tshirts' },
    { name: 'Pants', slug: 'pants' },
    { name: 'Jackets', slug: 'jackets' },
    { name: 'Shirts', slug: 'shirts' },
    { name: 'Caps', slug: 'caps' },
  ];

  useEffect(() => {
    if (!router.isReady) return;
    if (router.query.category) setCat(String(router.query.category));
    if (router.query.search) setQ(String(router.query.search));
    if (router.query.sub) setSub(String(router.query.sub));
  }, [router.isReady, router.query]);

  // Build dynamic subcategory list from products for current category
  const subCategoriesForCurrentCat = (() => {
    if (cat === 'all') return [];
    const prodsInCat = getProductsByCategory(cat);
    const set = new Set();
    prodsInCat.forEach(p => {
      if (p.subCategory && p.subCategory.trim()) {
        set.add(p.subCategory.trim());
      }
    });
    return Array.from(set);
  })();

  // Filter products
  useEffect(() => {
    let r = getProductsByCategory(cat);

    if (q) {
      const qLower = q.toLowerCase();
      r = r.filter(p =>
        p.name.toLowerCase().includes(qLower) ||
        (p.brand && p.brand.toLowerCase().includes(qLower))
      );
    }

    if (sub) {
      const subLower = sub.toLowerCase();
      r = r.filter(p => (p.subCategory || '').toLowerCase() === subLower);
    }

    switch (sort) {
      case 'price-low':
        r.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
        break;
      case 'price-high':
        r.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
        break;
      case 'newest':
        r.sort((a, b) => b.id - a.id);
        break;
      default:
        r.sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0));
    }

    setFiltered([...r]);
  }, [cat, q, sub, sort, getProductsByCategory]);

  const add = (p) => {
    addToCart(p, p.sizes?.[0] || 'M'); // default size fallback
    toast.success(`${p.name} added!`);
  };

  return (
    <>
      <SEO title="Shop" description="Browse our collection of men's streetwear." />
      <div className="min-h-screen pt-20 skull-pattern" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <div className="bg-red-600 py-10 px-4">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-bebas text-4xl md:text-5xl text-white">
              TOP BRANDS, BEST PRICES ☠️
            </h1>
            <p className="text-white/80">
              All your favorite brands at killer prices!
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Filters */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 mb-4">
            {/* Categories */}
            <div>
              <div className="flex flex-wrap gap-2">
                {cats.map(c => (
                  <button
                    key={c.slug}
                    onClick={() => { setCat(c.slug); setSub(''); }}
                    className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${cat === c.slug ? 'bg-red-600 text-white' : ''}`}
                    style={cat !== c.slug ? { background: 'var(--bg-3)', color: 'var(--fg-2)' } : {}}
                  >
                    {c.name}
                  </button>
                ))}
              </div>

              {/* Dynamic subcategories for the selected category */}
              {cat !== 'all' && subCategoriesForCurrentCat.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  <button
                    onClick={() => setSub('')}
                    className={`px-3 py-1 rounded-full text-xs font-medium ${!sub ? 'bg-red-600 text-white' : ''}`}
                    style={sub ? { background: 'var(--bg-3)', color: 'var(--fg-2)' } : {}}
                  >
                    All {cats.find(c => c.slug === cat)?.name || ''}
                  </button>
                  {subCategoriesForCurrentCat.map(subName => (
                    <button
                      key={subName}
                      onClick={() => setSub(subName)}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${sub === subName ? 'bg-red-600 text-white' : ''}`}
                      style={sub !== subName ? { background: 'var(--bg-3)', color: 'var(--fg-2)' } : {}}
                    >
                      {subName}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search + Sort */}
            <div className="flex gap-3 w-full lg:w-auto">
              <input
                value={q}
                onChange={e => setQ(e.target.value)}
                placeholder="Search…"
                className="rounded-xl px-4 py-2 text-sm w-full sm:w-44"
                style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              />
              <select
                value={sort}
                onChange={e => setSort(e.target.value)}
                className="rounded-xl px-3 py-2 text-sm"
                style={{ background: 'var(--bg-3)', border: '1px solid var(--border)', color: 'var(--fg)' }}
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low → High</option>
                <option value="price-high">Price: High → Low</option>
              </select>
            </div>
          </div>

          <p className="mb-6 text-sm" style={{ color: 'var(--muted)' }}>
            {filtered.length} products found
          </p>

          {/* Products Grid */}
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <Skull className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border)' }} />
              <p style={{ color: 'var(--muted)' }}>No products found</p>
              <button
                onClick={() => { setQ(''); setCat('all'); setSub(''); }}
                className="text-red-600 hover:underline mt-2"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {filtered.map(p => {
                // Determine images for hover effect
                const mainImage = p.image || (p.images && p.images[0]);
                const hoverImage = (p.images && p.images.length > 1) ? p.images[1] : null;
                const isHovered = hoveredId === p.id;

                return (
                  <div
                    key={p.id}
                    className="group rounded-2xl overflow-hidden border-2 hover:border-red-600 transition-all"
                    style={{ background: 'var(--card)', borderColor: 'var(--border)' }}
                    onMouseEnter={() => setHoveredId(p.id)}
                    onMouseLeave={() => setHoveredId(null)}
                  >
                    <Link href={`/product/${p.id}`} className="block relative aspect-[3/4] overflow-hidden">
                      <img
                        src={isHovered && hoverImage ? hoverImage : mainImage}
                        alt={p.name}
                        className="w-full h-full object-cover transition-opacity duration-300"
                      />
                      {p.salePrice && (
                        <div className="absolute top-3 left-3 bg-red-600 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                          -{Math.round((1 - p.salePrice / p.price) * 100)}%
                        </div>
                      )}
                    </Link>
                    <div className="p-4">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {p.brand && (
                          <span className="text-red-600 text-xs font-bold uppercase">
                            {p.brand}
                          </span>
                        )}
                      </div>
                      <Link href={`/product/${p.id}`}>
                        <h3
                          className="font-bold mb-1 line-clamp-1 group-hover:text-red-600"
                          style={{ color: 'var(--fg)' }}
                        >
                          {p.name}
                        </h3>
                      </Link>
                      <div className="flex items-center gap-2 mb-3">
                        {p.salePrice ? (
                          <>
                            <span className="text-red-600 font-bold text-lg">₹{p.salePrice}</span>
                            <span className="line-through text-sm" style={{ color: 'var(--muted)' }}>
                              ₹{p.price}
                            </span>
                          </>
                        ) : (
                          <span className="font-bold text-lg" style={{ color: 'var(--fg)' }}>
                            ₹{p.price}
                          </span>
                        )}
                      </div>
                      <button
                        onClick={() => add(p)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-xl text-sm"
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}