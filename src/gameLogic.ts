import Dictionary from "./dictionary"
import { scoreWord } from "./letters";
import type { Board, Match, Tile } from "./types";

export const findWords = (board: Board) => {
  const words: Match[] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      const match = findWordCol(board, i, j);
      if (match.length) {
        words.push({
          word: match,
          coords: match.map((_, offset) => ([i, j + offset])),
          i, j,
          axis: 'col',
          score: scoreWord(match),
        });
      }
      const match2 = findWordRow(board, i, j);
      if (match2.length) {
        words.push({
          word: match2,
          coords: match2.map((_, offset) => ([i + offset, j])),
          i, j,
          axis: 'row',
          score: scoreWord(match2),
        });
      }
    }
  }

  const mergedWords: Match[] = [];
  const toOmit: Match[] = [];
  for (let i = 0; i < words.length; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const w1 = words[i];
      const w2 = words[j];
      const coords1 = w1.coords.map(coord => coord.join(','));
      const coords2 = new Set(w2.coords.map(coord => coord.join(',')));
      const intersection = new Set(coords1.filter(c => coords2.has(c)));
      if (w1.axis !== w2.axis && intersection.size) {
        mergedWords.push({
          axis: 'intersection',
          word: [...w1.word],
          i: -1,
          j: -1,
          score: w1.score + w2.score,
          coords: [
            ...w1.coords,
            ...w2.coords,
          ]
        });
      } else if (w1.axis === w2.axis) {
        // prefer higher scoring word
        if (w1.word.length < w2.word.length) {
          toOmit.push(w1);
        } else {
          toOmit.push(w2);
        }
      }
    }
  }
  return [
    ...words
      .filter(w => !toOmit.includes(w))
      .filter(w => w.word.length > 3),
    ...mergedWords
  ].sort((a, b) => (b.j - a.j) || (b.word.length - a.word.length));
}

const findWordCol = (board: Board, i: number, j: number): Tile[] => {
  const firstTile = board[i][j];
  const firstLetter = firstTile.letter.toLowerCase();
  let currWord = [firstTile];
  let longestWord = [];
  let node = Dictionary.getNode(firstLetter);
  // scan columns
  for (let j2 = j + 1; j2 < board[0].length && node; j2++) {
    const nextTile = board[i][j2];
    const nextLetter = nextTile.letter.toLowerCase();
    currWord.push(nextTile);
    node = node.children.get(nextLetter.charAt(0));
    if (node && nextLetter.length > 1) {
      node = node.children.get(nextLetter.charAt(1));
    }
    if (node?.terminal) {
      longestWord = [...currWord]
    }
  }
    
  return longestWord;
}

const findWordRow = (board: Board, i: number, j: number): Tile[] => {
  const firstTile = board[i][j];
  const firstLetter = firstTile.letter.toLowerCase();
  let currWord = [firstTile];
  let longestWord = [];
  let node = Dictionary.getNode(firstLetter);
  // scan rows
  for (let i2 = i + 1; i2 < board.length && node; i2++) {
    const nextTile = board[i2][j];
    const nextLetter = nextTile.letter.toLowerCase();
    currWord.push(nextTile);
    node = node.children.get(nextLetter.charAt(0));
    if (node && nextLetter.length > 1) {
      node = node.children.get(nextLetter.charAt(1));
    }
    if (node?.terminal) {
      longestWord = [...currWord];
    }
  }
    
  return longestWord;
}