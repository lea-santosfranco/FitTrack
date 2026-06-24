-- Migration v2 : ajout du rôle utilisateur (user/admin)
-- À exécuter sur une base existante (le volume mysql_data ne ré-exécute pas init.sql).
-- Exemple : docker exec -i fittrack-mysql mysql -u root -p<password> fittrack < database/migrations/001_add_role.sql

ALTER TABLE User
  ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER goal;

-- Promouvoir le premier compte créé en administrateur (à adapter si besoin)
UPDATE User SET role = 'admin' WHERE id = 1;
