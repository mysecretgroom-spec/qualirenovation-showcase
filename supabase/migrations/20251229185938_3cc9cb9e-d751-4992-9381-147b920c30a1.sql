-- Fix RESTRICTIVE policies to be PERMISSIVE for public tables
-- houzz_projects
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON houzz_projects;
CREATE POLICY "Projects are viewable by everyone"
  ON houzz_projects FOR SELECT TO public USING (true);

-- houzz_project_images
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON houzz_project_images;
CREATE POLICY "Project images are viewable by everyone"
  ON houzz_project_images FOR SELECT TO public USING (true);

-- houzz_testimonials
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON houzz_testimonials;
CREATE POLICY "Testimonials are viewable by everyone"
  ON houzz_testimonials FOR SELECT TO public USING (true);

DROP POLICY IF EXISTS "Admins can update testimonials" ON houzz_testimonials;
CREATE POLICY "Admins can update testimonials"
  ON houzz_testimonials FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- import_queue - fix to be PERMISSIVE
DROP POLICY IF EXISTS "Only admins can view import queue" ON import_queue;
CREATE POLICY "Only admins can view import queue"
  ON import_queue FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can insert into import queue" ON import_queue;
CREATE POLICY "Only admins can insert into import queue"
  ON import_queue FOR INSERT TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can update import queue" ON import_queue;
CREATE POLICY "Only admins can update import queue"
  ON import_queue FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Only admins can delete from import queue" ON import_queue;
CREATE POLICY "Only admins can delete from import queue"
  ON import_queue FOR DELETE TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- quote_requests - fix to be PERMISSIVE
DROP POLICY IF EXISTS "Anyone can submit a quote request" ON quote_requests;
CREATE POLICY "Anyone can submit a quote request"
  ON quote_requests FOR INSERT TO public
  WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can view all quote requests" ON quote_requests;
CREATE POLICY "Admins can view all quote requests"
  ON quote_requests FOR SELECT TO authenticated
  USING (has_role(auth.uid(), 'admin'));

DROP POLICY IF EXISTS "Admins can update quote requests" ON quote_requests;
CREATE POLICY "Admins can update quote requests"
  ON quote_requests FOR UPDATE TO authenticated
  USING (has_role(auth.uid(), 'admin'));