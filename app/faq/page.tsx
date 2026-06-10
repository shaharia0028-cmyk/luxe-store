'use client';

import { motion } from 'framer-motion';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const faqs = [
  {
    category: 'Orders & Shipping',
    questions: [
      {
        q: 'How can I track my order?',
        a: 'Once your order is shipped, you will receive a tracking number via email. You can use this number to track your package on the carrier\'s website or in your account dashboard under "Orders".',
      },
      {
        q: 'How long does shipping take?',
        a: 'Standard shipping takes 5-7 business days. Express shipping (2-3 business days) is available for an additional fee. Free shipping is offered on orders over $99.',
      },
      {
        q: 'Do you ship internationally?',
        a: 'Yes, we ship to over 50 countries worldwide. International shipping times vary by destination, typically 7-14 business days. Customs fees may apply.',
      },
      {
        q: 'Can I change my shipping address after placing an order?',
        a: 'Address changes are only possible before the order is shipped. Please contact our support team immediately if you need to update your address.',
      },
    ],
  },
  {
    category: 'Returns & Exchanges',
    questions: [
      {
        q: 'What is your return policy?',
        a: 'We offer a 30-day return policy for most items. Products must be unused, in original packaging, and accompanied by proof of purchase. Some items like personalized products are non-returnable.',
      },
      {
        q: 'How do I initiate a return?',
        a: 'Log into your account, go to Orders, and select "Return" for the item you wish to return. Follow the prompts to print a prepaid return label.',
      },
      {
        q: 'When will I receive my refund?',
        a: 'Refunds are processed within 5-7 business days after we receive your return. The refund will be credited to your original payment method.',
      },
      {
        q: 'Can I exchange an item?',
        a: 'Yes, you can exchange an item for a different size or color. Contact our support team to arrange an exchange.',
      },
    ],
  },
  {
    category: 'Payment & Pricing',
    questions: [
      {
        q: 'What payment methods do you accept?',
        a: 'We accept all major credit cards (Visa, MasterCard, American Express, Discover), PayPal, Apple Pay, and Google Pay.',
      },
      {
        q: 'Is my payment information secure?',
        a: 'Yes, all transactions are encrypted using SSL technology. We never store your full credit card information on our servers.',
      },
      {
        q: 'Do you offer installment payments?',
        a: 'Yes, we partner with several buy-now-pay-later providers including Klarna and Afterpay. Select this option at checkout.',
      },
      {
        q: 'Why was I charged a different amount?',
        a: 'This could be due to taxes, shipping fees, or currency conversion for international orders. Check your order confirmation for a detailed breakdown.',
      },
    ],
  },
  {
    category: 'Account & Support',
    questions: [
      {
        q: 'How do I create an account?',
        a: 'Click "Sign In" in the top right corner, then select "Sign Up". Enter your email and create a password. You can also sign up using Google.',
      },
      {
        q: 'I forgot my password. What should I do?',
        a: 'Click "Sign In", then "Forgot Password". Enter your email address and we\'ll send you a link to reset your password.',
      },
      {
        q: 'How do I contact customer support?',
        a: 'You can reach us via email at support@luxestore.com, phone at +1 (800) LUXE-123, or through our contact form. We respond within 24 hours.',
      },
      {
        q: 'How do I unsubscribe from emails?',
        a: 'Click the "Unsubscribe" link at the bottom of any marketing email. You can also manage email preferences in your account settings.',
      },
    ],
  },
];

export default function FAQPage() {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold mb-4">Frequently Asked Questions</h1>
          <p className="text-muted-foreground">
            Find answers to common questions about orders, shipping, returns, and more.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="space-y-8"
        >
          {faqs.map((category) => (
            <div key={category.category}>
              <h2 className="text-xl font-semibold mb-4">{category.category}</h2>
              <Accordion type="single" collapsible className="w-full">
                {category.questions.map((item, index) => (
                  <AccordionItem key={index} value={`${category.category}-${index}`}>
                    <AccordionTrigger className="text-left">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
