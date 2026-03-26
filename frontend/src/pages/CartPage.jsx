import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store'

export default function CartPage() {
    const { items, removeItem, updateQuantity } = useCartStore()
    const navigate = useNavigate()

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal >= 499 ? 0 : 49
    const total = subtotal + shipping

    if (items.length === 0) return (
        <div className="pt-20 min-h-screen bg-cream flex flex-col items-center justify-center gap-6 text-center px-4">
            <div className="text-7xl">🛒</div>
            <h2 className="text-3xl font-serif font-semibold text-stone-800">Your cart is empty</h2>
            <p className="text-stone-500 max-w-sm">Add some of our amazing herbal hair care products to get started.</p>
            <Link to="/shop" className="btn-primary">Shop Now</Link>
        </div>
    )

    return (
        <div className="pt-20 min-h-screen bg-cream">
            <div className="page-container py-12">
                <h1 className="section-title mb-8">Shopping Cart</h1>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Cart Items */}
                    <div className="flex-1 flex flex-col gap-4">
                        {items.map((item, idx) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: idx * 0.05 }}
                                className="bg-white rounded-2xl shadow-soft p-4 flex gap-4"
                            >
                                <img
                                    src={item.image_url || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=200'}
                                    alt={item.name}
                                    className="w-24 h-24 rounded-xl object-cover shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <p className="text-xs text-stone-400 mb-0.5">{item.category}</p>
                                    <h3 className="font-serif font-semibold text-stone-800 mb-1 truncate">{item.name}</h3>
                                    <p className="text-primary-700 font-semibold mb-3">₹{item.price}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center border border-beige-200 rounded-full overflow-hidden">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-beige-100 transition-colors text-sm"
                                            >−</button>
                                            <span className="w-8 text-center text-sm font-medium">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 flex items-center justify-center hover:bg-beige-100 transition-colors text-sm"
                                            >+</button>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="font-semibold text-stone-800">₹{(item.price * item.quantity).toFixed(2)}</span>
                                            <button
                                                onClick={() => removeItem(item.id)}
                                                className="text-red-400 hover:text-red-600 transition-colors"
                                            >
                                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}

                        <Link to="/shop" className="btn-ghost self-start mt-2">← Continue Shopping</Link>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:w-80 shrink-0">
                        <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                            <h2 className="font-serif font-semibold text-stone-800 text-xl mb-5">Order Summary</h2>

                            <div className="flex flex-col gap-3 text-sm mb-5">
                                <div className="flex justify-between text-stone-600">
                                    <span>Subtotal ({items.reduce((n, i) => n + i.quantity, 0)} items)</span>
                                    <span>₹{subtotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-stone-600">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-sage-600 font-medium' : ''}>
                                        {shipping === 0 ? 'FREE' : `₹${shipping}`}
                                    </span>
                                </div>
                                {shipping > 0 && (
                                    <p className="text-xs text-stone-400 bg-beige-50 rounded-lg px-3 py-2">
                                        Add ₹{(499 - subtotal).toFixed(0)} more for free shipping!
                                    </p>
                                )}
                                <div className="border-t border-beige-200 pt-3 flex justify-between font-semibold text-stone-800 text-base">
                                    <span>Total</span>
                                    <span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate('/checkout')}
                                className="btn-primary w-full"
                            >
                                Proceed to Checkout →
                            </button>

                            <div className="mt-4 flex items-center justify-center gap-2">
                                <svg className="w-4 h-4 text-sage-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <span className="text-xs text-stone-400">Secure & Encrypted Checkout</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
