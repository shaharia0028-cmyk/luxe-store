'use client';

import { motion } from 'framer-motion';
import { Truck, Globe, Package, Clock, Shield, AlertCircle } from 'lucide-react';

const shippingMethods = [
  {
    name: 'Standard Shipping',
    time: '5-7 business days',
    cost: 'Free on orders $99+',
    details: 'Our most economical option. Orders typically arrive within a week.',
  },
  {
    name: 'Express Shipping',
    time: '2-3 business days',
    cost: '$9.99',
    details: 'Get your items faster. Express orders are prioritized and shipped same-day if ordered before 2 PM EST.',
  },
  {
    name: 'Next Day Delivery',
    time: 'Next business day',
    cost: '$19.99',
    details: 'Guaranteed next business day delivery on orders placed before 12 PM EST.',
  },
];

const internationalInfo = [
  { region: 'Canada', time: '7-10 days', cost: '$14.99' },
  { region: 'Europe', time: '10-14 days', cost: '$19.99' },
  { region: 'Asia Pacific', time: '14-21 days', cost: '$24.99' },
  { region: 'Rest of World', time: '14-28 days', cost: '$29.99' },
];

export default function ShippingPage() {
  return (
    <div className="min-h-screen pt-20 bg-muted/30">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="w-16 h-16 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-6">
            <Truck className="w-8 h-8 text-orange" />
          </div>
          <h1 className="text-4xl font-bold mb-4">Shipping Information</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We ship worldwide with multiple options to suit your needs. All orders are carefully packaged and tracked.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-card rounded-2xl p-6 mb-8"
        >
          <h2 className="text-xl font-semibold mb-6">Domestic Shipping (USA)</h2>
          <div className="space-y-4">
            {shippingMethods.map((method) => (
              <div
                key={method.name}
                className="flex flex-col md:flex-row md:items-center justify-between p-4 rounded-xl bg-muted/50"
              >
                <div className="mb-2 md:mb-0">
                  <h3 className="font-medium">{method.name}</h3>
                  <p className="text-sm text-muted-foreground">{method.details}</p>
                </div>
                <div className="flex gap-8">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Delivery</p>
                    <p className="font-medium">{method.time}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Cost</p>
                    <p className="font-medium text-orange">{method.cost}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-card rounded-2xl p-6 mb-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <Globe className="w-6 h-6 text-orange" />
            <h2 className="text-xl font-semibold">International Shipping</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 font-medium">Region</th>
                  <th className="text-left py-3 font-medium">Delivery Time</th>
                  <th className="text-left py-3 font-medium">Cost</th>
                </tr>
              </thead>
              <tbody>
                {internationalInfo.map((info) => (
                  <tr key={info.region} className="border-b last:border-0">
                    <td className="py-3">{info.region}</td>
                    <td className="py-3 text-muted-foreground">{info.time}</td>
                    <td className="py-3 font-medium">{info.cost}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-sm text-muted-foreground mt-4 flex items-start gap-2">
            <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
            Customs duties and taxes may apply depending on your country. Please check with your local customs office.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid md:grid-cols-2 gap-6"
        >
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="w-5 h-5 text-orange" />
              <h3 className="font-semibold">Processing Time</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Orders are processed within 1-2 business days. Orders placed on weekends or holidays will be processed on the next business day.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Package className="w-5 h-5 text-orange" />
              <h3 className="font-semibold">Order Tracking</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              A tracking number will be emailed to you once your order ships. Track your order in your account dashboard or on the carrier site.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-5 h-5 text-orange" />
              <h3 className="font-semibold">Secure Packaging</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              All products are carefully packaged with protective materials. Fragile items receive additional padding for safe delivery.
            </p>
          </div>
          <div className="bg-card rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Truck className="w-5 h-5 text-orange" />
              <h3 className="font-semibold">Local Pickup</h3>
            </div>
            <p className="text-sm text-muted-foreground">
              Free local pickup is available at our NYC showroom. Select this option at checkout and we will notify you when ready.
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
