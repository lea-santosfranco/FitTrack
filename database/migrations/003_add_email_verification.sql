-- Migration v4 : ajout de la vérification d'email
-- À exécuter sur une base existante (le volume mysql_data ne ré-exécute pas init.sql).
-- Exemple : docker exec -i fittrack-mysql mysql -u root -p<password> fittrack < database/migrations/003_add_email_verification.sql

ALTER TABLE User
  ADD COLUMN email_verified             TINYINT(1) NOT NULL DEFAULT 0 AFTER role,
  ADD COLUMN verification_token         VARCHAR(255) AFTER email_verified,
  ADD COLUMN verification_token_expires DATETIME AFTER verification_token;

-- Les comptes déjà existants sont considérés comme vérifiés pour ne pas bloquer
-- les utilisateurs actuels lors du déploiement de cette fonctionnalité.
UPDATE User SET email_verified = 1 WHERE email_verified = 0;
