import { scoreWord } from "./letters";
import type { Trie } from "./trie";
import type  { Board, Coord, Match, Tile } from "../types";

export const findWords = (dictionary: Trie<string>, board: Board) => {
  const words: Match[] = [];
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      for (const axis of ['row' as const, 'col' as const]) {

        const word = findWord(dictionary, board, i, j, axis);
        if (word.length) {
          const coords = word.map((_, offset): Coord => [
            i + (axis === 'col' ? 0 : offset),
            j + (axis === 'row' ? 0 : offset),
          ]);
          words.push({
            word,
            coords,
            axis,
            score: scoreWord(word),
          });
        }
      }
    }
  }

  const bonusWords: Match[] = [];
  const toOmit: Match[] = [];
  let intersectingId = -1;
  for (const [i, w1] of Object.entries(words)) {
    for (const w2 of words.slice(+i + 1)) {
      const coords1 = w1.coords.map(coord => coord.join(','));
      const coords2 = new Set(w2.coords.map(coord => coord.join(',')));
      const [ intersection ] = coords1.filter(c => coords2.has(c));
      if (w1.axis !== w2.axis && intersection != undefined) {
        const [ i, j ] = intersection.split(',');
        const intersectingTile = board[i][j];
        // we want to clear horizontal word first
        let vert = w1.axis === 'col' ? w1 : w2;
        let horiz = w1.axis === 'row' ? w1 : w2;
        bonusWords.push({
          ...horiz,
          word: horiz.word.map(tile => (
              tile.id === intersectingTile.id
              // leave tile on board for next match
                ? ({ ...tile, id: intersectingId })
                : tile
            )),
          intersection,
          intersectingTile: {
            ...intersectingTile,
            id: intersectingId,
          },
        });
        intersectingId--;
        bonusWords.push({ ...vert, intersection, intersectingTile });
      } else if (w1.axis === w2.axis && intersection != undefined) {
        // prefer longer word
        if (w1.word.length < w2.word.length) {
          toOmit.push(w1);
        } else {
          toOmit.push(w2);
        }
      }
    }
  }
  return [
    ...bonusWords,
    ...words
      .filter(w => !toOmit.includes(w))
      .sort((a, b) => (a.coords[0][1] - b.coords[0][1]) || (b.word.length - a.word.length)),
  ];
}

const findWord = (
  dictionary: Trie<string>,
  board: Board,
  i: number,
  j: number,
  axis: 'row' | 'col',
): Tile[] => {
  const firstTile = board[i][j];
  const firstLetter = firstTile.letter.toLowerCase();
  let currWord = [firstTile];
  let longestWord = [];
  let node = dictionary.getNode(firstLetter);
  // scan rows
  const [ start, end ] = axis === 'row'
    ? [i, board.length]
    : [j, board[0].length];

  for (let k = start + 1; k < end && node; k++) {
    const nextTile = board[axis === 'row' ? k : i][axis === 'col' ? k : j];
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

export const getMarqueeText = (match: Match, chain: number) => {
  if (match.score >= 50 || chain >= 5) {
    return '🎆 UNBELIEVABLE!';
  } else if (match.score >= 40 || chain === 4 || match.word.length === 8) {
    return '🎉 INCREDIBLE!';
  } else if (match.score >= 30 || chain === 3 || match.word.length === 7 || match.intersection) {
    return '🎊 IMPRESSIVE!';
  } else if (match.score >= 20 || chain === 2 || match.word.length === 6) {
    return '✨ WOW!';
  } else if (match.score >= 10 || chain === 1 || match.word.length === 5) {
    return '👍 NICE!';
  }
}