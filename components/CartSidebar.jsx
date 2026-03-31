import { useCart } from '../context/CartContext';
import Link from 'next/link';
import Skull from './Skull';

export default function CartSidebar() {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal, getCartCount } = useCart();

  if (!isCartOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      />

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 flex flex-col shadow-2xl" style={{ background: 'var(--bg)' }}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2">
            <Skull className="w-6 h-6 text-red-600" />
            <h2 className="text-xl font-black" style={{ color: 'var(--fg)' }}>
              CART <span className="text-red-600">({getCartCount()})</span>
            </h2>
          </div>
          <button
            onClick={() => setIsCartOpen(false)}
            className="p-2 rounded-full hover:bg-red-600/10 transition-colors"
            style={{ color: 'var(--fg)' }}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <Skull className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border)' }} />
              <p className="font-bold mb-1" style={{ color: 'var(--fg)' }}>Your cart is empty</p>
              <p className="text-sm mb-6" style={{ color: 'var(--muted)' }}>Add some items to get started</p>
              <button
                onClick={() => setIsCartOpen(false)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors"
              >
                Shop Now
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.cartId} className="flex gap-4 p-3 rounded-xl border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm line-clamp-1 mb-1" style={{ color: 'var(--fg)' }}>{item.name}</h3>
                    <p className="text-xs mb-2" style={{ color: 'var(--muted)' }}>Size: {item.size}</p>
                    <div className="flex items-center gap-2 mb-2">
                      {item.salePrice ? (
                        <>
                          <span className="text-red-600 font-bold">₹{item.salePrice}</span>
                          <span className="line-through text-xs" style={{ color: 'var(--muted)' }}>₹{item.price}</span>
                        </>
                      ) : (
                        <span className="font-bold" style={{ color: 'var(--fg)' }}>₹{item.price}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 rounded-lg border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="px-3 py-1 hover:bg-red-600/10 transition-colors font-bold"
                          style={{ color: 'var(--fg)' }}
                        >−</button>
                        <span className="px-2 text-sm font-bold" style={{ color: 'var(--fg)' }}>{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="px-3 py-1 hover:bg-red-600/10 transition-colors font-bold"
                          style={{ color: 'var(--fg)' }}
                        >+</button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.cartId)}
                        className="p-1.5 rounded-lg hover:bg-red-600/10 transition-colors text-red-600"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="px-6 py-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-lg" style={{ color: 'var(--fg)' }}>Total</span>
              <span className="text-red-600 font-black text-2xl">₹{getCartTotal().toLocaleString()}</span>
            </div>
            {getCartTotal() < 999 && (
              <p className="text-xs text-center mb-3" style={{ color: 'var(--muted)' }}>
                Add ₹{999 - getCartTotal()} more for free shipping!
              </p>
            )}
            <Link
              href="/checkout"
              onClick={() => setIsCartOpen(false)}
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl text-center transition-colors shadow-lg shadow-red-600/25"
            >
              Checkout ☠️
            </Link>
          </div>
        )}
      </div>
    </>
  );
}