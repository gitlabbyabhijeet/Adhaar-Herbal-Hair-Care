import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProducts } from '../lib/api'
import ProductCard from '../components/ProductCard'
import main_website from '../assets/main_website.png'

const benefits = [
    { icon: '🌿', title: 'Pure Ayurvedic', desc: 'Ancient herbs sourced ethically from certified farms across India.' },
    { icon: '✨', title: 'No Harmful Chemicals', desc: 'Sulfate-free, paraben-free, and silicone-free formulations.' },
    { icon: '🔬', title: 'Dermatologist Tested', desc: 'Clinically validated for safety on all hair and scalp types.' },
    { icon: '🌱', title: 'Sustainably Crafted', desc: 'Eco-friendly packaging and cruelty-free production processes.' },
]

const testimonials = [
    { name: 'Priya S.', location: 'Mumbai', rating: 5, text: 'The Adhaar hair oil transformed my dry, brittle hair in just 4 weeks! My hair feels so lush and healthy now.' },
    { name: 'Anjali K.', location: 'Delhi', rating: 5, text: 'Finally found a shampoo that doesn\'t strip my color-treated hair. The herbal ingredients are incredible!' },
    { name: 'Meera R.', location: 'Bangalore', rating: 5, text: 'The scalp serum reduced my dandruff within 2 weeks. I\'m absolutely in love with Adhaar.' },
]

const fadeUp = {
    initial: { opacity: 0, y: 30 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true },
    transition: { duration: 0.6 }
}

