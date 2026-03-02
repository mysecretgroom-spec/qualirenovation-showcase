-- Réordonner : après (0,1,2), démolition (3), avant (4,5,6), duplicates (7,8)

-- Photos "Après" → positions 0, 1, 2
UPDATE houzz_project_images SET image_order = 0 WHERE id = '9caf631a-c875-452e-aa92-6c48955c9fc2'; -- Résultat parquet
UPDATE houzz_project_images SET image_order = 1 WHERE id = '4d007b65-6257-4949-a418-4b0e4ee3279b'; -- Pièce ouverte
UPDATE houzz_project_images SET image_order = 2 WHERE id = '2dd01ea6-f567-4b63-b024-c71cf09105ca'; -- Vue salon

-- Photo démolition → position 3
UPDATE houzz_project_images SET image_order = 3 WHERE id = '38b3c5b8-eb58-4d6b-ae29-8322442aae9b'; -- Pièce de vie lustre

-- Photos "Avant" → positions 4, 5, 6 avec références mises à jour
UPDATE houzz_project_images SET image_order = 4, caption = 'Avant travaux|0' WHERE id = 'e1cda639-83e4-4b6a-84e3-dc5458512beb';
UPDATE houzz_project_images SET image_order = 5, caption = 'Avant travaux|1' WHERE id = '6ff21735-94a1-4733-a547-deb8da1bb44f';
UPDATE houzz_project_images SET image_order = 6, caption = 'Avant travaux|2' WHERE id = 'e5abd469-d07d-4c1a-a009-5bceae644b3e';

-- Duplicates avant → positions 7, 8 avec références mises à jour
UPDATE houzz_project_images SET image_order = 7, caption = 'Avant travaux|0' WHERE id = '329ff5e3-0281-41c5-a885-89aa3eab86a9';
UPDATE houzz_project_images SET image_order = 8, caption = 'Avant travaux|1' WHERE id = 'c04e2b33-58e2-44d4-a04a-1a23109b28d6';