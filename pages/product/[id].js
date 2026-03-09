import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useProducts } from '../../context/ProductContext';
import { useCart } from '../../context/CartContext';
import toast from 'react-hot-toast';
import Skull from '../../components/Skull';
import SEO from '../../components/SEO';

export default function ProductDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { getProductById, products } = useProducts();
  const { addToCart, setIsCartOpen } = useCart();

  const [product, setProduct] = useState(null);
  const [size, setSize] = useState('');
  const [color, setColor] = useState('');
  const [qty, setQty] = useState(1);

  // Image gallery state
  const [imgIdx, setImgIdx] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  useEffect(() => {
    if (id) {
      const p = getProductById(id);
      if (p) {
        setProduct(p);
        setSize(p.sizes?.[0] || '');
        setColor(p.colors?.[0] || '');
        setImgIdx(0);
      }
    }
  }, [id, products, getProductById]);

  useEffect(() => {
    if (!product || !product.images || product.images.length <= 1 || isHovered) return;

    const interval = setInterval(() => {
      setImgIdx((prev) => (prev + 1) % product.images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [product, isHovered]); // dependent on product changes, not imgIdx itself to avoid reset on manual change if desired (simple version)

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <Skull className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border)' }} />
          <p style={{ color: 'var(--muted)' }} className="mb-4">Product not found</p>
          <Link href="/shop" className="text-red-600 hover:underline">← Back to Shop</Link>
        </div>
      </div>
    );
  }

  const add = () => {
    if (!size) { toast.error('Select a size'); return; }
    addToCart(product, size, qty);
    toast.success(`${product.name} added!`);
  };

  const buyNow = () => {
    if (!size) { toast.error('Select a size'); return; }
    addToCart(product, size, qty);
    setIsCartOpen(true);
  };

  // Swipe handlers
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null || !product.images || product.images.length <= 1) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;

    if (diff > 50) {
      // swipe left -> next image
      setImgIdx((prev) => (prev + 1) % product.images.length);
    } else if (diff < -50) {
      // swipe right -> prev image
      setImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length);
    }
    setTouchStartX(null);
  };

  // Use main image if images array is empty or missing
  const currentImage = (product.images && product.images.length > 0)
    ? product.images[imgIdx]
    : product.image;

  return (
    <>
      <SEO title={product.name} description={product.description} image={product.image} />
      <div className="min-h-screen pt-20 skull-pattern" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm mb-8 flex-wrap">
            <Link href="/" className="hover:text-red-600" style={{ color: 'var(--muted)' }}>Home</Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <Link href="/shop" className="hover:text-red-600" style={{ color: 'var(--muted)' }}>Shop</Link>
            <span style={{ color: 'var(--border)' }}>/</span>
            <span style={{ color: 'var(--fg-2)' }}>{product.name}</span>
          </nav>

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
            {/* Image Gallery */}
            <div className="space-y-4">
              <div
                className="relative aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gray-100 dark:border-gray-800 select-none bg-gray-50 dark:bg-gray-900 group"
                onTouchStart={handleTouchStart}
                onTouchEnd={handleTouchEnd}
                onMouseEnter={() => setIsHovered(true)} // 👈 Pause on hover
                onMouseLeave={() => setIsHovered(false)} // 👈 Resume on leave
              >
                {/* SLIDING TRACK */}
                <div
                  className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                  style={{ transform: `translateX(-${imgIdx * 100}%)` }}
                >
                  {/* If images exist, map them. Else show main image. */}
                  {(product.images && product.images.length > 0 ? product.images : [product.image]).map((img, i) => (
                    <div key={i} className="min-w-full h-full flex-shrink-0 relative">
                      <img
                        src={img}
                        alt={`${product.name} - View ${i + 1}`}
                        className="w-full h-full object-cover"
                        loading="eager"
                      />
                    </div>
                  ))}
                </div>

                {/* Dots indicator */}
                {product.images && product.images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                    {product.images.map((_, i) => (
                      <div
                        key={i}
                        className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${i === imgIdx ? 'bg-red-600 w-6' : 'bg-white/60 w-1.5 hover:bg-white'
                          }`}
                      />
                    ))}
                  </div>
                )}

                {/* Arrow buttons (Show on Hover) */}
                {product.images && product.images.length > 1 && (
                  <>
                    <button
                      onClick={() => setImgIdx((prev) => (prev - 1 + product.images.length) % product.images.length)}
                      className="hidden md:flex absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white text-white hover:text-black rounded-full items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform -translate-x-4 group-hover:translate-x-0"
                    >
                      ‹
                    </button>
                    <button
                      onClick={() => setImgIdx((prev) => (prev + 1) % product.images.length)}
                      className="hidden md:flex absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white text-white hover:text-black rounded-full items-center justify-center transition-all opacity-0 group-hover:opacity-100 transform translate-x-4 group-hover:translate-x-0"
                    >
                      ›
                    </button>
                  </>
                )}
              </div>

              {/* Thumbnails (Keep as is) */}
              {product.images && product.images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setImgIdx(i)}
                      className={`relative w-20 h-24 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${i === imgIdx
                          ? 'border-red-600 ring-2 ring-red-600/20 scale-95'
                          : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>
            {/* Product Info */}
            <div>
              <div className="flex flex-wrap items-center gap-2 mb-3">
                {product.brand && (
                  <span className="text-red-600 text-sm font-bold px-3 py-1 rounded-lg border border-red-600/30">
                    {product.brand}
                  </span>
                )}
                {product.subCategory && (
                  <span className="text-xs bg-gray-100 dark:bg-gray-800 text-gray-500 px-2 py-1 rounded">
                    {product.subCategory}
                  </span>
                )}
              </div>

              <h1 className="text-3xl md:text-4xl font-black mb-4" style={{ color: 'var(--fg)' }}>{product.name}</h1>

              <div className="flex items-center gap-4 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-4xl font-black text-red-600">₹{product.salePrice}</span>
                    <span className="text-2xl line-through" style={{ color: 'var(--muted)' }}>₹{product.price}</span>
                  </>
                ) : (
                  <span className="text-4xl font-black" style={{ color: 'var(--fg)' }}>₹{product.price}</span>
                )}
              </div>

              <p className="mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>{product.description}</p>

              {/* Size Selector */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-5">
                  <label className="block font-medium mb-2" style={{ color: 'var(--fg)' }}>Select Size</label>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(s => (
                      <button key={s} onClick={() => setSize(s)}
                        className={`w-12 h-12 rounded-xl font-bold transition-all ${size === s ? 'bg-red-600 text-white shadow-lg shadow-red-600/30' : ''}`}
                        style={size !== s ? { background: 'var(--bg-3)', color: 'var(--fg-2)', border: '1px solid var(--border)' } : {}}>
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Color Selector (if exists) */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-5">
                  <label className="block font-medium mb-2" style={{ color: 'var(--fg)' }}>Color: <span className="text-gray-500 font-normal">{color}</span></label>
                  <div className="flex flex-wrap gap-2">
                    {product.colors.map(c => (
                      <button key={c} onClick={() => setColor(c)}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${color === c ? 'ring-2 ring-red-600' : ''}`}
                        style={{ background: 'var(--bg-3)', color: 'var(--fg-2)', border: '1px solid var(--border)' }}>
                        {c}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-8">
                <label className="block font-medium mb-2" style={{ color: 'var(--fg)' }}>Quantity</label>
                <div className="flex items-center gap-3">
                  <button onClick={() => setQty(Math.max(1, qty - 1))} className="w-12 h-12 rounded-xl text-xl font-bold transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    style={{ background: 'var(--bg-3)', color: 'var(--fg)', border: '1px solid var(--border)' }}>-</button>
                  <span className="font-bold text-xl w-10 text-center" style={{ color: 'var(--fg)' }}>{qty}</span>
                  <button onClick={() => setQty(qty + 1)} className="w-12 h-12 rounded-xl text-xl font-bold transition-colors hover:bg-gray-200 dark:hover:bg-gray-700"
                    style={{ background: 'var(--bg-3)', color: 'var(--fg)', border: '1px solid var(--border)' }}>+</button>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 mb-8">
                <button onClick={add} className="flex-1 font-bold py-4 rounded-xl border-2 border-red-600 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                  Add to Cart
                </button>
                <button onClick={buyNow} className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl animate-pulse-glow transition-all shadow-lg shadow-red-600/20">
                  Buy Now
                </button>
              </div>

              {/* Features Grid */}
              <div className="grid grid-cols-2 gap-4 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📦</span>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--fg)' }}>Free Shipping</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>On orders over ₹999</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl">🔄</span>
                  <div>
                    <div className="font-medium" style={{ color: 'var(--fg)' }}>Easy Returns</div>
                    <div className="text-sm" style={{ color: 'var(--muted)' }}>7 days return policy</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}