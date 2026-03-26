// import { useState } from 'react'
// import { motion } from 'framer-motion'
// import toast from 'react-hot-toast'

// export default function ContactPage() {
//     const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
//     const handleSubmit = (e) => { e.preventDefault(); toast.success("Message sent! We'll reply within 24 hours."); setForm({ name: '', email: '', subject: '', message: '' }) }

//     return (
//         <div className="pt-20 min-h-screen bg-cream">
//             <div className="bg-gradient-to-br from-beige-50 to-primary-50 py-16 text-center">
//                 <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
//                     <span className="badge badge-gold mb-4">Get In Touch</span>
//                     <h1 className="text-5xl font-serif font-semibold text-stone-800 mb-3">Contact Us</h1>
//                     <p className="text-stone-500 max-w-lg mx-auto">Have questions about our products? We're here to help, 7 days a week.</p>
//                 </motion.div>
//             </div>

//             <div className="page-container py-16">
//                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
//                     {/* Info */}
//                     <div className="flex flex-col gap-6">
//                         {[
//                             { icon: '📧', title: 'Email Us', val: 'hello@adhaar.in', sub: 'We reply within 24 hours' },
//                             { icon: '📞', title: 'Call Us', val: '+91 84455 95601', sub: 'Mon–Sat, 9 AM to 6 PM IST' },
//                             { icon: '📍', title: 'Address', val: 'Adhaar Hair Care', sub: 'Meerut, Uttar Pradesh, India' },
//                         ].map(item => (
//                             <div key={item.title} className="bg-white rounded-2xl shadow-soft p-5 flex items-start gap-4">
//                                 <div className="text-3xl">{item.icon}</div>
//                                 <div>
//                                     <h3 className="font-serif font-semibold text-stone-800">{item.title}</h3>
//                                     <p className="text-primary-700 font-medium">{item.val}</p>
//                                     <p className="text-sm text-stone-400">{item.sub}</p>
//                                 </div>
//                             </div>
//                         ))}
//                         <div className="bg-beige-50 rounded-2xl p-5">
//                             <h3 className="font-serif font-semibold text-stone-700 mb-2">Business Hours</h3>
//                             <div className="flex flex-col gap-1 text-sm text-stone-500">
//                                 <p className="flex justify-between"><span>Monday – Friday</span><span>9:00 AM – 6:00 PM</span></p>
//                                 <p className="flex justify-between"><span>Saturday</span><span>10:00 AM – 4:00 PM</span></p>
//                                 <p className="flex justify-between"><span>Sunday</span><span className="text-red-400">Closed</span></p>
//                             </div>
//                         </div>
//                     </div>

//                     {/* Form */}
//                     <motion.form initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} onSubmit={handleSubmit}
//                         className="bg-white rounded-2xl shadow-soft p-8 flex flex-col gap-4"
//                     >
//                         <h2 className="font-serif font-semibold text-stone-800 text-xl mb-1">Send a Message</h2>
//                         {[['name', 'Your Name', 'text', 'Priya Sharma'], ['email', 'Email Address', 'email', 'priya@example.com'], ['subject', 'Subject', 'text', 'Order enquiry']].map(([k, l, t, p]) => (
//                             <div key={k}>
//                                 <label className="block text-sm font-medium text-stone-600 mb-1">{l}</label>
//                                 <input type={t} value={form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))} placeholder={p} className="input-field" />
//                             </div>
//                         ))}
//                         <div>
//                             <label className="block text-sm font-medium text-stone-600 mb-1">Message</label>
//                             <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} placeholder="Tell us how we can help..." className="input-field h-32 resize-none" />
//                         </div>
//                         <button type="submit" className="btn-primary">Send Message →</button>
//                     </motion.form>
//                 </div>
//             </div>
//         </div>
//     )
// }


import { useState } from 'react'
import { motion } from 'framer-motion'
import toast from 'react-hot-toast'

