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
  const { orders } = useOrders();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    if (orderId && orders.length) {
      const found = orders.find((o) => o.id === orderId);
      setOrder(found);
    }
  }, [orderId, orders]);

  if (!order) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const isPaid = order.paymentStatus === 'paid';
  const isAwaitingPayment = order.paymentStatus === 'awaiting_payment';
  const isCOD = order.paymentMethod === 'cod';
  const isRazorpay = order.paymentMethod === 'razorpay';
  const isBankTransfer = order.paymentMethod === 'bank_transfer';

  return (
    <>
      <SEO title="Order Confirmed" />
      <div className="min-h-screen pt-20 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-4 py-8">
          {/* Success Animation */}
          <div className="text-center mb-8">
            <div className={`w-20 h-20 ${isPaid ? 'bg-green-600' : isAwaitingPayment ? 'bg-yellow-600' : 'bg-blue-600'} rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce`}>
              {isPaid || isCOD ? (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h1 className="text-3xl md:text-4xl font-black mb-2" style={{ color: 'var(--fg)' }}>
              {isPaid ? 'Payment Successful! 🎉' : 'Order Placed! 🎉'}
            </h1>
            <p className="text-lg" style={{ color: 'var(--muted)' }}>
              {isPaid && 'Payment confirmed. Your order will be shipped soon.'}
              {isCOD && 'Thank you! Pay when you receive your order.'}
              {isAwaitingPayment && 'Complete payment to start processing your order.'}
            </p>
          </div>

          {/* Order Details */}
          <div className="rounded-2xl p-6 border mb-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between mb-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
              <div>
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Order ID</p>
                <p className="text-xl font-bold" style={{ color: 'var(--fg)' }}>#{order.id}</p>
              </div>
              <div className="text-right">
                <p className="text-sm" style={{ color: 'var(--muted)' }}>Total Amount</p>
                <p className="text-2xl font-bold text-red-600">₹{order.total?.toLocaleString()}</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>Delivery Address</p>
                <p className="text-sm" style={{ color: 'var(--fg)' }}>
                  {order.customer?.name}<br />
                  {order.customer?.phone}<br />
                  {order.customer?.address}, {order.customer?.city} {order.customer?.state} {order.customer?.pincode}
                </p>
              </div>

              <div>
                <p className="text-sm font-medium mb-1" style={{ color: 'var(--muted)' }}>Payment Method</p>
                <p style={{ color: 'var(--fg)' }}>
                  {isCOD && '💵 Cash on Delivery'}
                  {isRazorpay && '💳 Razorpay (Paid)'}
                  {isBankTransfer && '🏦 Bank Transfer / UPI'}
                </p>
                <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>
                  Status: <span className={isPaid ? 'text-green-600' : isAwaitingPayment ? 'text-yellow-600' : 'text-blue-600'} style={{ fontWeight: 'bold' }}>
                    {order.paymentStatus === 'paid' ? 'Paid' : order.paymentStatus === 'awaiting_payment' ? 'Awaiting Payment' : 'Pending'}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Payment Instructions for Bank Transfer */}
          {isBankTransfer && isAwaitingPayment && (
            <div className="rounded-2xl p-6 border mb-6 border-yellow-600" style={{ background: 'var(--bg-3)' }}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                <span>💳</span> Complete Your Payment
              </h2>

              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Pay using UPI:</p>
                  <div className="p-4 rounded-xl" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <p className="font-mono text-lg font-bold" style={{ color: 'var(--fg)' }}>wrongman@paytm</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Use this UPI ID on Google Pay, PhonePe, Paytm</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--muted)' }}>Or Bank Transfer:</p>
                  <div className="p-4 rounded-xl space-y-1" style={{ background: 'var(--card)', border: '1px solid var(--border)' }}>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>Bank:</span>
                      <span className="font-medium" style={{ color: 'var(--fg)' }}>HDFC Bank</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>Account:</span>
                      <span className="font-mono font-medium" style={{ color: 'var(--fg)' }}>50200012345678</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>IFSC:</span>
                      <span className="font-mono font-medium" style={{ color: 'var(--fg)' }}>HDFC0001234</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span style={{ color: 'var(--muted)' }}>Name:</span>
                      <span className="font-medium" style={{ color: 'var(--fg)' }}>WrongMan Store</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 rounded-xl border-l-4 border-yellow-600" style={{ background: 'var(--bg)' }}>
                  <p className="text-sm font-medium mb-2" style={{ color: 'var(--fg)' }}>⚠️ Important:</p>
                  <ul className="text-sm space-y-1" style={{ color: 'var(--muted)' }}>
                    <li>• Send exactly ₹{order.total?.toLocaleString()}</li>
                    <li>• Use reference: <strong>#{order.id}</strong></li>
                    <li>• After payment, send screenshot via WhatsApp</li>
                    <li>• Order ships after confirmation (within 24 hours)</li>
                  </ul>
                </div>

                <a
                  href={`https://wa.me/917247349219?text=Payment%20done%20for%20Order%20${order.id}%0AAmount:%20₹${order.total}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-xl text-center transition-colors"
                >
                  📱 Send Payment Confirmation on WhatsApp
                </a>
              </div>
            </div>
          )}

          {/* COD Info */}
          {isCOD && (
            <div className="rounded-2xl p-6 border mb-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-2xl">💵</span>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--fg)' }}>Cash on Delivery</h3>
                  <p className="text-sm" style={{ color: 'var(--muted)' }}>
                    Pay ₹{order.total?.toLocaleString()} in cash when you receive your order. Keep exact change ready.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Razorpay Success */}
          {isRazorpay && isPaid && (
            <div className="rounded-2xl p-6 border mb-6 border-green-600" style={{ background: 'var(--bg-3)' }}>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-bold mb-1" style={{ color: 'var(--fg)' }}>Payment Confirmed</h3>
                  <p className="text-sm mb-2" style={{ color: 'var(--muted)' }}>
                    Your payment via Razorpay was successful. Your order will be shipped within 24-48 hours.
                  </p>
                  <p className="text-xs font-mono" style={{ color: 'var(--muted)' }}>
                    Payment ID: {order.razorpayPaymentId}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Order Items */}
          <div className="rounded-2xl p-6 border mb-6" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
            <h3 className="font-bold mb-4" style={{ color: 'var(--fg)' }}>Order Items</h3>
            <div className="space-y-3">
              {order.items?.map((item, i) => (
                <div key={i} className="flex gap-3">
                  <img src={item.image} alt={item.name} className="w-16 h-20 object-cover rounded-lg" />
                  <div className="flex-1">
                    <h4 className="font-medium text-sm" style={{ color: 'var(--fg)' }}>{item.name}</h4>
                    <p className="text-xs" style={{ color: 'var(--muted)' }}>Size: {item.size} × {item.quantity}</p>
                    <p className="text-red-600 font-bold">₹{((item.salePrice || item.price) * item.quantity).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="grid md:grid-cols-2 gap-4">
            <Link href="/shop"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--fg)', border: '1px solid var(--border)' }}>
              Continue Shopping
            </Link>
            <Link href="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-red-600 text-white hover:bg-red-700 transition-colors">
              <Skull className="w-5 h-5" />
              Back to Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}