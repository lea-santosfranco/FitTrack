-- Encodage UTF-8
SET NAMES utf8mb4;
SET CHARACTER SET utf8mb4;

-- ━━━━ TABLE : User ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE TABLE IF NOT EXISTS User (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  username   VARCHAR(50)  NOT NULL UNIQUE,
  email      VARCHAR(100) NOT NULL UNIQUE,
  password   VARCHAR(255) NOT NULL,
  weight     DECIMAL(5,2),
  goal       ENUM('lose', 'maintain', 'gain') DEFAULT 'maintain',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ━━━━ TABLE : Exercise ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE TABLE IF NOT EXISTS Exercise (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  category     ENUM('Musculation', 'Cardio', 'Flexibilité') NOT NULL,
  muscle_group VARCHAR(100),
  description  TEXT,
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ━━━━ TABLE : Workout ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE TABLE IF NOT EXISTS Workout (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  title      VARCHAR(150) NOT NULL,
  date       DATE NOT NULL,
  duration   INT,
  notes      TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES User(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ━━━━ TABLE : WorkoutExercise ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CREATE TABLE IF NOT EXISTS WorkoutExercise (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  workout_id  INT NOT NULL,
  exercise_id INT NOT NULL,
  sets        INT,
  reps        INT,
  weight_used DECIMAL(6,2),
  duration    INT,
  FOREIGN KEY (workout_id)  REFERENCES Workout(id)  ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES Exercise(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ━━━━ DONNÉES DE TEST : 20 exercices ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

-- Musculation (10 exercices)
INSERT INTO Exercise (name, category, muscle_group, description) VALUES
('Développé couché',   'Musculation', 'Pectoraux, Triceps',      'Allongé sur un banc, descendez la barre jusqu\'à la poitrine puis remontez.'),
('Squat barre',        'Musculation', 'Quadriceps, Fessiers',    'Avec la barre sur les épaules, descendez jusqu\'à avoir les cuisses parallèles au sol.'),
('Soulevé de terre',   'Musculation', 'Dos, Ischio-jambiers',    'Tirez la barre du sol jusqu\'à la position debout, dos droit.'),
('Tractions',          'Musculation', 'Dos, Biceps',             'Suspendez-vous à une barre et tirez votre corps vers le haut jusqu\'au menton.'),
('Développé épaules',  'Musculation', 'Épaules, Triceps',        'Assis ou debout, poussez la barre ou les haltères au-dessus de la tête.'),
('Curl biceps',        'Musculation', 'Biceps',                  'Debout, fléchissez les coudes pour amener les haltères vers les épaules.'),
('Dips',               'Musculation', 'Triceps, Pectoraux',      'Sur des barres parallèles, descendez le corps en fléchissant les coudes puis remontez.'),
('Rowing barre',       'Musculation', 'Dos, Biceps',             'Penché en avant, tirez la barre vers le bas de l\'abdomen.'),
('Presse à cuisses',   'Musculation', 'Quadriceps, Fessiers',    'Assis dans la machine, poussez la plateforme avec les pieds.'),
('Crunch abdominaux',  'Musculation', 'Abdominaux',              'Allongé sur le dos, contractez les abdos pour rapprocher les épaules du bassin.');

-- Cardio (5 exercices)
INSERT INTO Exercise (name, category, muscle_group, description) VALUES
('Course à pied',        'Cardio', NULL, 'Courir à une allure modérée pour améliorer l\'endurance cardiovasculaire.'),
('Vélo stationnaire',    'Cardio', NULL, 'Pédalez à intensité variable pour un entraînement cardio sans impact.'),
('Corde à sauter',       'Cardio', NULL, 'Sautez à la corde en maintenant un rythme régulier.'),
('Rameur',               'Cardio', NULL, 'Utilisez le rameur en poussant avec les jambes et en tirant avec les bras.'),
('Burpees',              'Cardio', NULL, 'Enchaînez pompe, saut en étoile et retour au sol pour un effort cardio intense.');

-- Flexibilité (5 exercices)
INSERT INTO Exercise (name, category, muscle_group, description) VALUES
('Étirements ischio-jambiers', 'Flexibilité', 'Ischio-jambiers', 'Assis, jambes tendues, penchez-vous vers l\'avant pour étirer l\'arrière des cuisses.'),
('Étirement quadriceps',       'Flexibilité', 'Quadriceps',       'Debout, pliez un genou et tenez votre pied derrière vous.'),
('Étirement épaules',          'Flexibilité', 'Épaules',          'Passez un bras devant la poitrine et maintenez avec l\'autre bras.'),
('Yoga - Chien tête en bas',   'Flexibilité', 'Dos, Ischio-jambiers', 'En position de triangle inversé, poussez les hanches vers le haut.'),
('Pigeon (hanches)',            'Flexibilité', 'Hanches, Fessiers', 'Depuis une position à quatre pattes, ramenez un genou vers l\'avant et allongez l\'autre jambe.');
