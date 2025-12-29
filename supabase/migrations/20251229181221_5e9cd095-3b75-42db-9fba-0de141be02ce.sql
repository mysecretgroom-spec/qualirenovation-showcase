-- Supprimer l'ancienne politique restrictive
DROP POLICY IF EXISTS "Testimonials are viewable by everyone" ON houzz_testimonials;

-- Créer une nouvelle politique permissive
CREATE POLICY "Testimonials are viewable by everyone"
  ON houzz_testimonials
  FOR SELECT
  TO public
  USING (true);