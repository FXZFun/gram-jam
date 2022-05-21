import { v4 as uuid } from 'uuid';
import { Writable, writable } from "svelte/store";
import type { Board, GameState } from './types';
import type { Trie } from './algorithms/trie';

export const initializeGameState = (sampleBoard?: Board): GameState => ({
  startedAt: +new Date(),
  id: uuid(),
  board: sampleBoard ?? [],
  latestWord: undefined,
  selectedCoords: [],
  selectedTiles: [],
  highlighted: {},
  intersections: {},
  words: [],
  turn: 0,
  remainingSwaps: 2,
  shuffles: 1,
  streak: 0,
  bestStreak: 0,
  lost: false,
  score: 0,
  latestChain: 0,
  bestChain: 0,
  marquee: undefined,
});
 
export const gameState = writable(initializeGameState());

export const dictionary = writable<Trie<string>>();

export const reset = (game: Writable<GameState>) => game.set(initializeGameState());

export const clearSelection = (game: Writable<GameState>) => {
  game.update(game => ({
    ...game,
    selectedCoords: [],
    selectedTiles: [],
  }));
}

let id = 0;
const makeBoardFromLetters = (letters: string[][]): Board => (
  letters.map(row => row.map(letter => ({
    letter,
    id: id++,
    multiplier: 1,
  })))
);

export const sampleBoard = makeBoardFromLetters([
  ["B", "G", "V", "A", "N", "D", "E"],
  ["A", "T", "C", "H", "O", "A", "A"],
  ["E", "I", "D", "E", "X", "R", "R"],
  ["T", "C", "T", "N", "S", "L", "E"],
  ["C", "I", "F", "E", "F", "E", "I"],
  ["P", "U", "Z", "Z", "L", "A", "O"],
]);

export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuid();
    localStorage.setItem('userId', userId);
  }
  return userId;
}

export default gameState;