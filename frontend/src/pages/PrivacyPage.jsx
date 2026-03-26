const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-3">{title}</h2>
        <div className="text-stone-600 leading-relaxed flex flex-col gap-2">{children}</div>
    </div>
)

export default function PrivacyPage() {
    return (
        <div className="pt-20 min-h-screen bg-cream">
            <div className="bg-gradient-to-r from-beige-50 to-primary-50 py-12 text-center">
                <h1 className="text-4xl font-serif font-semibold text-stone-800">Privacy Policy</h1>
                <p className="text-stone-400 mt-2">Last updated: March 2025</p>
            </div>
            <div className="page-container py-12 max-w-3xl">
                <Section title="Information We Collect">
                    <p>We collect personal information you provide when placing orders: name, email, phone number, and delivery address.</p>
                    <p>We also collect usage data (pages visited, time on site) to improve your experience.</p>
                </Section>
                <Section title="How We Use Your Information">
                    <p>• To process and fulfill your orders</p>
                    <p>• To send order confirmations and shipping updates</p>
                    <p>• To respond to customer service inquiries</p>
                    <p>• To improve our products and website</p>
                </Section>
                <Section title="Payment Security">
                    <p>All payments are processed via Razorpay, a PCI DSS-compliant payment gateway. We do not store your card details on our servers.</p>
                </Section>
                <Section title="Data Sharing">
                    <p>We do not sell, trade, or rent your personal information. We may share data with logistics partners solely to deliver your orders.</p>
                </Section>
                <Section title="Your Rights">
                    <p>You may request access to, correction of, or deletion of your personal data by contacting us at hello@adhaar.in.</p>
                </Section>
                <Section title="Contact">
                    <p>For privacy-related queries, email us at hello@adhaar.in or call +91 98765 43210.</p>
                </Section>
            </div>
        </div>
    )
}
