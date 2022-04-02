import type { Board, Freqs } from "./types";

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

export const points = {
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

const getCumSum = (letterFreqs: Freqs): [ number[], number ] => {
  const cum: number[] = [];
  let sum = 0;
  Object.entries(letterFreqs).forEach(([l, f]) => {
    sum += f;
    cum.push(sum);
  });
  return [ cum, sum ];
}

const [ cum, sum ] = getCumSum(letterFreqs);

const countLetters = (board: Board) => {
  const counts = {};
  let total = 0;
  for (const row of board) {
    for (const [ letter, id ] of row) {
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
    updatedFreqs[letter] = globalFreq / Math.sqrt(smoothed);
  });
  return getCumSum(updatedFreqs);
}
 
let tileId = 0;
export const sample = (board: Board): [string, number] => {
  let cum: number[], sum: number;
  if (board.length) {
    const boardFreqs = countLetters(board);
    [ cum, sum ] = updateFreqs(letterFreqs, boardFreqs);
  } else {
    [ cum, sum ] = getCumSum(letterFreqs);
  }
  const s = Math.random() * sum;
  let l: string | undefined = undefined;
  const letters = Object.keys(letterFreqs);
  cum.forEach((c, i) => {
    if (!l && c > s) l = letters[i];
  });
  tileId++;
  return [l, tileId];
}

export const scoreWord = (word: string) => {
  let score = 0;
  for (let i = 0; i < word.length; i++) {
    score += points[word.charAt(i).toUpperCase()];
  }
  return score;
}