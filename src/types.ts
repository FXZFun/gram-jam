export type Axis = 'row' | 'col' | 'intersection';

export type Coord = [ number, number ];

export type Match = {
  readonly word: Tile[],
  readonly coords: Coord[],
  readonly axis: Axis,
  readonly score: number,
  readonly intersection?: string,
  readonly intersectingIds: number[],
};

export type Freqs<T extends string | number> = Record<T, number>;

export type Tile = {
  letter: string,
  id: number,
  multiplier: number,
}

export type Board = Tile[][];

export type Intersections = Record<number, { tile: Tile, coord: Coord }>;

export type GameRecord = {
  date: string,
  score: number,
}

export type SLeaderboardEntry = {
  id: string;
  userId?: string;
  gameId: string;
  userName: string;
  score: number;
  bestStreak: number;
  bestChain: number;
  bestWord: Tile[];
  numWords: number;
  numTurns: number;
  date: string;
}

export type LeaderboardEntry = {
  userId?: string;
  gameId: string;
  name: string;
  score: number;
  bestStreak: number;
  bestChain: number;
  bestWord: Tile[];
  numWords: number;
  turns: number;
  date: string | { seconds: number };
}

export type Stats = {
  gamesPlayed: number;
  totalWordsPlayed: number;
  wordScoreFreqs: Record<number, number>;
  wordLengths: Record<number, number>;
}

export type GameState = {
  readonly startedAt: number;
  readonly id: string;
  board: Board;
  latestWord?: Tile[];
  latestScore?: number;
  highlighted: Highlighted;
  intersections: Intersections;
  words: Match[];
  turn: number;
  streak: number;
  streakLevel: number;
  streakProgress: number;
  streakInterval: number;
  remainingSwaps: number;
  shuffles: number;
  bestStreak: number;
  lost: boolean;
  score: number;
  latestChain: number;
  bestChain: number;
  marquee?: string;
}

export type HighlightColors = 'green' | 'purple' | 'red' | 'orange';
export type Highlighted = Record<number, HighlightColors>;

export type Flagged = {
  word: string,
  userId?: string,
  reason: 'insensitive' | 'obscure'
}

export type Feedback = {
  userId?: string,
  feedback: string,
}

export type Turn = {
  durationSeconds: number,
  words: Match[],
  coords: Coord[],
}

export type AnalyticsReport = {
  id: string,
  userId: string,
  userName?: string,
  date: string,
  score: number,
  durationSeconds: number,
  words: string[],
  turns: Turn[],
  bestStreak: number,
  bestChain: number,
  abandoned?: boolean,
}

export type InfiniteProps = {
  detail: {
    loaded: () => void,
    complete: () => void,
  }
}
