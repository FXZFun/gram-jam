export type Board = Array<Array<[string, number]>>;

export type Axis = 'row' | 'col';

export type Match = {
  readonly word: string,
  readonly i: number,
  readonly j: number,
  readonly axis: Axis
};