export default function ContactPage() {
    const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })

    const handleSubmit = (e) => {
        e.preventDefault()
        toast.success("Message sent! We'll reply within 24 hours.")
        setForm({ name: '', email: '', subject: '', message: '' })
    }

    return (
        <div className="pt-20 min-h-screen bg-cream">
            {/* Header */}
            <div className="bg-gradient-to-br from-beige-50 to-primary-50 py-16 text-center">
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                    <span className="badge badge-gold mb-4">Get In Touch</span>
                    <h1 className="text-5xl font-serif font-semibold text-stone-800 mb-3">Contact Us</h1>
                    <p className="text-stone-500 max-w-lg mx-auto">
                        Have questions about our products? We're here to help, 7 days a week.
                    </p>
                </motion.div>
            </div>

            {/* Content */}
            <div className="page-container py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

                    {/* Info Section */}
                    <div className="flex flex-col gap-6">
                        {[
                            { icon: '📧', title: 'Email Us', val: 'hello@adhaar.in', sub: 'We reply within 24 hours' },
                            { icon: '📞', title: 'Call Us', val: '+91 84455 95601', sub: 'Mon–Sat, 9 AM to 6 PM IST' },
                            { icon: '📍', title: 'Address', val: 'Adhaar Hair Care', sub: 'Meerut, Uttar Pradesh, India' },
                        ].map(item => (
                            <div key={item.title} className="bg-white rounded-2xl shadow-soft p-5 flex items-start gap-4">
                                <div className="text-3xl">{item.icon}</div>

                                <div>
                                    <h3 className="font-serif font-semibold text-stone-800">
                                        {item.title}
                                    </h3>

                                    {/* Clickable Logic */}
                                    {item.title === 'Email Us' ? (
                                        <a
                                            href={`mailto:${item.val}`}
                                            className="text-primary-700 font-medium hover:underline cursor-pointer"
                                        >
                                            {item.val}
                                        </a>

                                    ) : item.title === 'Call Us' ? (
                                        <a
                                            href={`tel:${item.val.replace(/\s+/g, '')}`}
                                            className="text-primary-700 font-medium hover:underline cursor-pointer"
                                        >
                                            {item.val}
                                        </a>

                                    ) : item.title === 'Address' ? (
                                        <a
                                            href="https://www.google.com/maps/search/?api=1&query=Meerut+Uttar+Pradesh+India"
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-primary-700 font-medium hover:underline cursor-pointer"
                                        >
                                            {item.val}
                                        </a>

                                    ) : (
                                        <p className="text-primary-700 font-medium">{item.val}</p>
                                    )}

                                    <p className="text-sm text-stone-400">{item.sub}</p>
                                </div>
                            </div>
                        ))}

                        {/* Business Hours */}
                        <div className="bg-beige-50 rounded-2xl p-5">
                            <h3 className="font-serif font-semibold text-stone-700 mb-2">
                                Business Hours
                            </h3>
                            <div className="flex flex-col gap-1 text-sm text-stone-500">
                                <p className="flex justify-between">
                                    <span>Monday – Friday</span>
                                    <span>9:00 AM – 6:00 PM</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Saturday</span>
                                    <span>10:00 AM – 4:00 PM</span>
                                </p>
                                <p className="flex justify-between">
                                    <span>Sunday</span>
                                    <span className="text-red-400">Closed</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Form Section */}
                    <motion.form
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        onSubmit={handleSubmit}
                        className="bg-white rounded-2xl shadow-soft p-8 flex flex-col gap-4"
                    >
                        <h2 className="font-serif font-semibold text-stone-800 text-xl mb-1">
                            Send a Message
                        </h2>

                        {[
                            ['name', 'Your Name', 'text', 'Priya Sharma'],
                            ['email', 'Email Address', 'email', 'priya@example.com'],
                            ['subject', 'Subject', 'text', 'Order enquiry']
                        ].map(([k, l, t, p]) => (
                            <div key={k}>
                                <label className="block text-sm font-medium text-stone-600 mb-1">
                                    {l}
                                </label>
                                <input
                                    type={t}
                                    value={form[k]}
                                    onChange={e => setForm(f => ({ ...f, [k]: e.target.value }))}
                                    placeholder={p}
                                    className="input-field"
                                />
                            </div>
                        ))}

                        <div>
                            <label className="block text-sm font-medium text-stone-600 mb-1">
                                Message
                            </label>
                            <textarea
                                value={form.message}
                                onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
                                placeholder="Tell us how we can help..."
                                className="input-field h-32 resize-none"
                            />
                        </div>

                        <button type="submit" className="btn-primary">
                            Send Message →
                        </button>
                    </motion.form>

                </div>
            </div>
        </div>
    )
}