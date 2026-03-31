// pages/order-success.js
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { useOrders } from '../context/OrderContext';
import Skull from '../components/Skull';
import SEO from '../components/SEO';

export default function OrderSuccess() {
  const router = useRouter();
  const { orderId } = router.query;
  const { getOrderById } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId) {
      const found = getOrderById(orderId);
      if (found) setOrder(found);
    }
  }, [orderId]);

  return (
    <>
      <SEO title="Order Successful" />
      <div className="min-h-screen pt-20 flex items-center justify-center px-4 skull-pattern" style={{ background: 'var(--bg)' }}>
        <div className="max-w-lg w-full text-center">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-green-600/30">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="flex items-center justify-center gap-2 mb-4">
            <Skull className="w-8 h-8 text-red-600 skull-glow" />
          </div>

          <h1 className="text-4xl md:text-5xl font-black mb-3" style={{ color: 'var(--fg)' }}>
            ORDER <span className="text-green-600">PLACED!</span>
          </h1>

          <p className="text-lg mb-2" style={{ color: 'var(--muted)' }}>
            Thank you for your order ☠️
          </p>

          {orderId && (
            <p className="text-sm mb-8 font-mono px-4 py-2 rounded-lg inline-block" style={{ background: 'var(--bg-3)', color: 'var(--muted)' }}>
              Order ID: <span style={{ color: 'var(--fg)' }}>{orderId}</span>
            </p>
          )}

          {/* Order Details */}
          {order && (
            <div className="rounded-2xl p-6 border mb-8 text-left" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <h2 className="font-bold text-lg mb-4" style={{ color: 'var(--fg)' }}>Order Summary</h2>

              <div className="space-y-2 mb-4">
                {order.items?.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span style={{ color: 'var(--muted)' }}>{item.name} ({item.size}) x{item.quantity}</span>
                    <span style={{ color: 'var(--fg)' }}>₹{((item.salePrice || item.price) * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3 space-y-1" style={{ borderColor: 'var(--border)' }}>
                <div className="flex justify-between text-sm">
                  <span style={{ color: 'var(--muted)' }}>Shipping</span>
                  <span style={{ color: order.shipping === 0 ? 'var(--green)' : 'var(--fg)' }}>
                    {order.shipping === 0 ? 'FREE' : `₹${order.shipping}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-1">
                  <span style={{ color: 'var(--fg)' }}>Total</span>
                  <span className="text-red-600">₹{order.total?.toLocaleString()}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t" style={{ borderColor: 'var(--border)' }}>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>
                  <span className="font-medium" style={{ color: 'var(--fg)' }}>Delivering to: </span>
                  {order.customer?.name} — {order.customer?.address}, {order.customer?.city} {order.customer?.pincode}
                </p>
                <p className="text-sm mt-1" style={{ color: 'var(--muted)' }}>
                  <span className="font-medium" style={{ color: 'var(--fg)' }}>Payment: </span>
                  {order.paymentMethod === 'cod' ? 'Cash on Delivery' : order.paymentMethod === 'razorpay' ? 'Paid Online' : 'Bank Transfer'}
                </p>
              </div>
            </div>
          )}

          {/* What's Next */}
          <div className="rounded-2xl p-6 border mb-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--fg)' }}>What happens next?</h3>
            <div className="space-y-3 text-sm text-left">
              {[
                { icon: '📧', text: 'You will receive an order confirmation shortly' },
                { icon: '📦', text: 'Your order will be packed within 24 hours' },
                { icon: '🚚', text: 'Delivery in 3-5 business days' },
                { icon: '☠️', text: 'Enjoy your WrongMan gear!' },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-3">
                  <span className="text-lg">{s.icon}</span>
                  <p style={{ color: 'var(--muted)' }}>{s.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/shop" className="bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-colors inline-flex items-center justify-center gap-2">
              <Skull className="w-5 h-5" />
              Continue Shopping
            </Link>
            <Link href="/" className="font-bold px-8 py-3 rounded-xl transition-colors border-2 border-red-600 text-red-600 hover:bg-red-600 hover:text-white inline-flex items-center justify-center">
              Go Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}