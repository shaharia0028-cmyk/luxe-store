'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Facebook,
  Instagram,
  Twitter,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Shield,
  Truck,
  RotateCcw,
} from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const features = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $99' },
    { icon: RotateCcw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Shield, title: 'Secure Payment', desc: '100% secure checkout' },
    { icon: CreditCard, title: 'Multiple Payment', desc: 'All cards accepted' },
  ];

  const quickLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'New Arrivals', href: '/shop?new=true' },
    { label: 'Best Sellers', href: '/shop?featured=true' },
    { label: 'Sale', href: '/shop?sale=true' },
  ];

  const supportLinks = [
    { label: 'Contact Us', href: '/contact' },
    { label: 'FAQs', href: '/faq' },
    { label: 'Shipping Info', href: '/shipping' },
    { label: 'Returns', href: '/returns' },
  ];

  const companyLinks = [
    { label: 'About Us', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Blog', href: '/blog' },
  ];

  const socialLinks = [
    { icon: Facebook, href: 'https://facebook.com/luxestore', label: 'Facebook' },
    { icon: Instagram, href: 'https://instagram.com/luxestore', label: 'Instagram' },
    { icon: Twitter, href: 'https://twitter.com/luxestore', label: 'Twitter' },
    { icon: Youtube, href: 'https://youtube.com/@luxestore', label: 'YouTube' },
  ];

  return (
    <footer className="bg-zinc-900 text-white">
      {/* Features Bar */}
      <div className="border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-12 h-12 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-orange" />
                </div>
                <div>
                  <p className="font-medium">{feature.title}</p>
                  <p className="text-sm text-zinc-400">{feature.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="text-2xl font-bold">
                <span className="text-orange">LUXE</span>Store
              </span>
            </Link>
            <p className="text-zinc-400 mb-6 max-w-sm">
              Your premier destination for premium products. We curate the finest
              selection of luxury items for the discerning shopper.
            </p>
            <div className="space-y-3 text-sm text-zinc-400">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-orange" />
                <span>123 Luxury Lane, New York, NY 10001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-orange" />
                <span>+1 (800) LUXE-123</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange" />
                <span>support@luxestore.com</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              {supportLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold mb-4">Company</h3>
            <ul className="space-y-2">
              {companyLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-zinc-400 hover:text-orange transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-sm text-zinc-400">
              © {currentYear} LUXE Store. All rights reserved.
            </p>
            <div className="flex items-center gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-10 h-10 rounded-full bg-zinc-800 hover:bg-orange flex items-center justify-center transition-colors"
                  aria-label={social.label}
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
