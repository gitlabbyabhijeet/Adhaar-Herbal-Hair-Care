const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-3">{title}</h2>
        <div className="text-stone-600 leading-relaxed flex flex-col gap-2">{children}</div>
    </div>
)

export default function TermsPage() {
    return (
        <div className="pt-20 min-h-screen bg-cream">
            <div className="bg-gradient-to-r from-beige-50 to-primary-50 py-12 text-center">
                <h1 className="text-4xl font-serif font-semibold text-stone-800">Terms & Conditions</h1>
                <p className="text-stone-400 mt-2">Last updated: March 2025</p>
            </div>
            <div className="page-container py-12 max-w-3xl">
                <Section title="Acceptance of Terms">
                    <p>By accessing and using the Adhaar website and purchasing our products, you accept and agree to be bound by these Terms and Conditions.</p>
                </Section>
                <Section title="Products & Orders">
                    <p>• All product descriptions and prices are subject to change without notice</p>
                    <p>• We reserve the right to limit quantities or cancel orders at our discretion</p>
                    <p>• Prices are in Indian Rupees (INR) and inclusive of applicable taxes</p>
                    <p>• Free shipping applies to orders above ₹499</p>
                </Section>
                <Section title="Payment">
                    <p>• We accept UPI, credit/debit cards, netbanking via Razorpay, and Cash on Delivery</p>
                    <p>• Razorpay transactions are secured by 256-bit SSL encryption</p>
                    <p>• COD is available for eligible PIN codes only</p>
                </Section>
                <Section title="Shipping">
                    <p>• Orders are dispatched within 1–2 business days</p>
                    <p>• Standard delivery: 3–7 business days depending on location</p>
                    <p>• Tracking information will be emailed after dispatch</p>
                </Section>
                <Section title="Intellectual Property">
                    <p>All content on this website, including logos, product images, and text, is the property of Adhaar Hair Care and is protected by Indian copyright law.</p>
                </Section>
                <Section title="Governing Law">
                    <p>These terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of courts in Mumbai, Maharashtra.</p>
                </Section>
                <Section title="Contact">
                    <p>For any questions regarding these terms: hello@adhaar.in</p>
                </Section>
            </div>
        </div>
    )
}
