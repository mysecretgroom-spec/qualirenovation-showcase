-- Drop existing policy
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON houzz_testimonials;

-- Recreate policy for both anon and authenticated roles
CREATE POLICY "Testimonials are viewable by everyone"
ON houzz_testimonials
FOR SELECT
TO anon, authenticated
USING (true);

-- Also fix projects and project_images policies
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON houzz_projects;
CREATE POLICY "Projects are viewable by everyone"
ON houzz_projects
FOR SELECT
TO anon, authenticated
USING (true);

DROP POLICY IF EXISTS "Project images are viewable by everyone" ON houzz_project_images;
CREATE POLICY "Project images are viewable by everyone"
ON houzz_project_images
FOR SELECT
TO anon, authenticated
USING (true);