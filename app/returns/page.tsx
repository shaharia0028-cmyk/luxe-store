'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { RotateCcw, Package, CheckCircle, Clock, CreditCard } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function ReturnsPage() {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-6">
            <RotateCcw className="w-8 h-8 text-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Returns & Exchanges</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We want you to love your purchase. If you&apos;re not completely satisfied, our return policy makes it easy.
          </p>
        </motion.div>

        {/* Return Policy Highlights */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid md:grid-cols-4 gap-4 mb-12"
        >
          <div className="bg-card rounded-xl p-6 text-center">
            <Clock className="w-8 h-8 text-orange mx-auto mb-3" />
            <p className="font-semibold mb-1">30 Days</p>
            <p className="text-sm text-muted-foreground">To return items</p>
          </div>
          <div className="bg-card rounded-xl p-6 text-center">
            <Package className="w-8 h-8 text-orange mx-auto mb-3" />
            <p className="font-semibold mb-1">Free Returns</p>
            <p className="text-sm text-muted-foreground">Prepaid labels</p>
          </div>
          <div className="bg-card rounded-xl p-6 text-center">
            <CreditCard className="w-8 h-8 text-orange mx-auto mb-3" />
            <p className="font-semibold mb-1">Full Refund</p>
            <p className="text-sm text-muted-foreground">To original payment</p>
          </div>
          <div className="bg-card rounded-xl p-6 text-center">
            <RotateCcw className="w-8 h-8 text-orange mx-auto mb-3" />
            <p className="font-semibold mb-1">Easy Exchange</p>
            <p className="text-sm text-muted-foreground">Size or color swaps</p>
          </div>
        </motion.div>

        {/* How to Return */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-8 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">How to Initiate a Return</h2>
          <div className="space-y-6">
            {[
              {
                step: 1,
                title: 'Log into your account',
                desc: 'Go to your Orders section and find the order containing the item(s) you want to return.',
              },
              {
                step: 2,
                title: 'Select items to return',
                desc: 'Click "Return" on the order and select which items you wish to return along with the reason.',
              },
              {
                step: 3,
                title: 'Print your return label',
                desc: 'We\'ll generate a prepaid shipping label. Print it and attach to your package.',
              },
              {
                step: 4,
                title: 'Drop off your package',
                desc: 'Take your package to any carrier location. Your tracking will update automatically.',
              },
            ].map((item) => (
              <div key={item.step} className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-orange text-white flex items-center justify-center font-bold flex-shrink-0">
                  {item.step}
                </div>
                <div>
                  <h3 className="font-medium mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Return Conditions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-8 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Return Conditions</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h3 className="flex items-center gap-2 font-medium text-green-500 mb-3">
                <CheckCircle className="w-5 h-5" />
                Accepted Returns
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Unused items in original packaging</li>
                <li>Items with all tags attached</li>
                <li>Products in original condition</li>
                <li>Items returned within 30 days</li>
                <li>Items with receipt or proof of purchase</li>
              </ul>
            </div>
            <div>
              <h3 className="flex items-center gap-2 font-medium text-red-500 mb-3">
                <CheckCircle className="w-5 h-5" />
                Non-Returnable Items
              </h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>Personalized or custom items</li>
                <li>Intimate or hygiene products</li>
                <li>E-books or digital downloads</li>
                <li>Items marked as final sale</li>
                <li>Gift cards</li>
              </ul>
            </div>
          </div>
        </motion.div>

        {/* Refund Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-card rounded-2xl p-8"
        >
          <h2 className="text-xl font-semibold mb-6">Refund Information</h2>
          <ul className="space-y-4 text-muted-foreground">
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
              <span>Refunds are processed within 5-7 business days after we receive your return.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
              <span>The refund will be credited to your original payment method.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
              <span>You will receive an email confirmation once your refund is processed.</span>
            </li>
            <li className="flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-orange flex-shrink-0 mt-0.5" />
              <span>Exchanges are shipped out within 48 hours of processing.</span>
            </li>
          </ul>
          <div className="mt-8">
            <Link href="/contact">
              <Button className="bg-orange hover:bg-orange-600">
                Need Help? Contact Support
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
