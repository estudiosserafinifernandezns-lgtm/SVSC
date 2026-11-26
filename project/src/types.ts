export type Category =
  | 'streamers'
  | 'creadores'
  | 'famosos'
  | 'politicos'
  | 'cientificos'
  | 'filosofos'
  | 'internet';

export interface Person {
  name: string;
  category: Category;
  profession: string;
  imageUrl: string;
}

export interface Quote {
  id: number;
  text: string;
  originalText?: string;
  originalLanguage?: string;
  author: Person;
  decoy: Person;
  source: string;
  sourceUrl?: string;
  context?: string;
  isTranslation?: boolean;
  isFictional?: boolean;
}

export interface GameState {
  score: number;
  streak: number;
  bestStreak: number;
  lives: number;
  startTime: number;
  gameId: number;
  usedQuoteIds: number[];
  lastPersons: string[];
}

export type Screen =
  | 'start'
  | 'game'
  | 'result'
  | 'leaderboard'
  | 'community'
  | 'support'
  | 'mp-menu'
  | 'mp-lobby'
  | 'mp-game'
  | 'mp-result';
