'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Suspense } from 'react';

function SuccessContent() {
  const searchParams = useSearchParams();
  const orderNumber = searchParams.get('order');

  return (
    <div className="min-h-screen pt-20 flex items-center justify-center bg-muted/30">
      <div className="max-w-md w-full mx-4 text-center">
        <div className="bg-card rounded-2xl p-8 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Payment Successful!</h1>
          <p className="text-muted-foreground mb-4">
            Thank you! Your payment was successful and your order has been confirmed.
          </p>
          {orderNumber && (
            <p className="text-sm text-muted-foreground mb-6">
              Order number: <span className="font-mono font-bold">{orderNumber}</span>
            </p>
          )}
          <div className="space-y-3">
            <Button asChild className="w-full bg-orange hover:bg-orange-600">
              <Link href="/dashboard/orders">View My Orders</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/shop">Continue Shopping</Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <Suspense>
      <SuccessContent />
    </Suspense>
  );
}
