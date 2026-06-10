'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    role: 'Verified Buyer',
    avatar: 'https://images.pexels.com/photos/1494794/pexels-photo-1494794.jpeg?w=150',
    rating: 5,
    comment:
      'Absolutely love the quality of products from LUXE Store. The attention to detail in packaging and the product itself exceeded my expectations. Will definitely be shopping here again!',
  },
  {
    id: 2,
    name: 'Michael Chen',
    role: 'Premium Member',
    avatar: 'https://images.pexels.com/photos/1222271/pexels-photo-1222271.jpeg?w=150',
    rating: 5,
    comment:
      'The customer service is outstanding. Had a minor issue with my order and it was resolved within hours. The products are authentic and of premium quality. Highly recommend!',
  },
  {
    id: 3,
    name: 'Emily Davis',
    role: 'Verified Buyer',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?w=150',
    rating: 5,
    comment:
      'Fast shipping and beautiful products. I ordered a watch for my husband and he absolutely loved it. The presentation was impeccable. Thank you LUXE Store!',
  },
  {
    id: 4,
    name: 'James Wilson',
    role: 'Regular Customer',
    avatar: 'https://images.pexels.com/photos/1681013/pexels-photo-1681013.jpeg?w=150',
    rating: 5,
    comment:
      'Been shopping here for over a year now and never been disappointed. The curated selection of products is impressive and prices are competitive for the quality.',
  },
];

export function TestimonialsSection() {
  return (
    <section className="py-16 lg:py-24 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl lg:text-4xl font-bold mb-4">
            What Our Customers Say
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to say.
          </p>
        </motion.div>

        {/* Testimonials Carousel */}
        <Swiper
          modules={[Autoplay, Pagination]}
          autoplay={{ delay: 5000, disableOnInteraction: false }}
          pagination={{ clickable: true }}
          spaceBetween={24}
          slidesPerView={1}
          breakpoints={{
            640: { slidesPerView: 2 },
            1024: { slidesPerView: 3 },
          }}
          className="pb-12"
        >
          {testimonials.map((testimonial) => (
            <SwiperSlide key={testimonial.id}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="bg-card rounded-2xl p-6 h-full flex flex-col"
              >
                <Quote className="w-10 h-10 text-orange/20 mb-4" />
                <div className="flex items-center gap-1 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < testimonial.rating
                          ? 'text-yellow-400 fill-yellow-400'
                          : 'text-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="text-muted-foreground flex-grow mb-6">
                  &quot;{testimonial.comment}&quot;
                </p>
                <div className="flex items-center gap-3">
                  <div className="relative w-12 h-12 rounded-full overflow-hidden">
                    <Image
                      src={testimonial.avatar}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <p className="font-medium">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </motion.div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
