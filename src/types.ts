export type Axis = 'row' | 'col' | 'intersection';

export type Coord = [ number, number ];

export type Match = {
  readonly word: Tile[],
  readonly coords: Coord[],
  readonly axis: Axis,
  readonly score: number,
  readonly intersection?: string,
  readonly intersectingTile?: Tile,
};

export type Freqs<T extends string | number> = Record<T, number>;

export type Multiplier = 1 | 2 | 3;

export type Tile = {
  letter: string,
  id: number,
  multiplier: Multiplier,
}

export type Board = Tile[][];

export type GameRecord = {
  date: string,
  score: number,
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

export type GameState = {
  readonly startedAt: number,
  readonly id: string;
  board: Board;
  words: Match[];
  turn: number;
  remainingSwaps: number;
  shuffles: number;
  streak: number;
  bestStreak: number;
  lost: boolean;
  score: number;
  latestChain: number;
  bestChain: number;
  intersectingTile?: Tile;
  intersection?: Coord;
}

export type HighlightColors = 'green' | 'purple' | 'red' | 'orange';
export type Highlighted = Record<number, HighlightColors>;

export type Flagged = {
  word: string,
  reason: 'insensitive' | 'obscure'
}

export type Feedback = {
  userId?: string,
  feedback: string,
  date: Date,
}

export type AnalyticsReport = {
  gameId: string,
  userId: string,
  duration: number,
  date: string,
  words: string[],
  turns: number,
  bestStreak: number,
  bestChain: number,
  abandoned?: boolean,
}