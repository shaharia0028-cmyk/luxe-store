'use client';

import Link from 'next/link';
import { XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function PaymentFailPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-muted/30">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Failed</h1>
          <p className="text-muted-foreground mb-6">
            Your payment could not be processed. Please try again or use a different payment method.
          </p>
          <div className="space-y-3">
            <Button asChild className="w-full bg-orange hover:bg-orange-600">
              <Link href="/checkout">Try Again</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/cart">Back to Cart</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
