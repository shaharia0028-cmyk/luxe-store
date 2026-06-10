'use client';

import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Database, Bell, Mail } from 'lucide-react';

export default function PrivacyPage() {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-6">
            <Shield className="w-8 h-8 text-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
          <p className="text-muted-foreground">Last updated: June 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-8 space-y-8"
        >
          <section>
            <h2 className="text-xl font-semibold mb-4">Information We Collect</h2>
            <p className="text-muted-foreground mb-4">
              We collect information you provide directly to us, such as when you create an account,
              make a purchase, or contact us for support.
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Account information (name, email, password)</li>
              <li>Shipping and billing addresses</li>
              <li>Payment information (processed securely by our payment providers)</li>
              <li>Order history and preferences</li>
              <li>Communications with our support team</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Process and fulfill your orders</li>
              <li>Communicate with you about your orders and account</li>
              <li>Send promotional emails (with your consent)</li>
              <li>Improve our products and services</li>
              <li>Protect against fraud and unauthorized transactions</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Information Sharing</h2>
            <p className="text-muted-foreground mb-4">
              We do not sell, trade, or rent your personal information. We may share your information with:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Service providers who assist our operations</li>
              <li>Payment processors for secure transactions</li>
              <li>Shipping carriers for order delivery</li>
              <li>Legal authorities when required by law</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Data Security</h2>
            <p className="text-muted-foreground">
              We implement industry-standard security measures including SSL encryption, secure servers,
              and regular security audits to protect your personal information. However, no method of
              transmission over the Internet is 100% secure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Your Rights</h2>
            <p className="text-muted-foreground mb-4">You have the right to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Access and update your personal information</li>
              <li>Request deletion of your account</li>
              <li>Opt out of marketing communications</li>
              <li>Request a copy of your data</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Cookies</h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to enhance your browsing experience,
              analyze site traffic, and personalize content. You can manage cookie preferences
              in your browser settings.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
            <p className="text-muted-foreground">
              If you have questions about this Privacy Policy, please contact us at
              privacy@luxestore.com or through our contact form.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
