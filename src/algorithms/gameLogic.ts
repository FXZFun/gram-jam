import { sample, scoreWord } from "./letters";
import type { Trie } from "./trie";
import type  { Board, Coord, Freqs, GameState, Match, Tile } from "../types";
import { getTileId, initializeGameState, sampleBoard } from "../store";
// import { stats } from '../Stats.svelte';

export const DIMS = {
  ROWS: 7,
  COLS: 6,
};

export const resetGame = (game: GameState, dictionary: Trie<string>) => {
  
  const prevBoard = game.board;
  game = initializeGameState();

  if (!game.board.length) {
    for (let i = 0; i < DIMS.COLS; i++) {
      game.board.push([]);
      for (let j = 0; j < DIMS.ROWS; j++) {
        const [ , tile ] = sample([], 1);
        game.board[i].push(tile);
      }
    }
  }
  
  let { words } = findWords(dictionary, game.board);
  while (words.length) {
    for (const word of words) {
      const a =  word.coords[Math.floor(Math.random() * word.word.length)];
      const b =  word.coords[Math.floor(Math.random() * word.word.length)];

      const tempTile = game.board[a[0]][a[1]];
      game.board[a[0]][a[1]] = game.board[b[0]][b[1]];
      game.board[b[0]][b[1]] = tempTile;
    }
    words = findWords(dictionary, game.board).words;
  }
  
  for (const [i, col] of game.board.entries()) {
    for (const [j, row] of col.entries()) {
      // reset multipliers
      game.board[i][j].multiplier = 1;
      const prevTile = prevBoard?.[i]?.[j];
      // keep reference to previous tileId for flip transition
      // TODO consider just having a gameOver specific fallback here
      if (prevTile) {
        game.board[i][j].id = prevTile.id;
      }
    }
  }
  
  // start game with 3 2x multipliers
  for (let i = 0; i < 3; i++) {
    const col = Math.floor(Math.random() * DIMS.COLS);
    const row = Math.floor(Math.random() * DIMS.ROWS);
    game.board[col][row].multiplier = 2;
  }

  return game;
}

const coordToStr = (c: Coord) => c.join(',');

export const findWords = (dictionary: Trie<string>, board: Board) => {
  const words: Match[] = [];
  const rows: Record<number, Match[]> = {};
  const cols: Record<number, Match[]> = {};
  for (let i = 0; i < board.length; i++) {
    for (let j = 0; j < board[0].length; j++) {
      for (const axis of ['row' as const, 'col' as const]) {

        const word = findWord(dictionary, board, i, j, axis);
        if (word.length) {
          const coords = word.map((_, offset): Coord => [
            i + (axis === 'col' ? 0 : offset),
            j + (axis === 'row' ? 0 : offset),
          ]);
          const match = {
            word,
            coords,
            axis,
            score: scoreWord(word),
            intersectingIds: [],
          };
          words.push(match);
          if (axis === 'row') {
            rows[j] = (rows[j] ?? []).concat([match]);
          } else {
            cols[i] = (cols[i] ?? []).concat([match]);
          }
        }
      }
    }
  }
  
  // eliminate overlapping matches
  removeOverlappingWords(rows);
  removeOverlappingWords(cols);
  
  const rowWords = Object.values(rows).flat();
  const colWords = Object.values(cols).flat();
  
  // find intersections
  const intersections: Record<number, { tile: Tile, coord: Coord }> = {};
  const intersectingWords: Record<number, Match> = {};
  // loop over cross-product of rows and columns
  for (const [ i1, w1 ] of Object.entries(rowWords)) {
    for (const [ i2, w2 ] of Object.entries(colWords)) {
      const coord = getIntersection(w1, w2);

      if (coord) {
        const [ i, j ] = coord;
        const tile = board[i][j];

        const intersectingId = getTileId();
        intersections[intersectingId] = { tile, coord };
        const tileIdx = w1.word.findIndex(t => t.id === tile.id);
        w1.word[tileIdx] = {
          ...w1.word[tileIdx],
          id: intersectingId,
        }
        w1.intersectingIds.push(intersectingId);
        w2.intersectingIds.push(tile.id);
        intersectingWords[i1] = w1;
      }
    }
  }
  
  return {
    words: rowWords.concat(colWords).sort((a, b) => {
      if (a.intersectingIds.length && b.intersectingIds.length) {
        return a.axis === 'row' ? -1 : 1
      }
      return a.coords[0][1] - b.coords[0][1];
    }),
    intersections,
  }
  
}

const getIntersection = (w1: Match, w2: Match): Coord | undefined => {
  const c1 = w1.coords.map(coordToStr);
  const c2 = w2.coords.map(coordToStr);
  const [ intersection ] = c1.filter(c => c2.includes(c));
  if (intersection) {
    return intersection.split(',').map(x => parseInt(x)) as Coord;
  } else {
    return undefined;
  }
}

const removeOverlappingWords = (
  axis: Record<number, Match[]>
) => {
  // eliminate overlapping matches
  const filteredWords: number[] = [];
  for (const [ idx, words ] of Object.entries(axis)) {
    for (const [ i1, w1 ] of Object.entries(words)) {
      for (const [ i2, w2 ] of Object.entries(words).slice(+i1 + 1)) {
        if (getIntersection(w1, w2)) {
          if (w1.word.length > w2.word.length) {
            filteredWords.push(+i2);
          } else {
            filteredWords.push(+i1);
          }
        }
      }
    }
    axis[idx] = words.filter((w, i) => !filteredWords.includes(i));
  }
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

export const removeLetters = (board: Board, turn: number, coords: Coord[]) => {

  // clear column
  for (const [ x, y ] of coords) {
    board[x][y] = undefined;
  }
  
  const cleared = board.map(col => (
    col.reverse()
      .filter(tile => tile != undefined)
  ));
  
  let freqs: Freqs<string>;
  let newLetters: string[] = [];
  for (let i = 0; i < DIMS.COLS; i++) {
    for (let j = 0; j < DIMS.ROWS; j++) {
      if (cleared[i][j] == undefined) {
        const [ stats, tile ] = sample(cleared, 1, turn);
        cleared[i][j] = tile;
        freqs = stats;
        newLetters.push(tile.letter);
      }
    }
  }
  // stats.set({ freqs, newLetters })
  return cleared.map(col => col.reverse());
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