import { v4 as uuid } from 'uuid';
import { writable } from "svelte/store";
import type { Board, GameState } from './types';

export const initializeGameState = (sampleBoard?: Board): GameState => ({
  id: uuid(),
  board: sampleBoard ?? [],
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
});
 
export const gameState = writable(initializeGameState());

export const reset = (gameState) => gameState.set(initializeGameState());

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
  ["A", "T", "U", "A", "O", "A", "A"],
  ["E", "E", "D", "E", "X", "R", "R"],
  ["A", "C", "T", "N", "S", "L", "E"],
  ["C", "I", "F", "E", "F", "C", "I"],
  ["T", "N", "D", "L", "Y", "A", "O"],
]);

export const getUserId = () => {
  let userId = localStorage.getItem('userId');
  if (!userId) {
    userId = uuid();
    localStorage.setItem('userId', userId);
  }
  return userId;
}