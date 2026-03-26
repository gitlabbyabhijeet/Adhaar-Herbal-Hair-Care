import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getProducts, getCategories } from '../lib/api'
import ProductCard from '../components/ProductCard'

const PRICE_RANGES = [
    { label: 'All Prices', min: null, max: null },
    { label: 'Under ₹300', min: 0, max: 300 },
    { label: '₹300 – ₹500', min: 300, max: 500 },
    { label: '₹500 – ₹800', min: 500, max: 800 },
    { label: 'Above ₹800', min: 800, max: null },
]

export default function ShopPage() {
    const [searchParams, setSearchParams] = useSearchParams()
    const [products, setProducts] = useState([])
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedCat, setSelectedCat] = useState(searchParams.get('category') || '')
    const [priceRange, setPriceRange] = useState(0)
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState('newest')

    useEffect(() => {
        getCategories().then(r => setCategories(r.data.categories)).catch(() => { })
    }, [])

    useEffect(() => {
        setLoading(true)
        const range = PRICE_RANGES[priceRange]
        const params = {
            ...(selectedCat && { category: selectedCat }),
            ...(range.min !== null && { min_price: range.min }),
            ...(range.max !== null && { max_price: range.max }),
            ...(search && { search }),
        }
        getProducts(params)
            .then(r => {
                let products = r.data.products
                if (sortBy === 'price_asc') products = [...products].sort((a, b) => a.price - b.price)
                if (sortBy === 'price_desc') products = [...products].sort((a, b) => b.price - a.price)
                if (sortBy === 'rating') products = [...products].sort((a, b) => b.rating - a.rating)
                setProducts(products)
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false))
    }, [selectedCat, priceRange, search, sortBy])

    return (
        <div className="pt-20 min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-gradient-to-r from-beige-50 to-primary-50 py-12">
                <div className="page-container">
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                        <h1 className="section-title mb-2">Our Products</h1>
                        <p className="text-stone-500">Discover our full range of Ayurvedic hair care</p>
                    </motion.div>
                </div>
            </div>

            <div className="page-container py-10">
                <div className="flex flex-col lg:flex-row gap-8">

                    {/* Sidebar Filters */}
                    <aside className="lg:w-60 shrink-0">
                        <div className="bg-white rounded-2xl shadow-soft p-5 sticky top-24">
                            <h3 className="font-serif font-semibold text-stone-800 mb-4">Filters</h3>

                            {/* Search */}
                            <div className="mb-5">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 block">Search</label>
                                <input
                                    type="text"
                                    placeholder="Search products..."
                                    value={search}
                                    onChange={e => setSearch(e.target.value)}
                                    className="input-field text-sm"
                                />
                            </div>

                            {/* Category */}
                            <div className="mb-5">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 block">Category</label>
                                <ul className="flex flex-col gap-1">
                                    {['', ...categories].map((cat) => (
                                        <li key={cat}>
                                            <button
                                                onClick={() => setSelectedCat(cat)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${selectedCat === cat ? 'bg-primary-100 text-primary-800 font-medium' : 'text-stone-600 hover:bg-beige-50'
                                                    }`}
                                            >
                                                {cat || 'All Categories'}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Price */}
                            <div className="mb-5">
                                <label className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-2 block">Price</label>
                                <ul className="flex flex-col gap-1">
                                    {PRICE_RANGES.map((r, i) => (
                                        <li key={r.label}>
                                            <button
                                                onClick={() => setPriceRange(i)}
                                                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${priceRange === i ? 'bg-primary-100 text-primary-800 font-medium' : 'text-stone-600 hover:bg-beige-50'
                                                    }`}
                                            >
                                                {r.label}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            <button
                                onClick={() => { setSelectedCat(''); setPriceRange(0); setSearch('') }}
                                className="w-full btn-ghost text-sm border border-beige-200"
                            >
                                Reset Filters
                            </button>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-1">
                        <div className="flex items-center justify-between mb-6">
                            <p className="text-sm text-stone-500">{products.length} product{products.length !== 1 ? 's' : ''} found</p>
                            <select
                                value={sortBy}
                                onChange={e => setSortBy(e.target.value)}
                                className="input-field w-auto text-sm py-2"
                            >
                                <option value="newest">Newest First</option>
                                <option value="price_asc">Price: Low to High</option>
                                <option value="price_desc">Price: High to Low</option>
                                <option value="rating">Top Rated</option>
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="card animate-pulse">
                                        <div className="aspect-square bg-beige-200" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-3 bg-beige-200 rounded w-1/3" />
                                            <div className="h-4 bg-beige-200 rounded w-3/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                {products.map(p => <ProductCard key={p.id} product={p} />)}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-5xl mb-4">🌿</p>
                                <p className="text-stone-500">No products found. Try adjusting your filters.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
