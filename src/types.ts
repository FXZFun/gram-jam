export type Axis = 'row' | 'col' | 'intersection';

export type Match = {
  readonly word: Tile[],
  readonly i: number,
  readonly j: number,
  readonly coords: Array<[number, number]>,
  readonly axis: Axis,
  readonly score: number,
};

export type Freqs<T extends string | number> = Record<T, number>;

export type Multiplier = 1 | 2 | 3;

export type Tile = {
  letter: string,
  id: number,
  multiplier: Multiplier,
}

export type Board = Array<Array<Tile>>;

export type GameRecord = {
  date: string,
  score: number,
}
