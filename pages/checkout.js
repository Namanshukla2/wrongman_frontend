// pages/checkout.js
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import Script from 'next/script';
import { useCart } from '../context/CartContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';
import SEO from '../components/SEO';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const RAZORPAY_KEY = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID;

export default function Checkout() {
  const { cartItems, getCartTotal, clearCart } = useCart();
  const { createOrder } = useOrders();
  const { user } = useAuth();
  const router = useRouter();

  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    paymentMethod: 'cod',
  });
  const [busy, setBusy] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [razorpayAvailable, setRazorpayAvailable] = useState(false);

  const set = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const shipping = getCartTotal() >= 999 ? 0 : 99;
  const total = getCartTotal() + shipping;

  const inputStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--fg)',
  };

  // Check if Razorpay is configured
  useEffect(() => {
    const checkRazorpay = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/payment/status`);
        const data = await res.json();
        setRazorpayAvailable(data.razorpayAvailable && !!RAZORPAY_KEY);
      } catch (err) {
        console.error('Failed to check Razorpay status:', err);
      }
    };
    checkRazorpay();
  }, []);

  // Handle COD orders
  const handleCODOrder = async () => {
    const orderData = {
      customer: form,
      userId: user?._id || user?.id,
      items: cartItems,
      subtotal: getCartTotal(),
      shipping,
      total,
      paymentMethod: 'cod',
      paymentStatus: 'pending',
      status: 'pending',
    };

    const order = await createOrder(orderData);
    clearCart();
    toast.success('Order placed successfully!');
    router.push(`/order-success?orderId=${order.id}`);
  };

  // Handle Bank Transfer orders
  const handleBankTransferOrder = async () => {
    const orderData = {
      customer: form,
      userId: user?._id || user?.id,
      items: cartItems,
      subtotal: getCartTotal(),
      shipping,
      total,
      paymentMethod: 'bank_transfer',
      paymentStatus: 'awaiting_payment',
      status: 'pending',
    };

    const order = await createOrder(orderData);
    clearCart();
    toast.success('Order placed! Complete payment to ship.');
    router.push(`/order-success?orderId=${order.id}`);
  };

  // Handle Razorpay payment
  const handleRazorpayPayment = async () => {
    if (!razorpayLoaded) {
      toast.error('Payment gateway loading... Please wait');
      return;
    }

    try {
      // Create Razorpay order
      const orderRes = await fetch(`${API_BASE}/api/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'INR',
          receipt: `order_${Date.now()}`,
        }),
      });

      if (!orderRes.ok) throw new Error('Failed to create payment order');

      const razorpayOrder = await orderRes.json();

      // Open Razorpay checkout
      const options = {
        key: RAZORPAY_KEY,
        amount: razorpayOrder.amount,
        currency: razorpayOrder.currency,
        name: 'WrongMan Store',
        description: 'Order Payment',
        image: '/skull.svg',
        order_id: razorpayOrder.id,
        prefill: {
          name: form.name,
          email: form.email,
          contact: form.phone,
        },
        theme: {
          color: '#dc2626',
        },
        handler: async function (response) {
          // Verify payment
          const verifyRes = await fetch(`${API_BASE}/api/payment/verify-payment`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            // Create order in database
            const orderData = {
              customer: form,
              userId: user?._id || user?.id,
              items: cartItems,
              subtotal: getCartTotal(),
              shipping,
              total,
              paymentMethod: 'razorpay',
              paymentStatus: 'paid',
              status: 'confirmed',
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            };

            const order = await createOrder(orderData);
            clearCart();
            toast.success('Payment successful!');
            router.push(`/order-success?orderId=${order.id}`);
          } else {
            toast.error('Payment verification failed');
            setBusy(false);
          }
        },
        modal: {
          ondismiss: function () {
            setBusy(false);
            toast.error('Payment cancelled');
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      console.error('Razorpay error:', err);
      toast.error('Payment failed. Please try again.');
      throw err;
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.phone || !form.address || !form.city || !form.pincode) {
      toast.error('Fill all required fields');
      return;
    }

    if (!/^\d{10}$/.test(form.phone)) {
      toast.error('Enter valid 10-digit phone');
      return;
    }

    if (!/^\d{6}$/.test(form.pincode)) {
      toast.error('Enter valid 6-digit PIN code');
      return;
    }

    setBusy(true);

    try {
      if (form.paymentMethod === 'cod') {
        await handleCODOrder();
      } else if (form.paymentMethod === 'bank_transfer') {
        await handleBankTransferOrder();
      } else if (form.paymentMethod === 'razorpay') {
        await handleRazorpayPayment();
      }
    } catch (err) {
      console.error('Checkout error:', err);
      setBusy(false);
    }
  };

  if (!cartItems.length) {
    return (
      <>
        <SEO title="Checkout" />
        <div className="min-h-screen pt-20 flex items-center justify-center" style={{ background: 'var(--bg)' }}>
          <div className="text-center">
            <Skull className="w-20 h-20 mx-auto mb-4" style={{ color: 'var(--border)' }} />
            <h2 className="text-2xl font-bold mb-2" style={{ color: 'var(--fg)' }}>
              Cart is empty
            </h2>
            <p className="mb-4" style={{ color: 'var(--muted)' }}>
              Add some items to your cart before checkout
            </p>
            <Link href="/shop" className="inline-block bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-colors">
              Shop Now
            </Link>
          </div>
        </div>
      </>
    );
  }

  // Payment options based on availability
  const paymentOptions = [
    {
      id: 'cod',
      name: '💵 Cash on Delivery',
      desc: 'Pay when you receive your order',
      available: true,
    },
    {
      id: 'razorpay',
      name: '💳 Pay Online (Card/UPI/Wallet)',
      desc: 'Instant payment via Razorpay - Safe & Secure',
      available: razorpayAvailable,
      badge: 'Instant',
    },
    {
      id: 'bank_transfer',
      name: '🏦 Bank Transfer / UPI',
      desc: 'Manual payment via UPI or Bank Transfer',
      available: true,
    },
  ].filter((opt) => opt.available);

  return (
    <>
      <SEO title="Checkout" description="Complete your order at Wrong Man." />

      {/* Load Razorpay SDK if available */}
      {razorpayAvailable && (
        <Script
          src="https://checkout.razorpay.com/v1/checkout.js"
          onLoad={() => setRazorpayLoaded(true)}
          onError={() => {
            console.error('Razorpay script failed to load');
            setRazorpayAvailable(false);
          }}
        />
      )}

      <div className="min-h-screen pt-20 skull-pattern" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-3 mb-8">
            <Skull className="w-8 h-8 text-red-600 skull-glow" />
            <h1 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--fg)' }}>
              CHECKOUT <span className="text-red-600">☠️</span>
            </h1>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <form onSubmit={submit} className="space-y-6">
                {/* Contact Information */}
                <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                    <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">1</span>
                    Contact Information
                  </h2>
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>
                        Full Name <span className="text-red-600">*</span>
                      </label>
                      <input name="name" value={form.name} onChange={set} required placeholder="John Doe" style={inputStyle}
                        className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                    </div>
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>
                        Phone Number <span className="text-red-600">*</span>
                      </label>
                      <input name="phone" value={form.phone} onChange={set} required placeholder="9876543210" maxLength={10} style={inputStyle}
                        className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>
                        Email (optional)
                      </label>
                      <input name="email" type="email" value={form.email} onChange={set} placeholder="you@example.com" style={inputStyle}
                        className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                    <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">2</span>
                    Shipping Address
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>
                        Street Address <span className="text-red-600">*</span>
                      </label>
                      <textarea name="address" value={form.address} onChange={set} required rows={2} placeholder="House no., Building name, Street"
                        style={inputStyle} className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                    </div>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>City <span className="text-red-600">*</span></label>
                        <input name="city" value={form.city} onChange={set} required placeholder="Delhi" style={inputStyle}
                          className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>State</label>
                        <input name="state" value={form.state} onChange={set} placeholder="Delhi" style={inputStyle}
                          className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1.5" style={{ color: 'var(--muted)' }}>PIN Code <span className="text-red-600">*</span></label>
                        <input name="pincode" value={form.pincode} onChange={set} required placeholder="110001" maxLength={6} style={inputStyle}
                          className="w-full rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Payment Method */}
                <div className="rounded-2xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="text-xl font-bold mb-4 flex items-center gap-2" style={{ color: 'var(--fg)' }}>
                    <span className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center text-white text-sm">3</span>
                    Payment Method
                  </h2>

                  {paymentOptions.map((m) => (
                    <label key={m.id}
                      className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer mb-3 border transition-all ${
                        form.paymentMethod === m.id ? 'border-red-600 bg-red-600/5' : ''
                      }`}
                      style={form.paymentMethod !== m.id ? { borderColor: 'var(--border)', background: 'var(--bg-3)' } : {}}>
                      <input type="radio" name="paymentMethod" value={m.id} checked={form.paymentMethod === m.id} onChange={set}
                        className="w-5 h-5 accent-red-600" />
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium" style={{ color: 'var(--fg)' }}>{m.name}</span>
                          {m.badge && (
                            <span className="text-xs bg-green-600 text-white px-2 py-0.5 rounded-full font-bold">
                              {m.badge}
                            </span>
                          )}
                        </div>
                        <div className="text-sm" style={{ color: 'var(--muted)' }}>{m.desc}</div>
                      </div>
                    </label>
                  ))}

                  {/* Payment info notices */}
                  {form.paymentMethod === 'bank_transfer' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-yellow-600" style={{ background: 'var(--bg-3)' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                        ℹ️ Manual Payment Process
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        You'll receive payment details after placing order. Order ships after payment confirmation (usually within 24 hours).
                      </p>
                    </div>
                  )}

                  {form.paymentMethod === 'razorpay' && (
                    <div className="mt-4 p-4 rounded-xl border-l-4 border-green-600" style={{ background: 'var(--bg-3)' }}>
                      <p className="text-sm font-medium mb-1" style={{ color: 'var(--fg)' }}>
                        🔒 Secure Payment by Razorpay
                      </p>
                      <p className="text-xs" style={{ color: 'var(--muted)' }}>
                        Instant payment confirmation. Order will be processed immediately.
                      </p>
                    </div>
                  )}
                </div>

                <button type="submit" disabled={busy}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl text-lg transition-colors flex items-center justify-center gap-2 shadow-lg shadow-red-600/25">
                  {busy ? (
                    <>
                      <svg className="animate-spin w-6 h-6" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      <Skull className="w-6 h-6 text-white" />
                      {form.paymentMethod === 'razorpay' ? 'Proceed to Payment' : 'Place Order'} ☠️
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Order Summary */}
            <div>
              <div className="rounded-2xl p-6 border sticky top-24" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                <h2 className="text-xl font-bold mb-4" style={{ color: 'var(--fg)' }}>Order Summary</h2>
                <div className="space-y-3 mb-6 max-h-60 overflow-y-auto">
                  {cartItems.map((it) => (
                    <div key={it.cartId} className="flex gap-3">
                      <img src={it.image} alt={it.name} className="w-16 h-20 object-cover rounded-lg" />
                      <div className="flex-1">
                        <h3 className="text-sm font-medium line-clamp-1" style={{ color: 'var(--fg)' }}>{it.name}</h3>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>Size: {it.size} × {it.quantity}</p>
                        <p className="text-red-600 font-bold">₹{((it.salePrice || it.price) * it.quantity).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="border-t pt-4 space-y-2" style={{ borderColor: 'var(--border)' }}>
                  <div className="flex justify-between" style={{ color: 'var(--muted)' }}>
                    <span>Subtotal</span>
                    <span>₹{getCartTotal().toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between" style={{ color: 'var(--muted)' }}>
                    <span>Shipping</span>
                    <span>{shipping === 0 ? <span className="text-green-600 font-bold">FREE</span> : `₹${shipping}`}</span>
                  </div>
                  {shipping === 0 && <p className="text-xs text-green-600">🎉 Free shipping on orders above ₹999</p>}
                  <div className="flex justify-between font-bold text-xl pt-2 border-t" style={{ color: 'var(--fg)', borderColor: 'var(--border)' }}>
                    <span>Total</span>
                    <span className="text-red-600">₹{total.toLocaleString()}</span>
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

// Server-side auth check
export async function getServerSideProps({ req }) {
  const token = req.cookies?.token;
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.warn('⚠️ JWT_SECRET not configured');
    return { props: {} };
  }

  if (!token) {
    return {
      redirect: {
        destination: '/login?next=/checkout',
        permanent: false,
      },
    };
  }

  try {
    jwt.verify(token, secret);
    return { props: {} };
  } catch (err) {
    return {
      redirect: {
        destination: '/login?next=/checkout',
        permanent: false,
      },
    };
  }
}