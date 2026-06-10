'use client';

import { motion } from 'framer-motion';
import { Zap, Timer } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';

interface CountdownProps {
  targetDate: Date;
}

function Countdown({ targetDate }: CountdownProps) {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        });
      }
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return (
    <div className="flex gap-3">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hours' },
        { value: timeLeft.minutes, label: 'Mins' },
        { value: timeLeft.seconds, label: 'Secs' },
      ].map((item, index) => (
        <div
          key={index}
          className="flex flex-col items-center bg-white dark:bg-zinc-800 rounded-lg p-3 min-w-[60px]"
        >
          <span className="text-2xl font-bold tabular-nums">
            {String(item.value).padStart(2, '0')}
          </span>
          <span className="text-xs text-muted-foreground">{item.label}</span>
        </div>
      ))}
    </div>
  );
}

export function SpecialOffersSection() {
  const endDate = new Date();
  endDate.setDate(endDate.getDate() + 3);

  return (
    <section className="py-16 lg:py-24 bg-gradient-to-br from-orange via-orange-500 to-orange-600 text-white relative overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              'radial-gradient(circle at 2px 2px, white 1px, transparent 0)',
            backgroundSize: '40px 40px',
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur rounded-full px-4 py-2 mb-6">
              <Zap className="w-4 h-4" />
              <span className="text-sm font-medium">Limited Time Offer</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">
              Flash Sale
              <br />
              Up to 50% Off
            </h2>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Don&apos;t miss out on our exclusive flash sale. Premium products at
              unbeatable prices. Hurry, ends soon!
            </p>
            <div className="mb-8">
              <p className="text-sm text-white/60 uppercase tracking-wider mb-3">
                Offer ends in:
              </p>
              <Countdown targetDate={endDate} />
            </div>
            <Button size="lg" variant="secondary" className="bg-white text-orange hover:bg-white/90" asChild>
              <Link href="/shop?sale=true">Shop Now</Link>
            </Button>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="grid grid-cols-2 gap-4"
          >
            {[
              { value: '50%', label: 'Maximum Discount' },
              { value: '500+', label: 'Products on Sale' },
              { value: '24/7', label: 'Customer Support' },
              { value: 'Free', label: 'Shipping over $99' },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-white/10 backdrop-blur rounded-2xl p-6 text-center hover-lift"
              >
                <p className="text-3xl font-bold mb-1">{item.value}</p>
                <p className="text-sm text-white/70">{item.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
