// pages/product/[id].js
import { useState } from 'react';
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
  const { addToCart } = useCart();

  const product = getProductById(id);

  const [selectedSize, setSelectedSize] = useState('');
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <Skull className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--border)' }} />
          <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>Product not found</h2>
          <Link href="/shop" className="text-red-600 hover:underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const images = product.images?.length > 0 ? product.images : [product.image];
  const related = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  const handleAddToCart = () => {
    if (!selectedSize && product.sizes?.length > 0) {
      toast.error('Please select a size');
      return;
    }
    addToCart(product, selectedSize || product.sizes?.[0] || 'M', quantity);
    toast.success(`${product.name} added to cart!`);
  };

  const discount = product.salePrice ? Math.round((1 - product.salePrice / product.price) * 100) : 0;

  return (
    <>
      <SEO title={product.name} description={product.description} image={product.image} />
      <div className="min-h-screen pt-20 skull-pattern" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">

          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-sm mb-6" style={{ color: 'var(--muted)' }}>
            <Link href="/" className="hover:text-red-600 transition-colors">Home</Link>
            <span>/</span>
            <Link href="/shop" className="hover:text-red-600 transition-colors">Shop</Link>
            <span>/</span>
            <Link href={`/shop?category=${product.category}`} className="hover:text-red-600 transition-colors capitalize">{product.category}</Link>
            <span>/</span>
            <span style={{ color: 'var(--fg)' }}>{product.name}</span>
          </div>

          <div className="grid lg:grid-cols-2 gap-10 mb-16">
            {/* Images */}
            <div>
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden mb-4 border-2" style={{ borderColor: 'var(--border)' }}>
                <img src={images[selectedImage]} alt={product.name} className="w-full h-full object-cover" />
                {discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-600 text-white font-bold px-3 py-1 rounded-lg">
                    -{discount}%
                  </div>
                )}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3 overflow-x-auto">
                  {images.map((img, i) => (
                    <button key={i} onClick={() => setSelectedImage(i)}
                      className={`flex-shrink-0 w-20 h-24 rounded-xl overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-red-600' : ''}`}
                      style={selectedImage !== i ? { borderColor: 'var(--border)' } : {}}>
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Details */}
            <div>
              {product.brand && (
                <span className="text-red-600 font-bold text-sm uppercase tracking-wider">{product.brand}</span>
              )}
              <h1 className="text-3xl md:text-4xl font-black mt-1 mb-3" style={{ color: 'var(--fg)' }}>{product.name}</h1>

              {/* Price */}
              <div className="flex items-center gap-3 mb-6">
                {product.salePrice ? (
                  <>
                    <span className="text-red-600 font-black text-4xl">₹{product.salePrice}</span>
                    <span className="line-through text-xl" style={{ color: 'var(--muted)' }}>₹{product.price}</span>
                    <span className="bg-red-600 text-white text-sm font-bold px-2 py-1 rounded-lg">Save {discount}%</span>
                  </>
                ) : (
                  <span className="font-black text-4xl" style={{ color: 'var(--fg)' }}>₹{product.price}</span>
                )}
              </div>

              {product.description && (
                <p className="mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>{product.description}</p>
              )}

              {/* Size */}
              {product.sizes?.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-bold" style={{ color: 'var(--fg)' }}>Size</span>
                    {!selectedSize && <span className="text-red-600 text-sm">Please select a size</span>}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map(size => (
                      <button key={size} onClick={() => setSelectedSize(size)}
                        className={`px-4 py-2 rounded-xl font-medium border-2 transition-all ${selectedSize === size ? 'bg-red-600 text-white border-red-600' : ''}`}
                        style={selectedSize !== size ? { borderColor: 'var(--border)', color: 'var(--fg)', background: 'var(--bg-3)' } : {}}>
                        {size}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Colors */}
              {product.colors?.length > 0 && (
                <div className="mb-6">
                  <span className="font-bold block mb-2" style={{ color: 'var(--fg)' }}>Colors</span>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>{product.colors.join(', ')}</p>
                </div>
              )}

              {/* Quantity */}
              <div className="mb-6">
                <span className="font-bold block mb-3" style={{ color: 'var(--fg)' }}>Quantity</span>
                <div className="flex items-center gap-3 rounded-xl border w-fit overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                  <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="px-4 py-3 hover:bg-red-600/10 font-bold text-lg transition-colors" style={{ color: 'var(--fg)' }}>−</button>
                  <span className="px-4 font-bold text-lg" style={{ color: 'var(--fg)' }}>{quantity}</span>
                  <button onClick={() => setQuantity(q => q + 1)} className="px-4 py-3 hover:bg-red-600/10 font-bold text-lg transition-colors" style={{ color: 'var(--fg)' }}>+</button>
                </div>
              </div>

              {/* Add to Cart */}
              <button onClick={handleAddToCart} className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/25 mb-4">
                <Skull className="w-6 h-6" />
                Add to Cart ☠️
              </button>

              {/* Stock */}
              {product.stock !== undefined && (
                <p className="text-sm text-center" style={{ color: 'var(--muted)' }}>
                  {product.stock > 10 ? '✅ In Stock' : product.stock > 0 ? `⚠️ Only ${product.stock} left!` : '❌ Out of Stock'}
                </p>
              )}

              {/* Shipping info */}
              <div className="mt-6 p-4 rounded-xl" style={{ background: 'var(--bg-3)' }}>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  {[{ i: '📦', t: 'Free shipping on ₹999+' }, { i: '🔄', t: 'Easy 7-day returns' }, { i: '🔒', t: 'Secure checkout' }, { i: '⚡', t: '3-5 day delivery' }].map(f => (
                    <div key={f.t} className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
                      <span>{f.i}</span><span>{f.t}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Related Products */}
          {related.length > 0 && (
            <div>
              <h2 className="font-black text-2xl md:text-3xl mb-6" style={{ color: 'var(--fg)' }}>
                YOU MAY <span className="text-red-600">ALSO LIKE</span>
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {related.map(p => (
                  <Link key={p.id} href={`/product/${p.id}`} className="group rounded-2xl overflow-hidden border-2 hover:border-red-600 transition-all" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <div className="relative aspect-[3/4] overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      {p.salePrice && <div className="absolute top-2 left-2 bg-red-600 text-white text-xs font-bold px-2 py-0.5 rounded">SALE</div>}
                    </div>
                    <div className="p-3">
                      <h3 className="font-bold text-sm line-clamp-1 group-hover:text-red-600" style={{ color: 'var(--fg)' }}>{p.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        {p.salePrice ? (
                          <>
                            <span className="text-red-600 font-bold">₹{p.salePrice}</span>
                            <span className="line-through text-xs" style={{ color: 'var(--muted)' }}>₹{p.price}</span>
                          </>
                        ) : (
                          <span className="font-bold" style={{ color: 'var(--fg)' }}>₹{p.price}</span>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}