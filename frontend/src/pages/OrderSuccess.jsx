import { useEffect, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getOrder } from '../lib/api'

export default function OrderSuccess() {
    const { id } = useParams()
    const [order, setOrder] = useState(null)

    useEffect(() => {
        getOrder(id).then(r => setOrder(r.data.order)).catch(() => { })
    }, [id])

    return (
        <div className="pt-20 min-h-screen bg-cream flex items-center">
            <div className="page-container py-16">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="max-w-lg mx-auto text-center"
                >
                    <div className="w-24 h-24 bg-sage-100 rounded-full flex items-center justify-center mx-auto mb-6 text-5xl">
                        🎉
                    </div>
                    <h1 className="text-4xl font-serif font-semibold text-stone-800 mb-3">
                        Order Placed Successfully!
                    </h1>
                    <p className="text-stone-500 leading-relaxed mb-8">
                        Thank you for choosing Adhaar! Your order has been received and will be dispatched soon. Happy hair days ahead! 🌿
                    </p>

                    {order && (
                        <div className="bg-white rounded-2xl shadow-soft p-6 text-left mb-8">
                            <div className="flex flex-col gap-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Order Number</span>
                                    <span className="font-mono font-semibold text-stone-800">{order.order_number}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Payment Status</span>
                                    <span className={`badge ${order.payment_status === 'paid' ? 'badge-green' : 'badge-gold'}`}>
                                        {order.payment_status === 'paid' ? '✓ Paid' : '⏳ Pending'}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Order Status</span>
                                    <span className="badge badge-gold">{order.order_status}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Payment Method</span>
                                    <span className="text-sm font-medium text-stone-700 uppercase">{order.payment_method}</span>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-sm text-stone-500">Total Amount</span>
                                    <span className="font-bold text-primary-700 text-lg">₹{order.total_amount}</span>
                                </div>
                                <div className="border-t border-beige-200 pt-3">
                                    <p className="text-xs text-stone-400">Delivering to: {order.customer_name}, {order.address}, {order.pincode}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Link to="/shop" className="btn-primary">Continue Shopping</Link>
                        <Link to="/" className="btn-secondary">Back to Home</Link>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
