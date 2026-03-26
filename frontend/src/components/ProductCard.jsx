import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useCartStore } from '../store'
import toast from 'react-hot-toast'

export default function ProductCard({ product }) {
    const addItem = useCartStore((s) => s.addItem)

    const handleAddToCart = (e) => {
        e.preventDefault()
        addItem(product)
        toast.success(`${product.name} added to cart!`)
    }

    const discount = product.original_price
        ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
        : null

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
        >
            <Link to={`/product/${product.id}`} className="block group">
                <div className="card">
                    {/* Image */}
                    <div className="relative overflow-hidden bg-beige-50 aspect-square">
                        <img
                            src={product.image_url || 'https://images.unsplash.com/photo-1556228453-efd6c1ff04f6?w=500'}
                            alt={product.name}
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        {discount && (
                            <span className="absolute top-3 left-3 badge bg-primary-700 text-white text-xs">
                                {discount}% OFF
                            </span>
                        )}
                        {product.is_featured && (
                            <span className="absolute top-3 right-3 badge badge-gold">✦ Featured</span>
                        )}

                        {/* Quick Add overlay */}
                        <div className="absolute inset-x-0 bottom-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <button
                                onClick={handleAddToCart}
                                className="w-full py-3 bg-primary-700/90 backdrop-blur-sm text-white text-sm font-medium hover:bg-primary-800 transition-colors"
                            >
                                + Add to Cart
                            </button>
                        </div>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <p className="text-xs text-stone-400 mb-1 uppercase tracking-wider">{product.category}</p>
                        <h3 className="font-serif font-semibold text-stone-800 mb-2 leading-snug line-clamp-2 group-hover:text-primary-700 transition-colors">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                    <svg key={i} className={`w-3.5 h-3.5 ${i < Math.round(product.rating || 4.5) ? 'text-amber-400' : 'text-stone-200'}`} fill="currentColor" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                ))}
                            </div>
                            <span className="text-xs text-stone-400">({product.reviews_count || 0})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-2">
                            <span className="text-lg font-semibold text-primary-700">₹{product.price}</span>
                            {product.original_price && (
                                <span className="text-sm text-stone-400 line-through">₹{product.original_price}</span>
                            )}
                        </div>
                    </div>
                </div>
            </Link>
        </motion.div>
    )
}
