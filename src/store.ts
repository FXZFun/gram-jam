import { v4 as uuid } from 'uuid';
import { Writable, writable } from "svelte/store";
import type { Board, GameState, Turn } from './types';
import type { Trie } from './algorithms/trie';
import { resetGame } from './algorithms/gameLogic';
import { turns, Turns } from './analytics';

export const getTileId = () => Math.random().toString(36).slice(2);

export const initializeGameState = (initialBoard: Board = []): GameState => ({
  startedAt: +new Date(),
  id: uuid(),
  board: initialBoard,
  latestWord: undefined,
  highlighted: {},
  intersections: {},
  words: [],
  turn: 0,
  remainingSwaps: 10,
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

export const reset = (game: Writable<GameState>) => game.set(initializeGameState());

const makeBoardFromLetters = (letters: string[][]): Board => (
  letters.map(row => row.map(letter => ({
    letter,
    id: getTileId(),
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

export const getUserName = () => {
  let userId = localStorage.getItem('name');
  if (!userId) {
    userId = uuid();
    localStorage.setItem('name', userId);
  }
  return userId;
}

export const loadGame = (dictionary: Trie<string>) => {
  const game = localStorage.getItem('currGame');
  const prevTurns = localStorage.getItem('currTurns');
  if (game) {
    gameState.set(JSON.parse(game));
  } else {
    gameState.set(resetGame(initializeGameState(sampleBoard), dictionary));
  }
  if (prevTurns) {
    turns.set(JSON.parse(prevTurns));
  }
}

export const saveGame = (game: GameState, turns: Turns) => {
  localStorage.setItem('currGame', JSON.stringify(game));
  localStorage.setItem('currTurns', JSON.stringify(turns));
}

export const clearGame = () => {
  localStorage.removeItem('currGame');
  localStorage.removeItem('currTurns');
}

export default gameState;