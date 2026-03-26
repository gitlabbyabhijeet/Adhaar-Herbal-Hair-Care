import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store'
import { createOrder, createRazorpayOrder, verifyPayment } from '../lib/api'
import toast from 'react-hot-toast'

const RAZORPAY_KEY = import.meta.env.VITE_RAZORPAY_KEY || ''

export default function CheckoutPage() {
    const { items, clearCart } = useCartStore()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [form, setForm] = useState({
        customer_name: '', customer_email: '', customer_phone: '',
        address: '', pincode: '', city: '', state: '',
        payment_method: 'razorpay'
    })

    const subtotal = items.reduce((s, i) => s + i.price * i.quantity, 0)
    const shipping = subtotal >= 499 ? 0 : 49
    const total = subtotal + shipping

    const handleChange = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

    const validate = () => {
        const required = ['customer_name', 'customer_email', 'customer_phone', 'address', 'pincode']
        for (const field of required) {
            if (!form[field].trim()) {
                toast.error(`Please fill in ${field.replace('customer_', '').replace('_', ' ')}`)
                return false
            }
        }
        if (!/^\d{6}$/.test(form.pincode)) { toast.error('Please enter a valid 6-digit pincode'); return false }
        if (!/^[6-9]\d{9}$/.test(form.customer_phone)) { toast.error('Please enter a valid 10-digit phone number'); return false }
        return true
    }

    const placeOrder = async () => {
        if (!validate()) return
        if (items.length === 0) { toast.error('Your cart is empty'); return }
        setLoading(true)

        const orderPayload = {
            ...form,
            items: items.map(i => ({ product_id: i.id, quantity: i.quantity })),
        }

        try {
            const res = await createOrder(orderPayload)
            const order = res.data.order

            if (form.payment_method === 'cod') {
                clearCart()
                navigate(`/order-success/${order.id}`)
                return
            }

            // Razorpay flow
            const rzpRes = await createRazorpayOrder({ amount: order.total_amount, order_id: order.id })
            const { razorpay_order_id, amount: rzpAmount, key } = rzpRes.data

            const options = {
                key: key || RAZORPAY_KEY,
                amount: rzpAmount,
                currency: 'INR',
                name: 'Adhaar Hair Care',
                description: 'Herbal Hair Care Products',
                order_id: razorpay_order_id,
                prefill: {
                    name: form.customer_name,
                    email: form.customer_email,
                    contact: form.customer_phone,
                },
                theme: { color: '#8d6538' },
                handler: async (response) => {
                    try {
                        await verifyPayment({
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            order_id: order.id,
                        })
                        clearCart()
                        navigate(`/order-success/${order.id}`)
                    } catch {
                        toast.error('Payment verification failed. Contact support.')
                    }
                },
                modal: { ondismiss: () => { setLoading(false); toast('Payment cancelled') } },
            }

            if (!window.Razorpay) {
                toast.error('Razorpay not loaded. Please refresh and try again.')
                setLoading(false)
                return
            }
            new window.Razorpay(options).open()
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to place order')
        } finally {
            setLoading(false)
        }
    }

    if (items.length === 0) return (
        <div className="pt-20 min-h-screen bg-cream flex flex-col items-center justify-center gap-4">
            <p className="text-xl font-serif text-stone-600">Your cart is empty.</p>
            <a href="/shop" className="btn-primary">Go Shopping</a>
        </div>
    )

    return (
        <div className="pt-20 min-h-screen bg-cream">
            {/* Razorpay Script */}
            {typeof window !== 'undefined' && !window.Razorpay && (
                <script src="https://checkout.razorpay.com/v1/checkout.js" async />
            )}

            <div className="page-container py-12">
                <h1 className="section-title mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Contact Info */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl shadow-soft p-6">
                            <h2 className="font-serif font-semibold text-stone-800 text-lg mb-5">Contact Information</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Name *</label>
                                    <input name="customer_name" value={form.customer_name} onChange={handleChange} placeholder="Priya Sharma" className="input-field" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Phone Number *</label>
                                    <input name="customer_phone" value={form.customer_phone} onChange={handleChange} placeholder="9876543210" className="input-field" maxLength={10} />
                                </div>
                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Email Address *</label>
                                    <input name="customer_email" type="email" value={form.customer_email} onChange={handleChange} placeholder="priya@example.com" className="input-field" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Address */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl shadow-soft p-6">
                            <h2 className="font-serif font-semibold text-stone-800 text-lg mb-5">Delivery Address</h2>
                            <div className="flex flex-col gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-stone-600 mb-1">Full Address *</label>
                                    <textarea name="address" value={form.address} onChange={handleChange} placeholder="House/Flat no., Street, Area" className="input-field h-24 resize-none" />
                                </div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">Pincode *</label>
                                        <input name="pincode" value={form.pincode} onChange={handleChange} placeholder="400001" className="input-field" maxLength={6} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">City</label>
                                        <input name="city" value={form.city} onChange={handleChange} placeholder="Mumbai" className="input-field" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-stone-600 mb-1">State</label>
                                        <input name="state" value={form.state} onChange={handleChange} placeholder="Maharashtra" className="input-field" />
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl shadow-soft p-6">
                            <h2 className="font-serif font-semibold text-stone-800 text-lg mb-5">Payment Method</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {[
                                    { value: 'razorpay', label: 'Online Payment', sub: 'UPI, Cards, Netbanking', icon: '💳' },
                                    { value: 'cod', label: 'Cash on Delivery', sub: 'Pay when delivered', icon: '💵' },
                                ].map(opt => (
                                    <label key={opt.value} className={`flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all ${form.payment_method === opt.value ? 'border-primary-500 bg-primary-50' : 'border-beige-200 hover:border-beige-300'}`}>
                                        <input type="radio" name="payment_method" value={opt.value} checked={form.payment_method === opt.value} onChange={handleChange} className="sr-only" />
                                        <div className="text-2xl">{opt.icon}</div>
                                        <div>
                                            <p className="font-semibold text-stone-800 text-sm">{opt.label}</p>
                                            <p className="text-xs text-stone-400">{opt.sub}</p>
                                        </div>
                                        <div className={`ml-auto w-5 h-5 rounded-full border-2 flex items-center justify-center ${form.payment_method === opt.value ? 'border-primary-600 bg-primary-600' : 'border-beige-300'}`}>
                                            {form.payment_method === opt.value && <div className="w-2 h-2 rounded-full bg-white" />}
                                        </div>
                                    </label>
                                ))}
                            </div>
                        </motion.div>
                    </div>

                    {/* Order Summary */}
                    <div>
                        <div className="bg-white rounded-2xl shadow-soft p-6 sticky top-24">
                            <h2 className="font-serif font-semibold text-stone-800 text-lg mb-5">Your Order</h2>

                            <div className="flex flex-col gap-3 mb-5 max-h-48 overflow-y-auto">
                                {items.map(item => (
                                    <div key={item.id} className="flex items-center gap-3">
                                        <img src={item.image_url || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=100'} alt={item.name} className="w-12 h-12 rounded-lg object-cover shrink-0" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-stone-800 truncate">{item.name}</p>
                                            <p className="text-xs text-stone-400">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-stone-700">₹{(item.price * item.quantity).toFixed(0)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-beige-200 pt-4 flex flex-col gap-2 text-sm">
                                <div className="flex justify-between text-stone-500"><span>Subtotal</span><span>₹{subtotal.toFixed(2)}</span></div>
                                <div className="flex justify-between text-stone-500">
                                    <span>Shipping</span>
                                    <span className={shipping === 0 ? 'text-sage-600 font-medium' : ''}>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                                </div>
                                <div className="flex justify-between font-bold text-stone-800 text-base mt-1 pt-2 border-t border-beige-100">
                                    <span>Total</span><span>₹{total.toFixed(2)}</span>
                                </div>
                            </div>

                            <button
                                onClick={placeOrder}
                                disabled={loading}
                                className="btn-primary w-full mt-5 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                                {loading ? (
                                    <span className="flex items-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                                        Processing…
                                    </span>
                                ) : form.payment_method === 'cod' ? 'Place Order (COD)' : 'Pay Now →'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
