import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const status = formData.get('status') as string;
    const orderId = formData.get('value_a') as string;
    const tranId = formData.get('tran_id') as string;

    if (!orderId) return NextResponse.json({ ok: true });

    const supabase = createServerClient();

    if (status === 'VALID' || status === 'VALIDATED') {
      await supabase
        .from('orders')
        .update({ status: 'processing', payment_status: 'paid', notes: 'IPN: ' + tranId })
        .eq('id', orderId);
    } else if (status === 'FAILED') {
      await supabase
        .from('orders')
        .update({ status: 'cancelled', payment_status: 'failed' })
        .eq('id', orderId);
    }
  } catch (error) {
    console.error('IPN error:', error);
  }
  return NextResponse.json({ ok: true });
}
