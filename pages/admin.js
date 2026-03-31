// pages/admin.js
import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useProducts } from '../context/ProductContext';
import { useOrders } from '../context/OrderContext';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import Skull from '../components/Skull';
import SEO from '../components/SEO';

export default function Admin() {
  const { products, addProduct, updateProduct, deleteProduct, resetToDefault } = useProducts();
  const { orders, updateOrderStatus } = useOrders();
  const { user, loading } = useAuth();
  const router = useRouter();

  const [tab, setTab] = useState('products');
  const [adding, setAdding] = useState(false);
  const [editing, setEditing] = useState(null);
  const [uploading, setUploading] = useState(false);

  // Client-side auth guard - no more getServerSideProps cookie issues
  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/login?next=/admin');
      } else if (user.role !== 'admin') {
        router.replace('/');
      }
    }
  }, [user, loading]);

  const blank = {
    name: '',
    brand: '',
    category: 'tshirts',
    subCategory: '',
    price: '',
    salePrice: '',
    image: '',
    images: '',
    description: '',
    sizes: 'S, M, L, XL',
    colors: 'Black, White',
    stock: '50',
    featured: false,
    cdnPublicIds: [],
  };
  const [form, setForm] = useState(blank);

  const cats = [
    { n: 'T-Shirts', s: 'tshirts' },
    { n: 'Pants', s: 'pants' },
    { n: 'Jackets', s: 'jackets' },
    { n: 'Shirts', s: 'shirts' },
    { n: 'Caps', s: 'caps' },
  ];

  const inputStyle = {
    background: 'var(--bg-3)',
    border: '1px solid var(--border)',
    color: 'var(--fg)',
  };

  const set = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
  };

  const reset = () => {
    setForm(blank);
    setAdding(false);
    setEditing(null);
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    setUploading(true);
    try {
      const formData = new FormData();
      files.forEach((f) => formData.append('files', f));
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
      const res = await fetch(`${API_BASE}/api/upload`, { method: 'POST', body: formData });
      if (!res.ok) throw new Error((await res.text()) || 'Upload failed');
      const data = await res.json();
      setForm((prev) => ({
        ...prev,
        image: data[0]?.url || prev.image,
        images: data.map((d) => d.url).join(', '),
        cdnPublicIds: data.map((d) => d.publicId),
      }));
      toast.success('Images uploaded to CDN!');
    } catch (err) {
      toast.error('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.price || !form.image) { toast.error('Fill required fields'); return; }
    const data = {
      name: form.name, brand: form.brand || null, category: form.category,
      subCategory: form.subCategory || '', price: +form.price,
      salePrice: form.salePrice ? +form.salePrice : null, image: form.image,
      images: form.images ? form.images.split(',').map((s) => s.trim()) : [form.image],
      description: form.description, sizes: form.sizes.split(',').map((s) => s.trim()),
      colors: form.colors.split(',').map((s) => s.trim()),
      stock: +form.stock || 50, featured: form.featured, cdnPublicIds: form.cdnPublicIds || [],
    };
    try {
      if (editing) { await updateProduct(editing.id, data); toast.success('Updated!'); }
      else { await addProduct(data); toast.success('Added!'); }
      reset();
    } catch (err) { toast.error('Failed to save product'); }
  };

  const edit = (p) => {
    setEditing(p);
    setForm({
      name: p.name, brand: p.brand || '', category: p.category,
      subCategory: p.subCategory || '', price: String(p.price),
      salePrice: p.salePrice ? String(p.salePrice) : '', image: p.image,
      images: p.images?.join(', ') || '', description: p.description || '',
      sizes: p.sizes?.join(', ') || '', colors: p.colors?.join(', ') || '',
      stock: String(p.stock ?? 50), featured: p.featured ?? false, cdnPublicIds: p.cdnPublicIds || [],
    });
    setAdding(true);
  };

  // Show loading while checking auth
  if (loading || !user || user.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg)' }}>
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full mx-auto mb-4"></div>
          <p style={{ color: 'var(--muted)' }}>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <SEO title="Admin Panel" />
      <div className="min-h-screen pt-20 skull-pattern" style={{ background: 'var(--bg)' }}>
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Skull className="w-8 h-8 text-red-600 skull-glow" />
                <div className="w-8 h-[2px] bg-red-600"></div>
              </div>
              <h1 className="text-3xl md:text-4xl font-black" style={{ color: 'var(--fg)' }}>
                ADMIN <span className="text-red-600">PANEL</span> ☠️
              </h1>
            </div>
            <button onClick={() => { if (window.confirm('Reset all products?')) { resetToDefault(); toast.success('Reset!'); } }}
              className="px-4 py-2 rounded-lg text-sm transition-colors"
              style={{ background: 'var(--bg-3)', color: 'var(--muted)', border: '1px solid var(--border)' }}>
              Reset Products
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-8">
            {['products', 'orders'].map((t) => (
              <button key={t} onClick={() => setTab(t)}
                className={`px-6 py-3 rounded-xl font-medium capitalize transition-all ${tab === t ? 'bg-red-600 text-white shadow-lg shadow-red-600/25' : ''}`}
                style={tab !== t ? { background: 'var(--bg-3)', color: 'var(--fg-2)' } : {}}>
                {t} ({t === 'products' ? products.length : orders.length})
              </button>
            ))}
          </div>

          {/* Products Tab */}
          {tab === 'products' && (
            <div>
              {adding ? (
                <div className="rounded-2xl p-6 border mb-8" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                  <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--fg)' }}>{editing ? 'Edit' : 'Add'} Product</h2>
                  <form onSubmit={submit} className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Name *</label>
                        <input name="name" value={form.name} onChange={set} required style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Brand</label>
                        <input name="brand" value={form.brand} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Subcategory</label>
                        <input name="subCategory" value={form.subCategory} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" placeholder="e.g. Oversized, Baggy" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Category</label>
                        <select name="category" value={form.category} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none">
                          {cats.map((c) => (<option key={c.s} value={c.s}>{c.n}</option>))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Price ₹ *</label>
                        <input type="number" name="price" value={form.price} onChange={set} required style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Sale Price ₹</label>
                        <input type="number" name="salePrice" value={form.salePrice} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Stock</label>
                        <input type="number" name="stock" value={form.stock} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Upload Images (Cloudinary)</label>
                        <input type="file" multiple accept="image/*" onChange={handleImageUpload} className="w-full text-sm" />
                        {uploading && <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Uploading...</p>}
                        <p className="text-xs mt-1" style={{ color: 'var(--muted)' }}>Or paste image URLs manually below.</p>
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Main Image URL *</label>
                        <input name="image" value={form.image} onChange={set} required style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Extra Images (comma separated URLs)</label>
                        <input name="images" value={form.images} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Description</label>
                        <textarea name="description" value={form.description} onChange={set} rows={2} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-red-500/40" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Sizes (comma sep.)</label>
                        <input name="sizes" value={form.sizes} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none" />
                      </div>
                      <div>
                        <label className="block text-sm mb-1" style={{ color: 'var(--muted)' }}>Colors (comma sep.)</label>
                        <input name="colors" value={form.colors} onChange={set} style={inputStyle} className="w-full rounded-xl px-4 py-2 focus:outline-none" />
                      </div>
                      <div className="flex items-center">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input type="checkbox" name="featured" checked={form.featured} onChange={set} className="w-5 h-5 accent-red-600" />
                          <span style={{ color: 'var(--fg)' }}>Featured</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-2">
                      <button type="submit" className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl">{editing ? 'Update' : 'Add'} Product</button>
                      <button type="button" onClick={reset} className="px-6 py-3 rounded-xl font-bold" style={{ background: 'var(--bg-3)', color: 'var(--fg-2)' }}>Cancel</button>
                    </div>
                  </form>
                </div>
              ) : (
                <button onClick={() => setAdding(true)} className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl mb-8 flex items-center gap-2">+ Add Product</button>
              )}

              <div className="grid gap-4">
                {products.map((p) => (
                  <div key={p.id} className="rounded-xl p-4 border flex flex-col md:flex-row gap-4" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                    <img src={p.image} alt={p.name} className="w-24 h-28 object-cover rounded-lg" />
                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <h3 className="font-bold" style={{ color: 'var(--fg)' }}>{p.name}</h3>
                        {p.brand && <span className="text-xs bg-red-600/10 text-red-600 px-2 py-0.5 rounded">{p.brand}</span>}
                        {p.featured && <span className="text-xs bg-yellow-500/20 text-yellow-600 px-2 py-0.5 rounded">Featured</span>}
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {p.salePrice ? (<><span className="text-red-600 font-bold">₹{p.salePrice}</span><span className="line-through" style={{ color: 'var(--muted)' }}>₹{p.price}</span></>) : (<span className="font-bold" style={{ color: 'var(--fg)' }}>₹{p.price}</span>)}
                        <span style={{ color: 'var(--border)' }}>|</span>
                        <span style={{ color: 'var(--muted)' }}>Stock: {p.stock}</span>
                      </div>
                    </div>
                    <div className="flex md:flex-col gap-2">
                      <button onClick={() => edit(p)} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium" style={{ background: 'var(--bg-3)', color: 'var(--fg-2)' }}>Edit</button>
                      <button onClick={() => { if (window.confirm('Delete?')) { deleteProduct(p.id); toast.success('Deleted!'); } }} className="flex-1 px-4 py-2 rounded-lg text-sm font-medium bg-red-600/10 text-red-600 hover:bg-red-600/20">Delete</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Orders Tab */}
          {tab === 'orders' && (
            <div>
              {!orders.length ? (
                <div className="text-center py-12">
                  <Skull className="w-16 h-16 mx-auto mb-4" style={{ color: 'var(--border)' }} />
                  <p style={{ color: 'var(--muted)' }}>No orders yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((o) => (
                    <div key={o.id} className="rounded-xl p-6 border" style={{ background: 'var(--card)', borderColor: 'var(--border)' }}>
                      <div className="flex flex-col md:flex-row justify-between gap-4 mb-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-bold" style={{ color: 'var(--fg)' }}>#{o.id}</h3>
                            <span className={`text-xs px-2 py-0.5 rounded text-white capitalize ${o.status === 'pending' ? 'bg-yellow-600' : o.status === 'confirmed' ? 'bg-blue-600' : o.status === 'shipped' ? 'bg-purple-600' : o.status === 'delivered' ? 'bg-green-600' : 'bg-red-600'}`}>{o.status}</span>
                          </div>
                          <p className="text-sm" style={{ color: 'var(--muted)' }}>{new Date(o.createdAt).toLocaleString()}</p>
                        </div>
                        <select value={o.status} onChange={(e) => { updateOrderStatus(o.id, e.target.value); toast.success('Updated!'); }} style={inputStyle} className="rounded-lg px-3 py-1 text-sm focus:outline-none">
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </div>
                      <div className="grid md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <span className="text-sm" style={{ color: 'var(--muted)' }}>Customer</span>
                          <p style={{ color: 'var(--fg)' }}>{o.customer?.name} – {o.customer?.phone}</p>
                        </div>
                        <div>
                          <span className="text-sm" style={{ color: 'var(--muted)' }}>Address</span>
                          <p className="text-sm" style={{ color: 'var(--fg-2)' }}>{o.customer?.address}, {o.customer?.city} {o.customer?.pincode}</p>
                        </div>
                      </div>
                      <div className="border-t pt-3" style={{ borderColor: 'var(--border)' }}>
                        {o.items?.map((it, i) => (
                          <div key={i} className="flex justify-between text-sm py-1">
                            <span style={{ color: 'var(--muted)' }}>{it.name} ({it.size}) x{it.quantity}</span>
                            <span style={{ color: 'var(--fg)' }}>₹{((it.salePrice || it.price) * it.quantity).toLocaleString()}</span>
                          </div>
                        ))}
                        <div className="flex justify-between mt-3 pt-2 border-t font-bold" style={{ borderColor: 'var(--border)' }}>
                          <span style={{ color: 'var(--fg)' }}>Total</span>
                          <span className="text-red-600 text-lg">₹{o.total?.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}