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
}

export const points = {
  'TH': 1,
  'HE': 1,
  'IN': 1,
  'EN': 1,
  'NT': 1,
  'RE': 1,
  'ER': 1,
  'AN': 1,
  'TI': 1,
  'ES': 1,
  'ON': 1,
  'AT': 1,
  'SE': 1,
  'ND': 1,
  'OR': 1,
  'AR': 1,
  'AL': 1,
  'TE': 1,
  'CO': 1,
  'DE': 1,
  'TO': 1,
  'RA': 1,
  'ET': 1,
  'ED': 1,
  'IT': 1,
  'SA': 1,
  'EM': 1,
  'RO': 1, 
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

const getCumSum = (letterFreqs: Freqs) => {
  const cum: Array<{ letter: string, weight: number }> = [];
  let sum = 0;
  Object.entries(letterFreqs).forEach(([letter, freq]) => {
    sum += freq;
    cum.push({ letter, weight: sum });
  });
  return cum;
}

const countLetters = (board: Board) => {
  const counts = {};
  let total = 0;
  for (const row of board) {
    for (const { letter, id } of row) {
      if (letter in counts) {
        counts[letter]++;
      } else {
        counts[letter] = 1;
      }
      total++;
    }
  }
  return counts;
}

const updateFreqs = (globalFreqs: Freqs, boardFreqs: Freqs) => {
  const updatedFreqs = {};
  Object.entries(globalFreqs).forEach(([letter, globalFreq]) => {
    const smoothed = (boardFreqs[letter] ?? 0) + 1;
    // more intelligent sampling to keep board fairly distributed
    updatedFreqs[letter] = globalFreq / Math.sqrt(smoothed);
  });
  return updatedFreqs;
}
 
let tileId = 0;
export const sample = (board: Board): Tile => {

  let freqs: Record<string, number>;
   
  if (board.length) {
    const boardFreqs = countLetters(board);
    freqs = updateFreqs(letterFreqs, boardFreqs);
  } else {
      freqs = letterFreqs
  }
  // testing bigrams
  if (true) {
    freqs = {...freqs, ...bigrams};
  }
  const cum = getCumSum(freqs);
  const sum = cum.slice(-1)[0].weight;
  const sampleWeight = Math.random() * sum;
  let sampledLetter: string | undefined = undefined;

  for (const { letter, weight } of cum) {
    if (weight > sampleWeight) {
      sampledLetter = letter;
      break;
    }
  }
  if (sampledLetter.length > 1) console.log(sampledLetter);
  tileId++;
  const multSeed = Math.random();
  let multiplier: Multiplier = 1;
  if (multSeed > 0.97) multiplier = 3;
  else if (multSeed > 0.93) multiplier = 2;
  // TODO fix weighting
  return {
    letter: sampledLetter,
    id: tileId,
    multiplier
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