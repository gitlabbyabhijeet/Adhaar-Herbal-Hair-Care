import axios from 'axios'

const API = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
    timeout: 15000,
})

// Attach JWT token to every request
API.interceptors.request.use((config) => {
    const token = localStorage.getItem('adhaar_token')
    if (token) config.headers.Authorization = `Bearer ${token}`
    return config
})

// Handle 401 globally
API.interceptors.response.use(
    (res) => res,
    (err) => {
        if (err.response?.status === 401) {
            localStorage.removeItem('adhaar_token')
            localStorage.removeItem('adhaar_user')
        }
        return Promise.reject(err)
    }
)

// Auth
export const register = (data) => API.post('/register', data)
export const login = (data) => API.post('/login', data)
export const getMe = () => API.get('/me')

// Products
export const getProducts = (params) => API.get('/products', { params })
export const getProduct = (id) => API.get(`/products/${id}`)
export const createProduct = (data) => API.post('/products', data)
export const updateProduct = (id, data) => API.put(`/products/${id}`, data)
export const deleteProduct = (id) => API.delete(`/products/${id}`)
export const getCategories = () => API.get('/categories')

// Orders
export const createOrder = (data) => API.post('/create-order', data)
export const getOrders = () => API.get('/orders')
export const getOrder = (id) => API.get(`/orders/${id}`)
export const updateOrderStatus = (id, status) => API.put(`/orders/${id}/status`, { order_status: status })

// Payments
export const createRazorpayOrder = (data) => API.post('/razorpay/create-order', data)
export const verifyPayment = (data) => API.post('/verify-payment', data)

// Admin
export const getAdminDashboard = () => API.get('/admin/dashboard')
export const getAdminOrders = (params) => API.get('/admin/orders', { params })
export const seedProducts = () => API.post('/admin/seed')
export const uploadImage = (formData) => API.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
})

export default API
