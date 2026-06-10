'use client';

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-6">
            <FileText className="w-8 h-8 text-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Terms of Service</h1>
          <p className="text-muted-foreground">Last updated: June 2024</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-8 space-y-8"
        >
          <section>
            <h2 className="text-xl font-semibold mb-4">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By accessing and using LUXE Store, you accept and agree to be bound by the terms
              and conditions of this agreement. If you do not agree to these terms, please
              do not use our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">2. Use of Service</h2>
            <p className="text-muted-foreground mb-4">You agree to use our service only for lawful purposes and in accordance with these Terms. You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
              <li>Violate any applicable laws or regulations</li>
              <li>Infringe upon the rights of others</li>
              <li>Attempt to gain unauthorized access to our systems</li>
              <li>Interfere with the proper working of the service</li>
              <li>Engage in fraudulent activity</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">3. Account Registration</h2>
            <p className="text-muted-foreground">
              You may be required to create an account to access certain features. You are responsible
              for maintaining the confidentiality of your account credentials and for all activities
              that occur under your account. You must immediately notify us of any unauthorized use.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">4. Products and Pricing</h2>
            <p className="text-muted-foreground">
              All prices are listed in USD and are subject to change without notice. We reserve the
              right to limit quantities and refuse service to anyone. Product images are for illustration
              purposes only; actual products may vary slightly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">5. Payment Terms</h2>
            <p className="text-muted-foreground">
              Payment must be received prior to order acceptance. We accept major credit cards, PayPal,
              and other payment methods as displayed at checkout. All transactions are processed securely.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">6. Shipping and Delivery</h2>
            <p className="text-muted-foreground">
              Shipping times are estimates and not guaranteed. Title and risk of loss pass to you upon
              delivery. We are not responsible for delays caused by carriers or events beyond our control.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">7. Returns and Refunds</h2>
            <p className="text-muted-foreground">
              Please refer to our Returns Policy for information on returns, exchanges, and refunds.
              We reserve the right to refuse returns that do not meet our policy requirements.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">8. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content on this website, including text, graphics, logos, images, and software,
              is the property of LUXE Store or its suppliers and is protected by copyright laws.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">9. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              To the fullest extent permitted by law, LUXE Store shall not be liable for any
              indirect, incidental, special, consequential, or punitive damages arising from your
              use of our services.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">10. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with the laws of the
              State of New York, without regard to its conflict of law provisions.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold mb-4">11. Contact</h2>
            <p className="text-muted-foreground">
              For questions about these Terms, please contact us at legal@luxestore.com.
            </p>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
