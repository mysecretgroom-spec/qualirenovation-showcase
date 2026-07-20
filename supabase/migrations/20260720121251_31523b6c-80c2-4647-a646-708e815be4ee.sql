
-- ============ SEO KEYWORDS ============
CREATE TABLE public.seo_keywords (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword TEXT NOT NULL,
  target_url TEXT,
  category TEXT,
  search_volume INTEGER,
  difficulty INTEGER,
  intent TEXT CHECK (intent IN ('informational','commercial','transactional','navigational')),
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  status TEXT DEFAULT 'tracking' CHECK (status IN ('tracking','paused','archived')),
  notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(keyword, target_url)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_keywords TO authenticated;
GRANT ALL ON public.seo_keywords TO service_role;
ALTER TABLE public.seo_keywords ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_keywords" ON public.seo_keywords
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO RANKINGS (historique GSC) ============
CREATE TABLE public.seo_rankings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  keyword_id UUID REFERENCES public.seo_keywords(id) ON DELETE CASCADE,
  keyword TEXT NOT NULL,
  page_url TEXT,
  position NUMERIC,
  impressions INTEGER DEFAULT 0,
  clicks INTEGER DEFAULT 0,
  ctr NUMERIC,
  date DATE NOT NULL,
  device TEXT,
  country TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_rankings_keyword_date ON public.seo_rankings(keyword, date DESC);
CREATE INDEX idx_seo_rankings_date ON public.seo_rankings(date DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_rankings TO authenticated;
GRANT ALL ON public.seo_rankings TO service_role;
ALTER TABLE public.seo_rankings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_rankings" ON public.seo_rankings
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO OPPORTUNITIES ============
CREATE TABLE public.seo_opportunities (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  keyword TEXT,
  page_url TEXT,
  score NUMERIC,
  title TEXT NOT NULL,
  description TEXT,
  recommended_action TEXT,
  status TEXT DEFAULT 'open' CHECK (status IN ('open','in_progress','done','dismissed')),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_opportunities TO authenticated;
GRANT ALL ON public.seo_opportunities TO service_role;
ALTER TABLE public.seo_opportunities ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_opportunities" ON public.seo_opportunities
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO MONTHLY PLANS ============
CREATE TABLE public.seo_monthly_plans (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  month INTEGER NOT NULL CHECK (month BETWEEN 1 AND 12),
  year INTEGER NOT NULL,
  title TEXT,
  objectives TEXT,
  ai_summary TEXT,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft','active','completed','archived')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE(month, year)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_monthly_plans TO authenticated;
GRANT ALL ON public.seo_monthly_plans TO service_role;
ALTER TABLE public.seo_monthly_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_monthly_plans" ON public.seo_monthly_plans
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO ACTIONS ============
CREATE TABLE public.seo_actions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plan_id UUID REFERENCES public.seo_monthly_plans(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  action_type TEXT,
  priority TEXT DEFAULT 'medium' CHECK (priority IN ('low','medium','high','critical')),
  due_date DATE,
  status TEXT DEFAULT 'todo' CHECK (status IN ('todo','in_progress','done','skipped')),
  result TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_actions TO authenticated;
GRANT ALL ON public.seo_actions TO service_role;
ALTER TABLE public.seo_actions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage seo_actions" ON public.seo_actions
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ BLOG CATEGORIES ============
CREATE TABLE public.blog_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT ON public.blog_categories TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_categories TO authenticated;
GRANT ALL ON public.blog_categories TO service_role;
ALTER TABLE public.blog_categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON public.blog_categories
  FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admins manage categories" ON public.blog_categories
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ BLOG POSTS ============
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content_markdown TEXT,
  content_html TEXT,
  cover_image TEXT,
  category_id UUID REFERENCES public.blog_categories(id) ON DELETE SET NULL,
  keywords TEXT[],
  meta_title TEXT,
  meta_description TEXT,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','scheduled','published','archived')),
  published_at TIMESTAMPTZ,
  scheduled_for TIMESTAMPTZ,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  author_name TEXT,
  ai_generated BOOLEAN DEFAULT false,
  view_count INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_blog_posts_status_pub ON public.blog_posts(status, published_at DESC);
GRANT SELECT ON public.blog_posts TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.blog_posts TO authenticated;
GRANT ALL ON public.blog_posts TO service_role;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public reads published posts" ON public.blog_posts
  FOR SELECT TO anon, authenticated
  USING (status = 'published' AND published_at IS NOT NULL AND published_at <= now());
CREATE POLICY "Admins manage posts" ON public.blog_posts
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO AI CITATIONS ============
CREATE TABLE public.seo_ai_citations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ai_source TEXT NOT NULL,
  query TEXT,
  excerpt TEXT,
  cited_url TEXT,
  sentiment TEXT,
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_ai_citations TO authenticated;
GRANT ALL ON public.seo_ai_citations TO service_role;
ALTER TABLE public.seo_ai_citations ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage citations" ON public.seo_ai_citations
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ SEO NOTIFICATIONS ============
CREATE TABLE public.seo_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT,
  link TEXT,
  severity TEXT DEFAULT 'info' CHECK (severity IN ('info','success','warning','critical')),
  read BOOLEAN DEFAULT false,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_seo_notif_created ON public.seo_notifications(created_at DESC);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.seo_notifications TO authenticated;
GRANT ALL ON public.seo_notifications TO service_role;
ALTER TABLE public.seo_notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Admins manage notifications" ON public.seo_notifications
  FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- ============ TRIGGERS updated_at ============
CREATE TRIGGER trg_seo_keywords_updated BEFORE UPDATE ON public.seo_keywords
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_seo_opportunities_updated BEFORE UPDATE ON public.seo_opportunities
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_seo_monthly_plans_updated BEFORE UPDATE ON public.seo_monthly_plans
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_seo_actions_updated BEFORE UPDATE ON public.seo_actions
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_blog_categories_updated BEFORE UPDATE ON public.blog_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER trg_blog_posts_updated BEFORE UPDATE ON public.blog_posts
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
