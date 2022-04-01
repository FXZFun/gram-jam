export const letters = {
  'A': 15,
  'B': 1.5,
  'C': 2.7,
  'D': 4.7,
  'E': 18,
  'F': 2.2,
  'G': 2,
  'H': 6.2,
  'I': 10,
  'J': 0.16,
  'K': 0.81,
  'L': 4.0,
  'M': 2.7,
  'N': 6.7,
  'O': 10,
  'P': 1.9,
  'Q': 0.11,
  'R': 5.9,
  'S': 6.2,
  'T': 9.6,
  'U': 5,
  'V': 0.97,
  'W': 2.4,
  'X': 0.15,
  'Y': 5,
  'Z': 0.078,
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

const cum: number[] = [];
let curr = 0;
Object.entries(letters).forEach(([l, f]) => {
  curr += f;
  cum.push(curr);
});
 
let idx = 0;
export const sample = (): [string, number] => {
  const s = Math.random() * curr;
  let l: string | undefined = undefined;
  cum.forEach((c, i) => {
    if (!l && c > s) l = Object.keys(letters)[i];
  });
  idx++;
  return [l, idx];
}

export const scoreWord = (word: string) => {
  let score = 0;
  for (let i = 0; i < word.length; i++) {
    score += points[word.charAt(i).toUpperCase()];
  }
  return score;
}