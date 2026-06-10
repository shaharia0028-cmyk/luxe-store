-- Newsletter subscribers table
CREATE TABLE public.newsletter_subscribers (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  subscribed_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT true
);

-- Enable RLS
ALTER TABLE public.newsletter_subscribers ENABLE ROW LEVEL SECURITY;

-- RLS Policies (public can insert, no read for non-admins)
CREATE POLICY "newsletter_insert" ON public.newsletter_subscribers FOR INSERT
  TO public WITH CHECK (true);

CREATE POLICY "newsletter_admin" ON public.newsletter_subscribers FOR ALL
  TO authenticated USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
  );