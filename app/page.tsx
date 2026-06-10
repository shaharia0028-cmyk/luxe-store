'use client';

import { HeroSection } from '@/components/home/hero';
import { CategoriesSection } from '@/components/home/categories';
import { ProductsSection } from '@/components/home/products';
import { SpecialOffersSection } from '@/components/home/promotions';
import { TestimonialsSection } from '@/components/home/testimonials';
import { NewsletterSection } from '@/components/home/newsletter';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <ProductsSection
        title="Best Sellers"
        subtitle="Our most popular products loved by customers"
        query="featured"
      />
      <SpecialOffersSection />
      <ProductsSection
        title="New Arrivals"
        subtitle="Fresh additions to our collection"
        query="new"
      />
      <TestimonialsSection />
      <NewsletterSection />
    </>
  );
}
