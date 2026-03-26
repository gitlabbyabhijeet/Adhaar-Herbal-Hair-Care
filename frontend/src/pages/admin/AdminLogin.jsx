import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { login } from '../../lib/api'
import { useAuthStore } from '../../store'
import toast from 'react-hot-toast'

export default function AdminLogin() {
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const { setAuth, user } = useAuthStore()
    const navigate = useNavigate()

    // Already logged in as admin
    if (user?.role === 'admin') { navigate('/admin'); return null }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!form.email || !form.password) { toast.error('Email and password required'); return }
        setLoading(true)
        try {
            const res = await login(form)
            const { token, user: loggedUser } = res.data
            if (loggedUser.role !== 'admin') { toast.error('Admin access only'); return }
            setAuth({ user: loggedUser, token })
            toast.success('Welcome back, Admin!')
            navigate('/admin')
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-cream flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                <div className="text-center mb-8">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-primary-600 to-primary-400 flex items-center justify-center mx-auto mb-4 shadow-gold">
                        <span className="text-white font-serif font-bold text-xl">A</span>
                    </div>
                    <h1 className="text-3xl font-serif font-semibold text-stone-800">Admin Login</h1>
                    <p className="text-stone-400 text-sm mt-1">Adhaar Hair Care — Admin Portal</p>
                </div>

                <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-medium p-8 flex flex-col gap-4">
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Email</label>
                        <input
                            type="email" value={form.email}
                            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                            placeholder="admin@adhaar.com" className="input-field"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-stone-600 mb-1">Password</label>
                        <input
                            type="password" value={form.password}
                            onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
                            placeholder="••••••••" className="input-field"
                        />
                    </div>
                    <button type="submit" disabled={loading} className="btn-primary disabled:opacity-60 mt-2">
                        {loading ? 'Signing in…' : 'Sign In →'}
                    </button>
                </form>
                <p className="text-center text-sm text-stone-400 mt-4">
                    <a href="/" className="hover:text-primary-700 transition-colors">← Back to Store</a>
                </p>
            </motion.div>
        </div>
    )
}
