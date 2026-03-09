import Link from 'next/link';
import { useCart } from '../context/CartContext';
import Skull from './Skull';

const CartSidebar = () => {
  const { cartItems, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, getCartTotal } = useCart();
  
  if (!isCartOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50" onClick={() => setIsCartOpen(false)} />
      <div className="fixed right-0 top-0 h-full w-full max-w-md z-50 shadow-2xl flex flex-col"
        style={{ background: 'var(--bg)', borderLeft: '1px solid var(--border)' }}>
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: 'var(--fg)' }}>
            <Skull className="w-6 h-6 text-red-600" />
            Your Cart ({cartItems.length})
          </h2>
          <button onClick={() => setIsCartOpen(false)} className="p-2 rounded-lg hover:bg-red-50 dark:hover:bg-white/5 transition-colors" style={{ color: 'var(--fg)' }}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12"/></svg>
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto p-4">
          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"/></svg>
              <p style={{ color: 'var(--muted)' }} className="mb-3">Your cart is empty</p>
              <button onClick={() => setIsCartOpen(false)} className="text-red-600 font-medium hover:underline">Continue Shopping</button>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map(item => (
                <div key={item.cartId} className="flex gap-3 rounded-xl p-3 border" style={{ background: 'var(--bg-2)', borderColor: 'var(--border)' }}>
                  <img src={item.image} alt={item.name} className="w-20 h-24 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h3 className="font-medium text-sm" style={{ color: 'var(--fg)' }}>{item.name}</h3>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Size: {item.size}</p>
                    <div className="flex items-center gap-2 mt-1">
                      {item.salePrice ? (
                        <><span className="text-red-600 font-bold">₹{item.salePrice}</span><span className="line-through text-xs" style={{ color: 'var(--muted)' }}>₹{item.price}</span></>
                      ) : (
                        <span className="font-bold" style={{ color: 'var(--fg)' }}>₹{item.price}</span>
                      )}
                    </div>
                    <div className="flex items-center justify-between mt-2">
                      <div className="flex items-center gap-2">
                        <button onClick={() => updateQuantity(item.cartId, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ background: 'var(--bg-3)', color: 'var(--fg)' }}>-</button>
                        <span className="w-6 text-center font-medium" style={{ color: 'var(--fg)' }}>{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.cartId, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold transition-colors"
                          style={{ background: 'var(--bg-3)', color: 'var(--fg)' }}>+</button>
                      </div>
                      <button onClick={() => removeFromCart(item.cartId)} className="text-red-600 text-sm hover:underline">Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {cartItems.length > 0 && (
          <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
            <div className="flex justify-between items-center mb-3">
              <span style={{ color: 'var(--muted)' }}>Subtotal</span>
              <span className="text-2xl font-bold" style={{ color: 'var(--fg)' }}>₹{getCartTotal().toLocaleString()}</span>
            </div>
            <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Shipping calculated at checkout</p>
            <Link href="/checkout" onClick={() => setIsCartOpen(false)}
              className="block w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-xl text-center transition-colors">
              Proceed to Checkout
            </Link>
            <button onClick={() => setIsCartOpen(false)} className="block w-full font-medium py-3 text-center transition-colors hover:text-red-600" style={{ color: 'var(--muted)' }}>
              Continue Shopping
            </button>
          </div>
        )}
      </div>
    </>
  );
};

export default CartSidebar;