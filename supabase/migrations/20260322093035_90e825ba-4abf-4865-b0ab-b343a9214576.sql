
CREATE TABLE public.generated_seo_pages (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  meta_description TEXT NOT NULL,
  h1 TEXT NOT NULL,
  headings JSONB NOT NULL DEFAULT '[]'::jsonb,
  body_content TEXT NOT NULL,
  faq JSONB NOT NULL DEFAULT '[]'::jsonb,
  structured_data JSONB,
  internal_links JSONB NOT NULL DEFAULT '[]'::jsonb,
  service_name TEXT NOT NULL,
  city TEXT NOT NULL,
  district TEXT,
  intent TEXT,
  industry TEXT NOT NULL,
  category TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.generated_seo_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read generated pages"
ON public.generated_seo_pages
FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Anyone can insert generated pages"
ON public.generated_seo_pages
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE INDEX idx_seo_pages_slug ON public.generated_seo_pages (slug);
CREATE INDEX idx_seo_pages_service_city ON public.generated_seo_pages (service_name, city);

ALTER PUBLICATION supabase_realtime ADD TABLE public.generated_seo_pages;
