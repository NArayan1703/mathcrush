export interface User {
  id: number;
  name: string;
  email: string;
  total_points: number;
  current_level: number;
  total_stars: number;
}

export interface Level {
  id: number;
  order_number: number;
  title: string;
  topic: string;
  difficulty: string;
  is_unlocked: boolean;
  is_completed: boolean;
  stars: number;
  score: number;
}

export interface Question {
  id: number;
  level_id: number;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_answer: 'A' | 'B' | 'C' | 'D';
  explanation: string;
}

export interface ProgressRecord {
  id: number;
  user_id: number;
  level_id: number;
  stars: number;
  score: number;
  completed: boolean;
  title: string;
  topic: string;
  order_number: number;
}

export interface LeaderboardEntry {
  rank: number;
  id: number;
  name: string;
  total_points: number;
  current_level: number;
  total_stars: number;
  is_current_user?: boolean;
}
