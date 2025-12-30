-- Fix RLS policies for houzz_testimonials (change from RESTRICTIVE to PERMISSIVE)
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON houzz_testimonials;

CREATE POLICY "Testimonials are viewable by everyone"
ON houzz_testimonials
FOR SELECT
TO public
USING (true);

-- Fix RLS policies for houzz_projects (change from RESTRICTIVE to PERMISSIVE)
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON houzz_projects;

CREATE POLICY "Projects are viewable by everyone"
ON houzz_projects
FOR SELECT
TO public
USING (true);

-- Fix RLS policies for houzz_project_images (change from RESTRICTIVE to PERMISSIVE)
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON houzz_project_images;

CREATE POLICY "Project images are viewable by everyone"
ON houzz_project_images
FOR SELECT
TO public
USING (true);