-- Migration v3 : ajout des programmes d'entraînement pré-définis
-- À exécuter sur une base existante (le volume mysql_data ne ré-exécute pas init.sql).
-- Exemple : docker exec -i fittrack-mysql mysql -u root -p<password> fittrack < database/migrations/002_add_programs.sql

CREATE TABLE IF NOT EXISTS Program (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  name        VARCHAR(150) NOT NULL,
  level       ENUM('débutant', 'intermédiaire', 'avancé') NOT NULL,
  goal        ENUM('lose', 'maintain', 'gain') NOT NULL,
  description TEXT,
  created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE IF NOT EXISTS ProgramExercise (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  program_id  INT NOT NULL,
  exercise_id INT NOT NULL,
  sets        INT,
  reps        INT,
  position    INT NOT NULL DEFAULT 0,
  FOREIGN KEY (program_id)  REFERENCES Program(id)   ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES Exercise(id)  ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
