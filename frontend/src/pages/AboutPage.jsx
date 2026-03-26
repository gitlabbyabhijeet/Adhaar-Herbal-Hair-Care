import { motion } from 'framer-motion'

const fadeUp = { initial: { opacity: 0, y: 20 }, whileInView: { opacity: 1, y: 0 }, viewport: { once: true }, transition: { duration: 0.5 } }

export default function AboutPage() {
    return (
        <div className="pt-20 min-h-screen bg-cream">
            {/* Hero */}
            <div className="bg-gradient-to-br from-beige-50 to-primary-50 py-20">
                <div className="page-container text-center">
                    <motion.div {...fadeUp}>
                        <span className="badge badge-gold mb-4">Our Story</span>
                        <h1 className="text-5xl font-serif font-semibold text-stone-800 mb-4">Rooted in Ayurveda,<br />Made for You</h1>
                        <p className="text-stone-500 max-w-2xl mx-auto text-lg leading-relaxed">
                            Adhaar was born from a simple belief — that the best hair care comes from the earth, not a laboratory.
                        </p>
                    </motion.div>
                </div>
            </div>

            <div className="page-container py-16">
                {/* Story */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
                    <motion.div {...fadeUp}>
                        <h2 className="text-3xl font-serif font-semibold text-stone-800 mb-4">How Adhaar Began</h2>
                        <div className="flex flex-col gap-4 text-stone-600 leading-relaxed">
                            <p>Adhaar (meaning "foundation" in Sanskrit) was founded with a vision to bring ancient Ayurvedic hair care wisdom to modern Indian homes.</p>
                            <p>Our founder, discovering the power of her grandmother's traditional oil blend of Bhringraj and Brahmi, decided to create a brand that honours these time-tested formulations with modern standards of quality and purity.</p>
                            <p>Every Adhaar product is crafted with ethically sourced herbs, cold-pressed oils, and zero harmful chemicals — because your hair deserves only the best that nature has to offer.</p>
                        </div>
                    </motion.div>
                    <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="rounded-3xl overflow-hidden shadow-medium">
                        <img src="https://images.unsplash.com/photo-1580919880424-7ec31dcd0c0e?w=600&q=80" alt="Adhaar ingredients" className="w-full h-80 object-cover" />
                    </motion.div>
                </div>

                {/* Values */}
                <motion.div {...fadeUp} className="text-center mb-10">
                    <h2 className="section-title">Our Values</h2>
                </motion.div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                    {[
                        { icon: '🌿', title: 'Purity First', desc: 'Every ingredient is carefully selected, ethically sourced, and free from toxins.' },
                        { icon: '🔬', title: 'Science Meets Tradition', desc: 'Ancient Ayurvedic formulations validated by modern dermatological research.' },
                        { icon: '🌍', title: 'Sustainable', desc: 'Eco-friendly packaging, cruelty-free, and committed to zero-waste production.' },
                        { icon: '💚', title: 'Transparent', desc: 'Full ingredient disclosure. No hidden chemicals, no greenwashing.' },
                        { icon: '🤝', title: 'Community First', desc: 'We partner with local farmers and Ayurvedic experts across India.' },
                        { icon: '✨', title: 'Results Driven', desc: 'Products that deliver visible, measurable results within weeks of use.' },
                    ].map((v, i) => (
                        <motion.div key={v.title} {...fadeUp} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-6 shadow-soft text-center">
                            <div className="text-4xl mb-3">{v.icon}</div>
                            <h3 className="font-serif font-semibold text-stone-800 mb-2">{v.title}</h3>
                            <p className="text-sm text-stone-500">{v.desc}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}
