import { useEffect, useState } from 'react'
import { Routes, Route, NavLink, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuthStore } from '../../store'
import {
    getAdminDashboard, getProducts, createProduct, updateProduct, deleteProduct,
    getAdminOrders, updateOrderStatus, seedProducts, uploadImage
} from '../../lib/api'
import toast from 'react-hot-toast'

// ─── Dashboard ────────────────────────────────────────────────────────────────
function Dashboard() {
    const [stats, setStats] = useState(null)
    useEffect(() => {
        getAdminDashboard().then(r => setStats(r.data)).catch(() => { })
    }, [])

    const cards = stats ? [
        { label: 'Total Revenue', value: `₹${stats.total_revenue.toFixed(0)}`, icon: '💰', color: 'bg-primary-50 text-primary-700' },
        { label: 'Total Orders', value: stats.total_orders, icon: '📦', color: 'bg-sage-50 text-sage-700' },
        { label: 'Products', value: stats.total_products, icon: '🌿', color: 'bg-beige-50 text-beige-700' },
        { label: 'Pending Orders', value: stats.pending_orders, icon: '⏳', color: 'bg-amber-50 text-amber-700' },
    ] : []

    return (
        <div>
            <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-6">Dashboard</h2>
            {stats ? (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {cards.map(c => (
                        <div key={c.label} className={`rounded-2xl p-5 ${c.color}`}>
                            <div className="text-3xl mb-2">{c.icon}</div>
                            <p className="text-2xl font-bold">{c.value}</p>
                            <p className="text-sm opacity-70">{c.label}</p>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                    {[...Array(4)].map((_, i) => <div key={i} className="h-28 rounded-2xl bg-beige-100 animate-pulse" />)}
                </div>
            )}
            <div className="bg-beige-50 rounded-2xl p-6">
                <p className="font-serif font-semibold text-stone-700 mb-2">Quick Actions</p>
                <div className="flex flex-wrap gap-3">
                    <NavLink to="/admin/products" className="btn-primary text-sm">Manage Products</NavLink>
                    <NavLink to="/admin/orders" className="btn-secondary text-sm">View Orders</NavLink>
                    <button onClick={() => seedProducts().then(() => toast.success('Sample products seeded!')).catch(() => toast.error('Seed failed'))} className="btn-ghost text-sm border border-beige-300">
                        Seed Sample Products
                    </button>
                </div>
            </div>
        </div>
    )
}

// ─── Products Admin ───────────────────────────────────────────────────────────
function ProductsAdmin() {
    const [products, setProducts] = useState([])
    const [showForm, setShowForm] = useState(false)
    const [editing, setEditing] = useState(null)
    const [uploadingImg, setUploadingImg] = useState(false)
    const [form, setForm] = useState({
        name: '', description: '', price: '', original_price: '', stock: '',
        category: '', ingredients: '', benefits: '', is_featured: false, image_url: ''
    })

    const loadProducts = () => getProducts().then(r => setProducts(r.data.products)).catch(() => { })
    useEffect(() => { loadProducts() }, [])

    const resetForm = () => {
        setForm({ name: '', description: '', price: '', original_price: '', stock: '', category: '', ingredients: '', benefits: '', is_featured: false, image_url: '' })
        setEditing(null)
        setShowForm(false)
    }

    const editProduct = (p) => {
        setForm({ ...p, price: String(p.price), original_price: p.original_price ? String(p.original_price) : '', stock: String(p.stock) })
        setEditing(p.id)
        setShowForm(true)
    }

    const handleImageUpload = async (e) => {
        const file = e.target.files[0]
        if (!file) return
        setUploadingImg(true)
        try {
            const fd = new FormData()
            fd.append('file', file)
            const res = await uploadImage(fd)
            setForm(f => ({ ...f, image_url: res.data.url }))
            toast.success('Image uploaded!')
        } catch { toast.error('Image upload failed') }
        finally { setUploadingImg(false) }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        const payload = { ...form, price: parseFloat(form.price), original_price: form.original_price ? parseFloat(form.original_price) : null, stock: parseInt(form.stock) || 0 }
        try {
            if (editing) { await updateProduct(editing, payload); toast.success('Product updated!') }
            else { await createProduct(payload); toast.success('Product created!') }
            resetForm(); loadProducts()
        } catch (err) { toast.error(err.response?.data?.error || 'Failed to save product') }
    }

    const handleDelete = async (id, name) => {
        if (!confirm(`Delete "${name}"?`)) return
        try { await deleteProduct(id); toast.success('Deleted!'); loadProducts() }
        catch { toast.error('Delete failed') }
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-semibold text-stone-800">Products</h2>
                <button onClick={() => { resetForm(); setShowForm(!showForm) }} className="btn-primary text-sm">
                    {showForm ? 'Cancel' : '+ Add Product'}
                </button>
            </div>

            {/* Product Form */}
            {showForm && (
                <motion.form initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit}
                    className="bg-white rounded-2xl shadow-soft p-6 mb-6 grid grid-cols-1 sm:grid-cols-2 gap-4"
                >
                    <h3 className="sm:col-span-2 font-serif font-semibold text-stone-700">{editing ? 'Edit Product' : 'New Product'}</h3>
                    {[
                        ['name', 'Product Name *', 'text', 'Herbal Hair Oil'],
                        ['price', 'Price (₹) *', 'number', '449'],
                        ['original_price', 'Original Price (₹)', 'number', '599'],
                        ['stock', 'Stock Quantity', 'number', '100'],
                        ['category', 'Category *', 'text', 'Hair Oil'],
                    ].map(([key, label, type, placeholder]) => (
                        <div key={key}>
                            <label className="block text-sm font-medium text-stone-600 mb-1">{label}</label>
                            <input type={type} placeholder={placeholder} value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} className="input-field" />
                        </div>
                    ))}
                    <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-stone-600 mb-1">Description *</label>
                        <textarea value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="input-field h-24 resize-none" placeholder="Product description..." />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Ingredients (comma separated)</label>
                        <input value={form.ingredients} onChange={e => setForm(f => ({ ...f, ingredients: e.target.value }))} className="input-field" placeholder="Bhringraj, Amla, Brahmi" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Benefits (comma separated)</label>
                        <input value={form.benefits} onChange={e => setForm(f => ({ ...f, benefits: e.target.value }))} className="input-field" placeholder="Reduces hair fall, Promotes growth" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Product Image</label>
                        <input type="file" accept="image/*" onChange={handleImageUpload} className="input-field text-sm" />
                        {uploadingImg && <p className="text-xs text-stone-400 mt-1">Uploading…</p>}
                        {form.image_url && <img src={form.image_url} alt="preview" className="mt-2 h-16 rounded-lg object-cover" />}
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                        <input type="checkbox" id="is_featured" checked={form.is_featured} onChange={e => setForm(f => ({ ...f, is_featured: e.target.checked }))} className="w-4 h-4 accent-primary-700" />
                        <label htmlFor="is_featured" className="text-sm text-stone-600">Featured Product</label>
                    </div>
                    <div className="sm:col-span-2 flex gap-3">
                        <button type="submit" className="btn-primary">{editing ? 'Update' : 'Create'} Product</button>
                        <button type="button" onClick={resetForm} className="btn-ghost">Cancel</button>
                    </div>
                </motion.form>
            )}

            {/* Products Table */}
            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-beige-50 border-b border-beige-200">
                            <tr>
                                {['Product', 'Category', 'Price', 'Stock', 'Featured', 'Actions'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase tracking-wider">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige-100">
                            {products.map(p => (
                                <tr key={p.id} className="hover:bg-beige-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <img src={p.image_url || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=80'} alt={p.name} className="w-10 h-10 rounded-lg object-cover" />
                                            <span className="font-medium text-stone-800 max-w-[150px] truncate">{p.name}</span>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3"><span className="badge badge-gold">{p.category}</span></td>
                                    <td className="px-4 py-3 font-semibold text-primary-700">₹{p.price}</td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${p.stock > 10 ? 'badge-green' : p.stock > 0 ? 'badge-gold' : 'badge-red'}`}>{p.stock}</span>
                                    </td>
                                    <td className="px-4 py-3">{p.is_featured ? '✦' : '—'}</td>
                                    <td className="px-4 py-3">
                                        <div className="flex gap-2">
                                            <button onClick={() => editProduct(p)} className="text-xs px-3 py-1 bg-beige-100 hover:bg-beige-200 text-stone-700 rounded-lg transition-colors">Edit</button>
                                            <button onClick={() => handleDelete(p.id, p.name)} className="text-xs px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg transition-colors">Delete</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            {products.length === 0 && (
                                <tr><td colSpan={6} className="text-center py-12 text-stone-400">No products yet. Add your first product above.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── Orders Admin ─────────────────────────────────────────────────────────────
function OrdersAdmin() {
    const [orders, setOrders] = useState([])
    const [filter, setFilter] = useState('')

    const loadOrders = () => getAdminOrders(filter ? { status: filter } : {}).then(r => setOrders(r.data.orders)).catch(() => { })
    useEffect(() => { loadOrders() }, [filter])

    const handleStatus = async (id, status) => {
        try { await updateOrderStatus(id, { order_status: status }); toast.success('Status updated!'); loadOrders() }
        catch { toast.error('Failed to update status') }
    }

    const statusColors = { processing: 'badge-gold', shipped: 'bg-blue-100 text-blue-700', delivered: 'badge-green', cancelled: 'badge-red' }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-semibold text-stone-800">Orders</h2>
                <select value={filter} onChange={e => setFilter(e.target.value)} className="input-field w-auto text-sm py-2">
                    <option value="">All Orders</option>
                    <option value="processing">Processing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>

            <div className="bg-white rounded-2xl shadow-soft overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead className="bg-beige-50 border-b border-beige-200">
                            <tr>
                                {['Order #', 'Customer', 'Amount', 'Payment', 'Status', 'Date', 'Update Status'].map(h => (
                                    <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-stone-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-beige-100">
                            {orders.map(o => (
                                <tr key={o.id} className="hover:bg-beige-50 transition-colors">
                                    <td className="px-4 py-3 font-mono text-xs text-stone-600">{o.order_number}</td>
                                    <td className="px-4 py-3">
                                        <p className="font-medium text-stone-800">{o.customer_name}</p>
                                        <p className="text-xs text-stone-400">{o.customer_phone}</p>
                                    </td>
                                    <td className="px-4 py-3 font-semibold text-primary-700">₹{o.total_amount}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-xs uppercase font-medium text-stone-600">{o.payment_method}</p>
                                        <span className={`badge text-xs ${o.payment_status === 'paid' ? 'badge-green' : 'badge-gold'}`}>{o.payment_status}</span>
                                    </td>
                                    <td className="px-4 py-3">
                                        <span className={`badge ${statusColors[o.order_status] || 'badge-gold'}`}>{o.order_status}</span>
                                    </td>
                                    <td className="px-4 py-3 text-stone-400 text-xs">{new Date(o.created_at).toLocaleDateString('en-IN')}</td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={o.order_status}
                                            onChange={e => handleStatus(o.id, e.target.value)}
                                            className="text-xs border border-beige-200 rounded-lg px-2 py-1 focus:outline-none focus:border-primary-400 bg-white"
                                        >
                                            {['processing', 'shipped', 'delivered', 'cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                            {orders.length === 0 && (
                                <tr><td colSpan={7} className="text-center py-12 text-stone-400">No orders yet.</td></tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

// ─── Admin Panel Shell ────────────────────────────────────────────────────────
export default function AdminPanel() {
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    const handleLogout = () => { logout(); navigate('/') }

    const navItems = [
        { to: '/admin', label: 'Dashboard', icon: '📊', end: true },
        { to: '/admin/products', label: 'Products', icon: '🌿' },
        { to: '/admin/orders', label: 'Orders', icon: '📦' },
    ]

    return (
        <div className="min-h-screen bg-cream flex">
            {/* Sidebar */}
            <aside className="w-56 shrink-0 bg-stone-900 text-white flex flex-col">
                <div className="p-5 border-b border-stone-800">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 rounded-full bg-primary-500 flex items-center justify-center">
                            <span className="text-white font-serif font-bold text-sm">A</span>
                        </div>
                        <div>
                            <p className="font-serif font-semibold text-sm">Adhaar</p>
                            <p className="text-xs text-stone-400">Admin Panel</p>
                        </div>
                    </div>
                </div>
                <nav className="flex-1 p-3 flex flex-col gap-1">
                    {navItems.map(item => (
                        <NavLink key={item.to} to={item.to} end={item.end}
                            className={({ isActive }) =>
                                `flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-colors ${isActive ? 'bg-primary-700 text-white' : 'text-stone-400 hover:text-white hover:bg-stone-800'
                                }`
                            }
                        >
                            <span>{item.icon}</span>{item.label}
                        </NavLink>
                    ))}
                </nav>
                <div className="p-4 border-t border-stone-800">
                    <p className="text-xs text-stone-500 mb-2 truncate">{user?.email}</p>
                    <button onClick={handleLogout} className="w-full text-left text-xs text-red-400 hover:text-red-300 transition-colors">Sign Out →</button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-8 overflow-y-auto">
                <Routes>
                    <Route index element={<Dashboard />} />
                    <Route path="products" element={<ProductsAdmin />} />
                    <Route path="orders" element={<OrdersAdmin />} />
                </Routes>
            </main>
        </div>
    )
}
