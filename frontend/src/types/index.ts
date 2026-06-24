export interface User {
  id:         number;
  username:   string;
  email:      string;
  weight?:    number;
  goal?:      'lose' | 'maintain' | 'gain';
  created_at: string;
  updated_at: string;
}

export interface Exercise {
  id:           number;
  name:         string;
  category:     'Musculation' | 'Cardio' | 'Flexibilité';
  muscle_group?: string;
  description?:  string;
  created_at:    string;
}

export interface WorkoutExercise {
  we_id:       number;
  id:          number;
  name:        string;
  category:    string;
  muscle_group?: string;
  sets?:       number;
  reps?:       number;
  weight_used?: number;
  duration?:   number;
}

export interface Workout {
  id:             number;
  user_id:        number;
  title:          string;
  date:           string;
  duration?:      number;
  notes?:         string;
  exercise_count?: number;
  exercises?:     WorkoutExercise[];
  created_at:     string;
  updated_at:     string;
}

export interface Stats {
  total_workouts:     number;
  total_duration:     number;
  distinct_exercises: number;
  recent_workouts:    { date: string; title: string; duration: number }[];
  top_exercises:      { name: string; category: string; count: number }[];
  category_breakdown: { category: string; count: number }[];
}

export interface AuthContextType {
  user:     User | null;
  token:    string | null;
  login:    (token: string, user: User) => void;
  logout:   () => void;
  isLoading: boolean;
}
