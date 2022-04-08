import type { Board, Freqs, Multiplier, Tile } from "./types";

export const letterFreqs = {
  'A': 8.4966,
  'B': 2.0720,
  'C': 4.5388,
  'D': 3.3844,
  'E': 11.16078,
  'F': 1.8121,
  'G': 2.4705, 
  'H': 3.0034, 
  'I': 7.5448, 
  'J': 0.1965, 
  'K': 1.1016, 
  'L': 5.4893, 
  'M': 3.0129, 
  'N': 6.6544, 
  'O': 7.1635, 
  'P': 3.1671, 
  'Q': 0.1962, 
  'R': 7.5809, 
  'S': 5.7351, 
  'T': 6.9509, 
  'U': 3.6308, 
  'V': 1.0074, 
  'W': 1.2899, 
  'X': 0.2902, 
  'Y': 1.7779, 
  'Z': 0.2722, 
}

export const bigrams = {
  'TH': 0.04,
  'HE': 0.04,
  'IN': 0.04,
  'EN': 0.04,
  'NT': 0.04,
  'RE': 0.04,
  'ER': 0.04,
  'AN': 0.04,
  'TI': 0.04,
  'ES': 0.04,
  'ON': 0.04,
  'AT': 0.04,
  'SE': 0.04,
  'ND': 0.04,
  'OR': 0.04,
  'AR': 0.04,
  'AL': 0.04,
  'TE': 0.04,
  'CO': 0.04,
  'DE': 0.04,
  'TO': 0.04,
  'RA': 0.04,
  'ET': 0.04,
  'ED': 0.04,
  'IT': 0.04,
  'SA': 0.04,
  'EM': 0.04,
  'RO': 0.04, 
  'NN': 0.03, 
  'NG': 0.03, 
  'SH': 0.03, 
  'CH': 0.03, 
  'QU': 0.01, 
}

export const points = {
  'TH': 5,
  'HE': 5,
  'IN': 2,
  'EN': 2,
  'NT': 2,
  'RE': 2,
  'ER': 2,
  'AN': 2,
  'TI': 2,
  'ES': 2,
  'ON': 2,
  'AT': 2,
  'SE': 2,
  'ND': 3,
  'OR': 2,
  'AR': 2,
  'AL': 2,
  'TE': 2,
  'CO': 4,
  'DE': 3,
  'TO': 2,
  'RA': 2,
  'ET': 2,
  'ED': 3,
  'IT': 2,
  'SA': 2,
  'EM': 4,
  'RO': 2, 
  'NN': 2, 
  'NG': 3,
  'SH': 5,
  'CH': 7,
  'QU': 11,
  'A': 1,
  'B': 3,
  'C': 3,
  'D': 2,
  'E': 1,
  'F': 4,
  'G': 2,
  'H': 4,
  'I': 1,
  'J': 8,
  'K': 5,
  'L': 1,
  'M': 3,
  'N': 1,
  'O': 1,
  'P': 3,
  'Q': 10,
  'R': 1,
  'S': 1,
  'T': 1,
  'U': 1,
  'V': 4,
  'W': 4,
  'X': 8,
  'Y': 4,
  'Z': 10,
}

export const symbols = [
 '🇦',
 '🇧',
 '🇨',
 '🇩',
 '🇪',
 '🇫',
 '🇬',
 '🇭',
 '🇮',
 '🇯',
 '🇰',
 '🇱',
 '🇲',
 '🇳',
 '🇴',
 '🇵',
 '🇶',
 '🇷',
 '🇸',
 '🇹',
 '🇺',
 '🇻',
 '🇼',
 '🇽',
 '🇾',
 '🇿',
]

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

const sigmoid = (z: number, k: number = 2) => {
  return 1 / (1 + Math.exp(-z/k));
}

const updateFreqs = <T extends string | number>(globalFreqs: Freqs<T>, boardFreqs: Freqs<T>, k: number) => {
  const updatedFreqs = {};
  const total = Object.values(boardFreqs).reduce((a: number, b: number) => a + b) as number;
  Object.entries(globalFreqs).forEach(([value, globalFreq]) => {
    // frequency as percentage
    const freq = 100 * (boardFreqs[value] ?? 0) / total;
    const diff = (globalFreq as number) - freq;
    const posterior = sigmoid(diff, k);
    updatedFreqs[value] = posterior;
  });
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
export const sample = (board: Board, sampleSize: number, turn = 0): Tile => {

  let freqs: Record<string, number>;
  let mFreqs:  Record<number, number>;
   
  if (board.length) {
    const { total, letterCounts, multiplierCounts } = countLetters(board);
    freqs = updateFreqs(letterFreqs, letterCounts, 1);
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
  // testing bigrams
  if (turn > 10) {
    freqs = {...freqs, ...bigrams};
  }
  const cdf = getCDF(freqs);
  const sampledLetter = sampleCDF(cdf);
  
  const mCDF = getCDF(mFreqs);
  const sampledMult = parseInt(sampleCDF(mCDF) as any);

  tileId++;

  return {
    letter: sampledLetter,
    id: tileId,
    multiplier: sampledMult as Multiplier,
  };
}

export const scoreWord = (match: Tile[]) => {
  let score = 0;
  let multiplier = 1;
  for (const tile of match) {
    score += points[tile.letter.toUpperCase()];
    multiplier *= tile.multiplier;
  }
  return score * multiplier;
}