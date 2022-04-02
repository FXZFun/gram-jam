import Dictionary from "./dictionary"
import { scoreWord } from "./letters";
import type { Board, Match } from "./types";

export const findWords = (board: Board) => {
  const words: Match[] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {

      const word = findWordsCol(board, i, j);
      if (word) {
        words.push({
          word,
          i, j,
          axis: 'col',
          score: scoreWord(word),
        });
      }
      const word2 = findWordsRow(board, i, j);
      if (word2) {
        words.push({
          word: word2,
          i, j,
          axis: 'row',
          score: scoreWord(word2),
        });
      }
 
    }
  }
  return words.sort((a, b) => b.score - a.score);
}

const findWordsCol = (board: Board, i: number, j: number) => {
  const firstLetter = board[i][j][0].toLowerCase();
  let longestWord = undefined;
  let node = Dictionary.getNode(firstLetter);
  // scan columns
  for (let j2 = j + 1; j2 < board[0].length && node; j2++) {
    const nextLetter = board[i][j2][0].toLowerCase();
    node = node.children.get(nextLetter);
    if (node?.terminal) {
      longestWord = node.value;
    }
  }
    
  return longestWord;
}

const findWordsRow = (board: Board, i: number, j: number) => {

  const firstLetter = board[i][j][0].toLowerCase();
  let longestWord = undefined;
  let node = Dictionary.getNode(firstLetter);
  // scan rows
  for (let i2 = i + 1; i2 < board.length && node; i2++) {
    const nextLetter = board[i2][j][0].toLowerCase();
    node = node.children.get(nextLetter);
    if (node?.terminal) {
      longestWord = node.value;
    }
  }
    
  return longestWord;
}