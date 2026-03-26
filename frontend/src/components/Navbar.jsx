import { useState, useEffect } from 'react'
import { Link, NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useCartStore, useAuthStore } from '../store'

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/shop', label: 'Shop' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
    const [scrolled, setScrolled] = useState(false)
    const [menuOpen, setMenuOpen] = useState(false)
    const cartCount = useCartStore((s) => s.items.reduce((n, i) => n + i.quantity, 0))
    const { user, logout } = useAuthStore()
    const navigate = useNavigate()

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20)
        window.addEventListener('scroll', onScroll)
        return () => window.removeEventListener('scroll', onScroll)
    }, [])

    const handleLogout = () => { logout(); navigate('/') }

    return (
        <>
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md shadow-soft' : 'bg-transparent'
                }`}>
                <div className="page-container">
                    <div className="flex items-center justify-between h-16 md:h-20">

                        {/* Logo */}
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center shadow-gold">
                                <span className="text-white font-serif font-bold text-sm">A</span>
                            </div>
                            <span className="font-serif text-xl font-semibold text-stone-800 group-hover:text-primary-700 transition-colors">
                                Adhaar
                            </span>
                        </Link>

                        {/* Desktop Nav */}
                        <ul className="hidden md:flex items-center gap-8">
                            {navLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink to={to} className={({ isActive }) =>
                                        `text-sm font-medium transition-colors ${isActive ? 'text-primary-700' : 'text-stone-600 hover:text-primary-700'}`
                                    }>
                                        {label}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>

                        {/* Right Icons */}
                        <div className="flex items-center gap-3">
                            {user?.role === 'admin' && (
                                <Link to="/admin" className="hidden md:inline-block text-xs badge badge-gold">Admin</Link>
                            )}
                            {user ? (
                                <button onClick={handleLogout} className="hidden md:inline-block text-sm text-stone-500 hover:text-primary-700 transition-colors">
                                    Logout
                                </button>
                            ) : (
                                <Link to="/admin/login" className="hidden md:inline-block text-sm text-stone-500 hover:text-primary-700 transition-colors">
                                    Login
                                </Link>
                            )}

                            {/* Cart */}
                            <Link to="/cart" className="relative p-2 rounded-full hover:bg-beige-100 transition-colors">
                                <svg className="w-5 h-5 text-stone-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                                </svg>
                                {cartCount > 0 && (
                                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-primary-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                                        {cartCount > 9 ? '9+' : cartCount}
                                    </span>
                                )}
                            </Link>

                            {/* Mobile menu toggle */}
                            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-2 rounded-full hover:bg-beige-100 transition-colors">
                                <div className="w-5 flex flex-col gap-1">
                                    <span className={`h-0.5 bg-stone-700 transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                                    <span className={`h-0.5 bg-stone-700 transition-all ${menuOpen ? 'opacity-0' : ''}`} />
                                    <span className={`h-0.5 bg-stone-700 transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
                                </div>
                            </button>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Menu */}
            <AnimatePresence>
                {menuOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="fixed inset-x-0 top-16 z-40 bg-white/95 backdrop-blur-md shadow-medium md:hidden"
                    >
                        <ul className="flex flex-col py-4 px-6 gap-1">
                            {navLinks.map(({ to, label }) => (
                                <li key={to}>
                                    <NavLink to={to} onClick={() => setMenuOpen(false)}
                                        className={({ isActive }) =>
                                            `block py-3 text-base font-medium border-b border-beige-100 transition-colors ${isActive ? 'text-primary-700' : 'text-stone-600'}`
                                        }
                                    >{label}</NavLink>
                                </li>
                            ))}
                            {user ? (
                                <li><button onClick={handleLogout} className="block py-3 text-base text-red-500">Logout</button></li>
                            ) : (
                                <li><Link to="/admin/login" onClick={() => setMenuOpen(false)} className="block py-3 text-base text-stone-500">Admin Login</Link></li>
                            )}
                        </ul>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    )
}
