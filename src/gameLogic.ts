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
          i, j,
          axis: 'col',
          score: scoreWord(match),
        });
      }
      const match2 = findWordRow(board, i, j);
      if (match2.length) {
        words.push({
          word: match2,
          i, j,
          axis: 'row',
          score: scoreWord(match2),
        });
      }
    }
  }
  // for (const w1 of words) {
  //   for (const w2 of words) {
  //     if (w1.axis === 'row' && w2.axis === 'col') {
  //       if (w2.j <= w1.j && w1.j <= w2.j + w2.word.length) {
  //         if (w2.i <= w1.i && w1.i <= w2.i + w2.word.length) {

  //         }
  //       }
  //     } else if (w1.axis === 'col' && w2.axis ==='row') {
  //       if (w2.j <= w1.j && w1.j <= w2.j + w2.word.length) {
  //       
  //     }
  //   }
  // }
  return words.sort((a, b) => b.score - a.score);
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
    node = node.children.get(nextLetter);
    if (node && nextLetter.length > 1) {
      node = node.children.get(nextLetter.charAt(1));
    }
    if (node?.terminal) {
      longestWord = [...currWord];
    }
  }
    
  return longestWord;
}