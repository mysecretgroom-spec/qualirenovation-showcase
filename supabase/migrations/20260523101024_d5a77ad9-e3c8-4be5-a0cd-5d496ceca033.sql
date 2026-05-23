CREATE POLICY "Accès bucket restreint"
ON storage.objects
FOR SELECT
USING (auth.uid() = owner);