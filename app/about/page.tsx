'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import { Users, Target, Award, Heart, Shield, Zap } from 'lucide-react';

const values = [
  {
    icon: Heart,
    title: 'Quality First',
    description: 'We never compromise on quality. Every product is carefully curated.',
  },
  {
    icon: Shield,
    title: 'Trust & Integrity',
    description: 'Building lasting relationships through honest business practices.',
  },
  {
    icon: Zap,
    title: 'Innovation',
    description: 'Constantly evolving to bring you the latest and greatest.',
  },
  {
    icon: Users,
    title: 'Customer Focus',
    description: 'Your satisfaction is our top priority in everything we do.',
  },
];

const team = [
  {
    name: 'Alexandra Chen',
    role: 'CEO & Founder',
    image: 'https://images.pexels.com/photos/15706882/pexels-photo-15706882.jpeg?w=300',
  },
  {
    name: 'Marcus Williams',
    role: 'Head of Product',
    image: 'https://images.pexels.com/photos/1681013/pexels-photo-1681013.jpeg?w=300',
  },
  {
    name: 'Sofia Rodriguez',
    role: 'Head of Design',
    image: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=300',
  },
  {
    name: 'James Thompson',
    role: 'Head of Operations',
    image: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=300',
  },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-muted/50 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl lg:text-5xl font-bold mb-6">
              Redefining <span className="text-orange">Premium</span> Shopping
            </h1>
            <p className="text-lg text-muted-foreground">
              LUXE Store was born from a simple idea: everyone deserves access to
              premium products without compromising on quality or paying
              excessive prices.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
            >
              <h2 className="text-3xl font-bold mb-6">Our Story</h2>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  Founded in 2020, LUXE Store started as a small passion project
                  with a vision to make premium products accessible to everyone.
                  Our founder, Alexandra Chen, noticed a gap in the market for
                  genuinely curated, high-quality products at fair prices.
                </p>
                <p>
                  What began as a curated selection of tech gadgets has grown into
                  a comprehensive platform spanning electronics, fashion, home
                  living, beauty, sports, and more. Each product in our catalog
                  is hand-selected by our team of experts.
                </p>
                <p>
                  Today, we serve customers in over 50 countries, maintaining our
                  commitment to quality while continuously expanding our offerings.
                </p>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative aspect-square rounded-2xl overflow-hidden"
            >
              <Image
                src="https://images.pexels.com/photos/3184299/pexels-photo-3184299.jpeg?w=800"
                alt="Our team"
                fill
                className="object-cover"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 bg-orange/10 text-orange rounded-full px-4 py-2 mb-6">
              <Target className="w-4 h-4" />
              <span className="text-sm font-medium">Our Mission</span>
            </div>
            <h2 className="text-3xl font-bold mb-4">
              To democratize access to premium quality
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              We believe that exceptional quality shouldn&apos;t come with an
              exceptional price tag. Our mission is to bring the finest products
              to discerning customers worldwide.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl font-bold text-center mb-12"
          >
            Our Core Values
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6 rounded-2xl bg-card border"
              >
                <div className="w-14 h-14 rounded-full bg-orange/10 flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-7 h-7 text-orange" />
                </div>
                <h3 className="font-bold mb-2">{value.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Meet Our Team</h2>
            <p className="text-muted-foreground max-w-xl mx-auto">
              The passionate people behind LUXE Store
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {team.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden mx-auto mb-4">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <h3 className="font-bold">{member.name}</h3>
                <p className="text-sm text-muted-foreground">{member.role}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { value: '50+', label: 'Countries' },
              { value: '100K+', label: 'Happy Customers' },
              { value: '500+', label: 'Premium Products' },
              { value: '4.9', label: 'Average Rating' },
            ].map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center p-6"
              >
                <p className="text-4xl font-bold text-orange mb-2">
                  {stat.value}
                </p>
                <p className="text-muted-foreground">{stat.label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
