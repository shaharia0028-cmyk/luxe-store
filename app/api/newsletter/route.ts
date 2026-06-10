import { createServerClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

function ok(data: unknown) {
  return NextResponse.json({ success: true, data });
}

function err(message: string, status = 400) {
  return NextResponse.json({ success: false, message }, { status });
}

export async function POST(request: Request) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return err('Please provide a valid email address');
    }

    const supabase = createServerClient();

    const { error } = await supabase
      .from('newsletter_subscribers')
      .upsert({ email }, { onConflict: 'email', ignoreDuplicates: true });

    if (error) return err('Failed to subscribe. Please try again.', 500);

    return ok({ message: 'Successfully subscribed to newsletter' });
  } catch {
    return err('Internal server error', 500);
  }
}
