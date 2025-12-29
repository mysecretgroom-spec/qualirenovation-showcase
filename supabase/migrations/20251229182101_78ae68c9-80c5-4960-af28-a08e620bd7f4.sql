-- =============================================
-- PHASE 1.1 : Sécuriser la table import_queue
-- =============================================

-- Supprimer la politique permissive dangereuse
DROP POLICY IF EXISTS "Allow all operations on import_queue" ON import_queue;

-- Créer des politiques restrictives pour les admins uniquement
CREATE POLICY "Only admins can view import queue"
  ON import_queue FOR SELECT
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can insert into import queue"
  ON import_queue FOR INSERT
  TO authenticated
  WITH CHECK (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can update import queue"
  ON import_queue FOR UPDATE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "Only admins can delete from import queue"
  ON import_queue FOR DELETE
  TO authenticated
  USING (has_role(auth.uid(), 'admin'));

-- =============================================
-- PHASE 2.1 : Corriger les politiques RESTRICTIVE
-- =============================================

-- houzz_projects : supprimer et recréer en PERMISSIVE
DROP POLICY IF EXISTS "Projects are viewable by everyone" ON houzz_projects;
CREATE POLICY "Projects are viewable by everyone"
  ON houzz_projects FOR SELECT
  TO public
  USING (true);

-- houzz_project_images : supprimer et recréer en PERMISSIVE
DROP POLICY IF EXISTS "Project images are viewable by everyone" ON houzz_project_images;
CREATE POLICY "Project images are viewable by everyone"
  ON houzz_project_images FOR SELECT
  TO public
  USING (true);