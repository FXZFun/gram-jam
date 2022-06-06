import { bigrams } from './bigrams';
import type { Board, Freqs, Multiplier, Tile } from "../types";
import { getTileId } from '../store';

export const dictionaryFreqs = {
  A: 8.4966,
  B: 2.0720,
  C: 4.5388,
  D: 3.3844,
  E: 11.16078,
  F: 1.8121,
  G: 2.4705, 
  H: 3.0034, 
  I: 7.5448, 
  J: 0.1965, 
  K: 1.1016, 
  L: 5.4893, 
  M: 3.0129, 
  N: 6.6544, 
  O: 7.1635, 
  P: 3.1671, 
  Q: 0.1962, 
  R: 7.5809, 
  S: 5.7351, 
  T: 6.9509, 
  U: 3.6308, 
  V: 1.0074, 
  W: 1.2899, 
  X: 0.2902, 
  Y: 1.7779, 
  Z: 0.2722, 
}

export const bananagramFreqs = {
  A: 13,
  B: 3,
  C: 3,
  D: 6,
  E: 18,
  F: 3,
  G: 4,
  H: 3,
  I: 12,
  J: 2,
  K: 2,
  L: 5,
  M: 3,
  N: 8,
  O: 11,
  P: 3,
  Q: 2,
  R: 9,
  S: 6,
  T: 9,
  U: 6,
  V: 3,
  W: 3,
  X: 2,
  Y: 3,
  Z: 2,
}

const letterFreqs = dictionaryFreqs;

export const points = {
  A: 1,
  B: 3,
  C: 3,
  D: 2,
  E: 1,
  F: 4,
  G: 2,
  H: 4,
  I: 1,
  J: 8,
  K: 5,
  L: 1,
  M: 3,
  N: 1,
  O: 1,
  P: 3,
  Q: 10,
  R: 1,
  S: 1,
  T: 1,
  U: 1,
  V: 4,
  W: 4,
  X: 8,
  Y: 4,
  Z: 10,
}

export const multFreqs = {
  1: 92,
  2: 6,
  3: 2,
}

const getCDF = <T extends string | number>(freqs: Freqs<T>) => {
  const cum: Array<[ T, number ]> = [];
  let sum = 0;
  Object.entries(freqs).forEach(([value, freq]) => {
    sum += freq as number;
    cum.push([ value as T, sum ]);
  });
  return cum;
}

const countLetters = (board: Board) => {
  // smooth letter counts to make rare letters less biased
  const letterCounts: Freqs<string> = Object.fromEntries(Object.keys(letterFreqs).map(l => [l, 1]));
  const multiplierCounts: Freqs<number> = {1: 1, 2: 1, 3: 1};
  let total = 0;
  for (const row of board) {
    for (const tile of row) {
      if (tile) {
        const { letter, multiplier } = tile;
        letterCounts[letter] = (letterCounts[letter] ?? 0) + 1;
        multiplierCounts[multiplier] = (multiplierCounts[multiplier] ?? 0) + 1;
        total++;
      }
    }
  }

  return {
    letterCounts,
    multiplierCounts,
    total,
  };
}

// sigmoid parameters
const K = 0.75;
const OFFSET = 0.2;

const sigmoid = (z: number) => {
  return 1 / (1 + Math.exp(-(z - OFFSET) / K));
}

const updateFreqs = <T extends string | number>(
  globalFreqs: Freqs<T>,
  boardFreqs: Freqs<T>,
) => {
  const updatedFreqs = {};
  const total = Object.values<number>(boardFreqs).reduce((a, b) => a + b);
  for (const [ value, globalFreq ] of Object.entries<number>(globalFreqs)) {
    // frequency as percentage
    const freq = 100 * (boardFreqs[value] ?? 0) / total;
    const diff = globalFreq - freq;
    const posterior = sigmoid(diff);
    updatedFreqs[value] = posterior;
  }
  return updatedFreqs;
}

const sampleCDF = <T extends unknown>(cum: Array<[T, number]>) => {

  const sum = cum.slice(-1)[0][1];
  const sampleWeight = Math.random() * sum;

  for (const [ value, weight ] of cum) {
    if (weight > sampleWeight) {
      return value;
    }
  }
}
 
export const sample = (
  board: Board,
  sampleSize: number,
  turn = 0,
): [Freqs<string>, Tile] => {

  let freqs: Record<string, number>;
  let mFreqs:  Record<number, number>;
   
  if (board.length) {
    const { total, letterCounts, multiplierCounts } = countLetters(board);
    freqs = updateFreqs(letterFreqs, letterCounts);
    // console.log(Object.values(freqs).reduce((a, b) => a + b) / Object.keys(freqs).length);
    // console.log(Object.entries(freqs).sort((a, b) => +b[1] - +a[1]))
    mFreqs = {...multFreqs}; //updateFreqs(multFreqs, multiplierCounts, 0.5);
    if (multiplierCounts[2] > 5) {
      mFreqs[2] = 0;
    } if (multiplierCounts[3] > 2) {
      mFreqs[3] = 0;
    }
  } else {
      freqs = letterFreqs;
      mFreqs = multFreqs;
  }
  const cdf = getCDF(freqs);
  let sampledLetter = sampleCDF(cdf);
  // testing bigrams
  if (Math.random() > Math.max(1 - turn / 200, 0.85)) {
    const bigramCDF = getCDF(bigrams[sampledLetter]);
    sampledLetter = sampleCDF(bigramCDF);
  }
  
  const mCDF = getCDF(mFreqs);
  const sampledMult = +sampleCDF(mCDF);

  return [freqs, {
    letter: sampledLetter,
    id: getTileId(),
    multiplier: sampledMult as Multiplier,
  }];
}

export const scoreWord = (match: Tile[]) => {
  let score = 0;
  let multiplier = 1;
  for (const tile of match) {
    score += scoreTile(tile.letter)
    multiplier *= tile.multiplier;
  }
  return score * multiplier;
}

export const scoreTile = (letter: string) => {
  let tilePoints = 0;
  for (let i = 0; i < letter.length; i++) {
    tilePoints += points[letter.charAt(i).toUpperCase()];
  }
  return tilePoints;
}