const Section = ({ title, children }) => (
    <div className="mb-8">
        <h2 className="text-2xl font-serif font-semibold text-stone-800 mb-3">{title}</h2>
        <div className="text-stone-600 leading-relaxed flex flex-col gap-2">{children}</div>
    </div>
)

export default function ReturnPage() {
    return (
        <div className="pt-20 min-h-screen bg-cream">
            <div className="bg-gradient-to-r from-beige-50 to-primary-50 py-12 text-center">
                <h1 className="text-4xl font-serif font-semibold text-stone-800">Return & Refund Policy</h1>
                <p className="text-stone-400 mt-2">Last updated: March 2025</p>
            </div>
            <div className="page-container py-12 max-w-3xl">
                <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4 mb-8 text-sage-700 text-sm">
                    ✓ We have a 7-day return policy. If you're not satisfied with your purchase, we'll make it right.
                </div>
                <Section title="Eligibility for Returns">
                    <p>• Products must be returned within 7 days of delivery</p>
                    <p>• Products must be unused, in original packaging</p>
                    <p>• Products damaged due to misuse are not eligible</p>
                    <p>• Sale items cannot be returned unless defective</p>
                </Section>
                <Section title="How to Initiate a Return">
                    <p>1. Email hello@adhaar.in with your order number and reason</p>
                    <p>2. We will send a return label within 24 hours</p>
                    <p>3. Package and ship the product back to us</p>
                    <p>4. Refund issued within 5-7 business days of receipt</p>
                </Section>
                <Section title="Refund Method">
                    <p>• Online payments: Refunded to original payment method</p>
                    <p>• Cash on Delivery: Refunded via bank transfer or UPI</p>
                    <p>• Shipping charges are non-refundable unless product is defective</p>
                </Section>
                <Section title="Damaged or Wrong Products">
                    <p>If you received a damaged or incorrect product, please email us at hello@adhaar.in with photos within 48 hours of delivery. We will send a replacement at no extra cost.</p>
                </Section>
                <Section title="Contact">
                    <p>Return queries: hello@adhaar.in | +91 98765 43210</p>
                </Section>
            </div>
        </div>
    )
}
