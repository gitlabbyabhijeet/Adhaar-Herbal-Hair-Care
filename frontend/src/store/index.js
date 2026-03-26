import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Cart Store ─────────────────────────────────────────────────────────────
export const useCartStore = create(
    persist(
        (set, get) => ({
            items: [],

            addItem: (product, quantity = 1) => {
                const { items } = get()
                const existing = items.find((i) => i.id === product.id)
                if (existing) {
                    set({ items: items.map((i) => i.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) })
                } else {
                    set({ items: [...items, { ...product, quantity }] })
                }
            },

            removeItem: (id) => set({ items: get().items.filter((i) => i.id !== id) }),

            updateQuantity: (id, quantity) => {
                if (quantity < 1) return get().removeItem(id)
                set({ items: get().items.map((i) => i.id === id ? { ...i, quantity } : i) })
            },

            clearCart: () => set({ items: [] }),

            get total() {
                return get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
            },
            get count() {
                return get().items.reduce((sum, i) => sum + i.quantity, 0)
            },
            get shipping() {
                const total = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
                return total >= 499 ? 0 : 49
            },
            get grandTotal() {
                const t = get().items.reduce((sum, i) => sum + i.price * i.quantity, 0)
                return t + (t >= 499 ? 0 : 49)
            },
        }),
        { name: 'adhaar-cart' }
    )
)

// ─── Auth Store ──────────────────────────────────────────────────────────────
export const useAuthStore = create(
    persist(
        (set) => ({
            user: JSON.parse(localStorage.getItem('adhaar_user') || 'null'),
            token: localStorage.getItem('adhaar_token') || null,

            setAuth: ({ user, token }) => {
                localStorage.setItem('adhaar_token', token)
                localStorage.setItem('adhaar_user', JSON.stringify(user))
                set({ user, token })
            },

            logout: () => {
                localStorage.removeItem('adhaar_token')
                localStorage.removeItem('adhaar_user')
                set({ user: null, token: null })
            },

            isAdmin: () => {
                const state = useAuthStore.getState()
                return state.user?.role === 'admin'
            },
        }),
        { name: 'adhaar-auth' }
    )
)