export default function HomePage() {
    const [featuredProducts, setFeaturedProducts] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        getProducts({ featured: 'true' })
            .then(r => setFeaturedProducts(r.data.products.slice(0, 4)))
            .catch(() => { })
            .finally(() => setLoading(false))
    }, [])

    return (
        <div className="overflow-hidden">

            {/* ── Hero ─────────────────────────────────────────── */}
            <section className="relative min-h-screen flex items-center bg-gradient-to-br from-beige-50 via-cream to-primary-50 pt-20">
                <div className="absolute inset-0 bg-pattern opacity-50" />
                <div className="absolute right-0 top-0 w-1/2 h-full hidden lg:block">
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent via-transparent to-cream z-10" />
                    <img
                        src={main_website}
                        alt="Adhaar herbal hair care"
                        className="w-full h-full object-cover opacity-70"
                        style={{
                           WebkitMaskImage: "linear-gradient(to bottom, black 80%, transparent)",
                           maskImage: "linear-gradient(to bottom, black 80%, transparent)"
                     }}
                    />
                </div>

                <div className="relative z-10 py-20 pl-6 lg:pl-20">
                    <div className="max-w-xl">
                        <motion.span {...fadeUp} className="inline-block badge badge-gold mb-4 text-sm px-4 py-1.5">
                            ✦ 100% Herbal &amp; Ayurvedic
                        </motion.span>
                        <motion.h1
                            {...fadeUp}
                            transition={{ delay: 0.1, duration: 0.7 }}
                            className="text-5xl md:text-6xl lg:text-7xl font-serif font-semibold leading-[1.1] text-stone-800 mb-6"
                        >
                            Hair Care Rooted in{' '}
                            <span className="text-gradient italic">Nature's</span>{' '}
                            Wisdom
                        </motion.h1>
                        <motion.p
                            {...fadeUp}
                            transition={{ delay: 0.2, duration: 0.6 }}
                            className="text-lg text-stone-500 mb-8 leading-relaxed"
                        >
                            Discover the power of Bhringraj, Amla, and ancient Ayurvedic herbs — handcrafted into luxurious hair care rituals for every hair type.
                        </motion.p>
                        <motion.div
                            {...fadeUp}
                            transition={{ delay: 0.3 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to="/shop" className="btn-primary text-base px-8 py-4">Shop Now →</Link>
                            <Link to="/about" className="btn-secondary text-base px-8 py-4">Our Story</Link>
                        </motion.div>

                        <motion.div {...fadeUp} transition={{ delay: 0.4 }} className="flex gap-8 mt-12">
                            {[['10K+', 'Happy Customers'], ['100%', 'Natural Ingredients'], ['4.8★', 'Average Rating']].map(([val, label]) => (
                                <div key={label}>
                                    <p className="text-2xl font-serif font-bold text-primary-700">{val}</p>
                                    <p className="text-xs text-stone-400">{label}</p>
                                </div>
                            ))}
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* ── Benefits ─────────────────────────────────────── */}
            <section className="py-20 bg-white">
                <div className="page-container">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <span className="badge badge-gold mb-3">Why Adhaar</span>
                        <h2 className="section-title mb-3">Pure. Powerful. Proven.</h2>
                        <p className="section-subtitle mx-auto">The ancient secrets of Ayurveda, brought to your modern hair care ritual.</p>
                    </motion.div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {benefits.map((b, i) => (
                            <motion.div
                                key={b.title}
                                {...fadeUp}
                                transition={{ delay: i * 0.1 }}
                                className="p-6 rounded-2xl bg-beige-50 hover:bg-beige-100 transition-colors text-center"
                            >
                                <div className="text-4xl mb-4">{b.icon}</div>
                                <h3 className="font-serif font-semibold text-stone-800 mb-2">{b.title}</h3>
                                <p className="text-sm text-stone-500 leading-relaxed">{b.desc}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Featured Products ─────────────────────────────── */}
            <section className="py-20 bg-cream">
                <div className="page-container">
                    <motion.div {...fadeUp} className="flex items-end justify-between mb-12">
                        <div>
                            <span className="badge badge-gold mb-2">Best Sellers</span>
                            <h2 className="section-title">Our Hero Products</h2>
                        </div>
                        <Link to="/shop" className="btn-ghost hidden sm:flex">View All →</Link>
                    </motion.div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="card animate-pulse">
                                    <div className="aspect-square bg-beige-200" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 bg-beige-200 rounded w-1/3" />
                                        <div className="h-4 bg-beige-200 rounded w-3/4" />
                                        <div className="h-3 bg-beige-200 rounded w-1/2" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : featuredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {featuredProducts.map((p) => <ProductCard key={p.id} product={p} />)}
                        </div>
                    ) : (
                        <div className="text-center py-16">
                            <p className="text-stone-400 mb-4">No products yet — add them from the admin panel.</p>
                            <Link to="/admin" className="btn-primary">Go to Admin</Link>
                        </div>
                    )}

                    <div className="text-center mt-8 sm:hidden">
                        <Link to="/shop" className="btn-secondary">View All Products</Link>
                    </div>
                </div>
            </section>

            {/* ── Ritual Banner ─────────────────────────────────── */}
            <section className="py-20 bg-primary-800 relative overflow-hidden">
                <div className="absolute inset-0 bg-pattern opacity-10" />
                <div className="page-container relative z-10 text-center">
                    <motion.div {...fadeUp}>
                        <h2 className="text-4xl md:text-5xl font-serif font-semibold text-white mb-4">
                            Begin Your <span className="italic text-primary-200">Hair Ritual</span>
                        </h2>
                        <p className="text-primary-200 text-lg mb-8 max-w-xl mx-auto">
                            Free shipping on orders above ₹499. Try our complete hair care kit and transform your hair in 30 days.
                        </p>
                        <Link to="/shop?category=Kit" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary-800 font-semibold rounded-full hover:bg-primary-50 transition-colors shadow-gold">
                            Shop Kits →
                        </Link>
                    </motion.div>
                </div>
            </section>

            {/* ── Testimonials ─────────────────────────────────── */}
            <section className="py-20 bg-white">
                <div className="page-container">
                    <motion.div {...fadeUp} className="text-center mb-14">
                        <span className="badge badge-gold mb-3">Reviews</span>
                        <h2 className="section-title">Loved by Thousands</h2>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {testimonials.map((t, i) => (
                            <motion.div key={t.name} {...fadeUp} transition={{ delay: i * 0.1 }} className="card p-6">
                                <div className="flex mb-3">
                                    {[...Array(t.rating)].map((_, j) => (
                                        <svg key={j} className="w-4 h-4 text-amber-400" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <p className="text-stone-600 italic mb-4 leading-relaxed">"{t.text}"</p>
                                <div>
                                    <p className="font-semibold text-stone-800">{t.name}</p>
                                    <p className="text-xs text-stone-400">{t.location}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Newsletter ────────────────────────────────────── */}
            <section className="py-16 bg-beige-50">
                <div className="page-container">
                    <motion.div {...fadeUp} className="max-w-xl mx-auto text-center">
                        <h2 className="text-3xl font-serif font-semibold text-stone-800 mb-3">
                            Get Hair Care Tips & Offers
                        </h2>
                        <p className="text-stone-500 mb-6">Subscribe for exclusive Ayurvedic hair care tips, new launches, and 10% off your first order.</p>
                        <form className="flex gap-2" onSubmit={e => e.preventDefault()}>
                            <input type="email" placeholder="Enter your email" className="input-field flex-1" />
                            <button type="submit" className="btn-primary whitespace-nowrap">Subscribe</button>
                        </form>
                    </motion.div>
                </div>
            </section>
        </div>
    )
}
