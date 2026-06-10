import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  try {
    const formData = await request.formData();
    const orderId = formData.get('value_a') as string;
    if (orderId) {
      const supabase = createServerClient();
      await supabase
        .from('orders')
        .update({ status: 'cancelled', payment_status: 'failed' })
        .eq('id', orderId);
    }
  } catch (error) {
    console.error('Payment fail handler error:', error);
  }
  return NextResponse.redirect(siteUrl + '/payment/fail');
}
