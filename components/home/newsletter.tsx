'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/lib/supabase/client';

export function NewsletterSection() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('newsletter_subscribers')
        .insert({ email });

      if (insertError) {
        if (insertError.code === '23505') {
          setSubmitted(true);
        } else {
          setError('Something went wrong. Please try again.');
        }
      } else {
        setSubmitted(true);
      }

      setEmail('');
    } catch {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-16 lg:py-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="relative bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 rounded-3xl overflow-hidden"
        >
          <div className="absolute inset-0 opacity-5">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
                backgroundSize: '30px 30px',
              }}
            />
          </div>

          <div className="relative z-10 px-6 py-12 lg:px-12 lg:py-16 text-center">
            <Mail className="w-12 h-12 text-orange mx-auto mb-6" />
            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4">
              Stay in the Loop
            </h2>
            <p className="text-zinc-400 max-w-md mx-auto mb-8">
              Subscribe to our newsletter and be the first to know about new
              arrivals, exclusive offers, and special promotions.
            </p>

            {submitted ? (
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="flex items-center justify-center gap-2 text-green-400"
              >
                <CheckCircle2 className="w-6 h-6" />
                <span>Thanks for subscribing!</span>
              </motion.div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
              >
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="flex-grow bg-white/10 border-zinc-700 text-white placeholder:text-zinc-500 focus:border-orange"
                />
                <Button
                  type="submit"
                  className="bg-orange hover:bg-orange-600"
                  disabled={loading}
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Subscribe
                      <ArrowRight className="ml-2 w-4 h-4" />
                    </>
                  )}
                </Button>
              </form>
            )}

            {error && (
              <p className="text-red-400 text-sm mt-2">{error}</p>
            )}

            <p className="text-xs text-zinc-500 mt-4">
              By subscribing, you agree to our Privacy Policy and consent to receive updates.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
