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
  'TH': 0.05,
  'HE': 0.05,
  'IN': 0.05,
  'EN': 0.05,
  'NT': 0.05,
  'RE': 0.05,
  'ER': 0.05,
  'AN': 0.05,
  'TI': 0.05,
  'ES': 0.05,
  'ON': 0.05,
  'AT': 0.05,
  'SE': 0.05,
  'ND': 0.05,
  'OR': 0.05,
  'AR': 0.05,
  'AL': 0.05,
  'TE': 0.05,
  'CO': 0.05,
  'DE': 0.05,
  'TO': 0.05,
  'RA': 0.05,
  'ET': 0.05,
  'ED': 0.05,
  'IT': 0.05,
  'SA': 0.05,
  'EM': 0.05,
  'RO': 0.05, 
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
  const letterCounts: Freqs<string> = {};
  const multiplierCounts: Freqs<number> = {};
  let total = 0;
  for (const row of board) {
    for (const tile of row) {
      if (tile) {
        const { letter, multiplier } = tile;
        if (letter in letterCounts) {
          letterCounts[letter]++;
        } else {
          letterCounts[letter] = 1;
        }
        if (multiplier in multiplierCounts) {
          multiplierCounts[multiplier]++;
        } else {
          multiplierCounts[multiplier] = 1;
        }
        total++;
      }
    }
  }
  return {
    letterCounts,
    multiplierCounts,
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
    const posterior = sigmoid(diff / Math.sqrt(globalFreq as number), k);
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
export const sample = (board: Board, turn = 0): Tile => {

  let freqs: Record<string, number>;
  let mFreqs:  Record<number, number>;
   
  if (board.length) {
    const { letterCounts, multiplierCounts } = countLetters(board);
    freqs = updateFreqs(letterFreqs, letterCounts, 2);
    mFreqs = updateFreqs(multFreqs, multiplierCounts, 0.5);
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