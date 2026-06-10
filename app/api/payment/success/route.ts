import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
  
  try {
    const formData = await request.formData();
    const tranId = formData.get('tran_id') as string;
    const valId = formData.get('val_id') as string;
    const status = formData.get('status') as string;
    const orderId = formData.get('value_a') as string;

    if (status !== 'VALID' && status !== 'VALIDATED') {
      return NextResponse.redirect(siteUrl + '/payment/fail');
    }

    // Verify with SSLCommerz
    const storeId = process.env.SSLCOMMERZ_STORE_ID;
    const storePassword = process.env.SSLCOMMERZ_STORE_PASSWORD;
    const isLive = process.env.SSLCOMMERZ_IS_LIVE === 'true';

    const verifyUrl = isLive
      ? 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php'
      : 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php';

    const verifyResponse = await fetch(
      verifyUrl + '?val_id=' + valId + '&store_id=' + storeId + '&store_passwd=' + storePassword + '&format=json'
    );
    const verifyData = await verifyResponse.json();

    if (verifyData.status !== 'VALID' && verifyData.status !== 'VALIDATED') {
      return NextResponse.redirect(siteUrl + '/payment/fail');
    }

    const supabase = createServerClient();

    // Update order to paid
    await supabase
      .from('orders')
      .update({
        status: 'processing',
        payment_status: 'paid',
        notes: 'SSLCommerz TranID: ' + tranId,
      })
      .eq('id', orderId);

    // Get order user and clear their cart
    const { data: order } = await supabase
      .from('orders')
      .select('user_id')
      .eq('id', orderId)
      .single();

    if (order?.user_id) {
      await supabase.from('cart').delete().eq('user_id', order.user_id);
    }

    return NextResponse.redirect(siteUrl + '/payment/success?order=' + tranId);
  } catch (error) {
    console.error('Payment success error:', error);
    return NextResponse.redirect(siteUrl + '/payment/fail');
  }
}
