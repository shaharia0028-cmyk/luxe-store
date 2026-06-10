'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    title: 'Premium Tech Collection',
    subtitle: 'Innovation Meets Luxury',
    description: 'Discover the latest smartphones, laptops, and cutting-edge gadgets designed for those who demand excellence.',
    image: 'https://images.pexels.com/photos/3786850/pexels-photo-3786850.jpeg?w=1920',
    cta: { text: 'Shop Electronics', href: '/shop?category=electronics' },
    accent: 'orange',
  },
  {
    id: 2,
    title: 'Fashion Forward',
    subtitle: 'Elevate Your Style',
    description: 'Curated collections from world-renowned designers. Express yourself with premium apparel and accessories.',
    image: 'https://images.pexels.com/photos/934070/pexels-photo-934070.jpeg?w=1920',
    cta: { text: 'Shop Fashion', href: '/shop?category=fashion' },
    accent: 'orange',
  },
  {
    id: 3,
    title: 'Home Renaissance',
    subtitle: 'Transform Your Space',
    description: 'Luxury furniture and decor that turns your house into a masterpiece. Modern designs, timeless elegance.',
    image: 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg?w=1920',
    cta: { text: 'Shop Home', href: '/shop?category=home-living' },
    accent: 'orange',
  },
];

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center">
      <Swiper
        modules={[Autoplay, EffectFade, Pagination]}
        effect="fade"
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        className="absolute inset-0"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div className="relative min-h-screen flex items-center">
              {/* Background Image */}
              <div className="absolute inset-0">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="100vw"
                  quality={85}
                />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/50 to-transparent" />
              </div>

              {/* Content */}
              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
                <div className="max-w-2xl">
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-orange font-medium tracking-wider uppercase mb-4"
                  >
                    {slide.subtitle}
                  </motion.p>
                  <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight"
                  >
                    {slide.title}
                  </motion.h1>
                  <motion.p
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-lg text-white/80 mb-8 max-w-lg"
                  >
                    {slide.description}
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-wrap gap-4"
                  >
                    <Button size="lg" className="bg-orange hover:bg-orange-600 text-white" asChild>
                      <Link href={slide.cta.href}>
                        {slide.cta.text}
                        <ArrowRight className="ml-2 w-5 h-5" />
                      </Link>
                    </Button>
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-white/30 text-white hover:bg-white/10"
                    >
                      <Play className="mr-2 w-5 h-5" />
                      Watch Video
                    </Button>
                  </motion.div>
                </div>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20"
      >
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 1.5 }}
          className="w-6 h-10 rounded-full border-2 border-white/50 flex items-start justify-center p-2"
        >
          <div className="w-1.5 h-3 bg-white/50 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
