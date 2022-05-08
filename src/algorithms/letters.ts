import { bigrams } from './bigrams';
import type { Board, Freqs, Multiplier, Tile } from "../types";

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

// export const bigrams = {
//   ES: 35,
//   IN: 32,
//   ER: 30,
//   TI: 21,
//   TE: 19,
//   RE: 19,
//   NG: 18,
//   AT: 18,
//   ED: 17,
//   ON: 17,
//   EN: 16,
//   ST: 15,
//   IS: 15,
//   LE: 14,
//   RI: 14,
//   LI: 14,
//   RA: 13,
//   AL: 13,
//   AN: 13,
//   NE: 13,
//   OR: 12,
//   AR: 12,
//   SE: 11,
//   IC: 11,
//   NT: 11,
//   DE: 10,
//   RO: 10,
//   LA: 10,
//   IT: 10,
//   IE: 9,
//   SS: 9,
//   RS: 9,
//   DI: 9,
//   IO: 8,
//   NS: 8,
//   CO: 8,
//   ME: 8,
//   TA: 8,
//   EL: 8,
//   AS: 8,
//   HE: 7,
//   LO: 7,
//   LL: 7,
//   ET: 7,
//   TR: 7,
//   NI: 7,
//   TO: 7,
//   CA: 7,
//   VE: 7,
//   OL: 7,
//   MI: 7,
//   OU: 7,
//   SI: 7,
//   UN: 7,
//   PE: 7,
//   IL: 7,
//   MA: 6,
//   CH: 6,
//   LY: 6,
//   EA: 6,
//   NA: 6,
//   TS: 6,
//   ND: 6,
//   AC: 6,
//   GE: 6,
//   US: 5,
//   UR: 5,
//   EC: 5,
//   OS: 5,
//   CE: 5,
//   IA: 5,
//   TH: 5,
//   EM: 5,
//   OM: 5,
//   SH: 5,
//   NC: 5,
//   PR: 5,
//   UL: 5,
//   HO: 5,
//   NO: 5,
//   HI: 5,
//   OT: 4,
//   PO: 4,
//   HA: 4,
//   CI: 4,
//   PA: 4,
//   MO: 4,
//   AM: 4,
//   ID: 4,
//   BL: 4,
//   PI: 4,
//   UT: 4,
//   OP: 4,
//   AB: 4,
//   CT: 4,
//   IZ: 4,
//   FI: 4,
//   PH: 4,
//   AD: 4,
//   OG: 4,
//   SC: 4,
//   GI: 4,
//   CK: 3,
//   EP: 3,
//   EE: 3,
//   SU: 3,
//   AP: 3,
//   GA: 3,
//   OO: 3,
//   DO: 3,
//   KE: 3,
//   RT: 3,
//   IM: 3,
//   OC: 3,
//   AG: 3,
//   EX: 3,
//   IV: 3,
//   SO: 3,
//   SA: 3,
//   SP: 3,
//   ZE: 3,
//   BA: 3,
//   UM: 3,
//   BE: 3,
//   FO: 3,
//   IG: 3,
//   BI: 3,
//   BO: 3,
//   PL: 3,
//   GR: 3,
//   IR: 3,
//   AI: 3,
//   CR: 3,
//   VI: 3,
//   MP: 3,
//   LU: 3,
//   FL: 3,
//   TT: 3,
//   FE: 3,
//   TU: 2,
//   CU: 2,
//   DS: 2,
//   RM: 2,
//   OD: 2,
//   GL: 2,
//   RU: 2,
//   SM: 2,
//   LS: 2,
//   OV: 2,
//   FA: 2,
//   OW: 2,
//   DA: 2,
//   KI: 2,
//   IP: 2,
//   QU: 2,
//   RD: 2,
//   TY: 2,
//   BR: 2,
//   IF: 2,
//   WA: 2,
//   RR: 2,
//   RY: 2,
//   VA: 2,
//   FU: 2,
//   CL: 2,
//   DR: 2,
//   MB: 2,
//   MS: 2,
//   UP: 2,
//   OI: 2,
//   GO: 2,
//   UC: 2,
//   FR: 2,
//   RC: 1,
//   BU: 1,
//   UB: 1,
//   HY: 1,
//   EG: 1,
//   EV: 1,
//   PS: 1,
//   AU: 1,
//   EF: 1,
//   UI: 1,
//   WE: 1,
//   PP: 1,
//   UA: 1,
//   DU: 1,
//   RN: 1,
//   IB: 1,
//   OB: 1,
//   GS: 1,
//   LT: 1,
//   EI: 1,
//   EO: 1,
//   KS: 1,
//   SL: 1,
//   MU: 1,
//   WI: 1,
//   GH: 1,
//   FF: 1,
// }

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
 
let tileId = 0;
export const sample = (
  board: Board,
  sampleSize: number,
  turn = 0
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

  tileId++;

  return [freqs, {
    letter: sampledLetter,
    id: tileId,
    multiplier: sampledMult as Multiplier,
  }];
}

export const scoreWord = (match: Tile[]) => {
  let score = 0;
  let multiplier = 1;
  for (const tile of match) {
    score += getTilePoints(tile.letter)
    multiplier *= tile.multiplier;
  }
  return score * multiplier;
}

export const getTilePoints = (letter: string) => {
  let tilePoints = 0;
  for (let i = 0; i < letter.length; i++) {
    tilePoints += points[letter.charAt(i).toUpperCase()];
  }
  return tilePoints;
}