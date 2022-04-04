export type Axis = 'row' | 'col';

export type Match = {
  readonly word: Tile[],
  readonly i: number,
  readonly j: number,
  readonly axis: Axis,
  readonly score: number,
};

export type Freqs = Record<string, number>;

export type Multiplier = 1 | 2 | 3;

export type Tile = {
  letter: string,
  id: number,
  multiplier: Multiplier,
}

export type Board = Array<Array<Tile>>;
