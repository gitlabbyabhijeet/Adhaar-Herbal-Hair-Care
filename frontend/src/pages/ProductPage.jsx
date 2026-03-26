import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProduct } from '../lib/api'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'

export default function ProductPage() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [tab, setTab] = useState('description')
    const addItem = useCartStore(s => s.addItem)

    useEffect(() => {
        getProduct(id)
            .then(r => setProduct(r.data.product))
            .catch(() => navigate('/shop'))
            .finally(() => setLoading(false))
    }, [id])

    if (loading) return (
        <div className="pt-24 min-h-screen page-container flex items-center justify-center">
            <div className="animate-spin w-10 h-10 border-4 border-primary-200 border-t-primary-700 rounded-full" />
        </div>
    )

    if (!product) return null

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null

    const handleAddToCart = () => {
        addItem(product, quantity)
        toast.success(`Added ${quantity}× ${product.name} to cart!`)
    }

    const handleBuyNow = () => {
        addItem(product, quantity)
        navigate('/checkout')
    }

    const tabs = [
        { key: 'description', label: 'Description' },
        { key: 'ingredients', label: 'Ingredients' },
        { key: 'benefits', label: 'Benefits' },
    ]

    return (
        <div className="pt-20 min-h-screen bg-cream">
            <div className="page-container py-12">
                {/* Breadcrumb */}
                <nav className="flex items-center gap-2 text-sm text-stone-400 mb-8">
                    <a href="/" className="hover:text-primary-700 transition-colors">Home</a>
                    <span>/</span>
                    <a href="/shop" className="hover:text-primary-700 transition-colors">Shop</a>
                    <span>/</span>
                    <span className="text-stone-700">{product.name}</span>
                </nav>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="rounded-3xl overflow-hidden bg-beige-50 aspect-square shadow-medium"
                    >
                        <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=800'}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </motion.div>

                    {/* Details */}
                    <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className="badge badge-gold">{product.category}</span>
                            {product.is_featured && <span className="badge bg-primary-100 text-primary-800">✦ Featured</span>}
                        </div>

                        <h1 className="text-3xl md:text-4xl font-serif font-semibold text-stone-800 mb-4 leading-tight">
                            {product.name}
                        </h1>

                        {/* Rating */}
                        <div className="flex items-center gap-2 mb-5">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-4 h-4 ${i < Math.round(product.rating || 4.5) ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-sm text-stone-500">{product.rating} ({product.reviews_count} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3 mb-6">
                            <span className="text-4xl font-serif font-bold text-primary-700">₹{product.price}</span>
                            {product.original_price && (
                                <>
                                    <span className="text-lg text-stone-400 line-through">₹{product.original_price}</span>
                                    <span className="badge bg-green-100 text-green-700">{discount}% OFF</span>
                                </>
                            )}
                        </div>

                        <p className="text-stone-500 leading-relaxed mb-6">{product.description}</p>

                        {/* Stock */}
                        <div className="flex items-center gap-2 mb-6">
                            <div className={`w-2 h-2 rounded-full ${product.stock > 0 ? 'bg-sage-500' : 'bg-red-400'}`} />
                            <span className="text-sm text-stone-500">
                                {product.stock > 0 ? `In Stock (${product.stock} left)` : 'Out of Stock'}
                            </span>
                        </div>

                        {/* Quantity */}
                        <div className="flex items-center gap-4 mb-6">
                            <label className="text-sm font-medium text-stone-600">Quantity:</label>
                            <div className="flex items-center border border-beige-200 rounded-full overflow-hidden">
                                <button
                                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-beige-100 transition-colors"
                                >−</button>
                                <span className="w-12 text-center font-medium">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(q => Math.min(product.stock, q + 1))}
                                    className="w-10 h-10 flex items-center justify-center hover:bg-beige-100 transition-colors"
                                >+</button>
                            </div>
                        </div>

                        {/* CTAs */}
                        <div className="flex gap-3 mb-8">
                            <button
                                onClick={handleAddToCart}
                                disabled={product.stock === 0}
                                className="flex-1 btn-secondary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add to Cart
                            </button>
                            <button
                                onClick={handleBuyNow}
                                disabled={product.stock === 0}
                                className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Buy Now →
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="grid grid-cols-3 gap-3 p-4 bg-beige-50 rounded-2xl text-center">
                            {[['🚚', 'Free Shipping', 'Above ₹499'], ['🔄', 'Easy Returns', '7-day returns'], ['🔒', 'Secure Pay', '100% safe']].map(([icon, title, sub]) => (
                                <div key={title}>
                                    <div className="text-xl mb-1">{icon}</div>
                                    <p className="text-xs font-semibold text-stone-700">{title}</p>
                                    <p className="text-xs text-stone-400">{sub}</p>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Tabs */}
                <div className="mt-16">
                    <div className="flex border-b border-beige-200 mb-6">
                        {tabs.map(t => (
                            <button
                                key={t.key}
                                onClick={() => setTab(t.key)}
                                className={`px-6 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t.key ? 'border-primary-700 text-primary-700' : 'border-transparent text-stone-500 hover:text-stone-700'
                                    }`}
                            >
                                {t.label}
                            </button>
                        ))}
                    </div>

                    <motion.div
                        key={tab}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="prose max-w-none text-stone-600 leading-relaxed"
                    >
                        {tab === 'description' && <p>{product.description}</p>}
                        {tab === 'ingredients' && (
                            <div className="flex flex-wrap gap-2">
                                {(product.ingredients || 'No ingredient info').split(',').map(ing => (
                                    <span key={ing} className="badge badge-gold">{ing.trim()}</span>
                                ))}
                            </div>
                        )}
                        {tab === 'benefits' && (
                            <ul className="flex flex-col gap-3">
                                {(product.benefits || 'No benefits listed').split(',').map(b => (
                                    <li key={b} className="flex items-start gap-2">
                                        <span className="text-sage-500 mt-0.5">✓</span>
                                        <span>{b.trim()}</span>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
