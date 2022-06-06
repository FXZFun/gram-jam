import { writable } from "svelte/store";
import { supabase } from "./leaderboard/supabase";
import { getUserId, getUserName } from "./store";
import type { AnalyticsReport, Coord, GameState, LeaderboardEntry, Match, Stats, Turn } from "./types";

export type Turns = {
  turns: Turn[],
  prevWordPointer: number,
  lastTurnTimestamp: number,
}
 
type AnalyticsProps = {
  abandoned: boolean;
}

const initializeTurns = () => ({
  turns: [],
  prevWordPointer: 0,
  lastTurnTimestamp: +new Date(),
});

export const turns = writable<Turns>(initializeTurns());

export const updateTurns = (coords: Coord[], words: Match[]) => {
  turns.update(prev => ({
    turns: prev.turns.concat([{
      durationSeconds: (+(new Date()) - prev.lastTurnTimestamp) / 1000,
      words: words.slice(prev.prevWordPointer),
      coords
    }]),
    lastTurnTimestamp: +new Date(),
    prevWordPointer: words.length,
  }))
}

export const resetTurns = () => {
  turns.set(initializeTurns());
}

const defaultProps = {
  abandoned: false,
}

export const saveAnalytics = async (
  game: GameState,
  turns: Turn[],
  props: AnalyticsProps = defaultProps
) => {

  const date = new Date()
  if (!DEV) {
    await supabase.from<AnalyticsReport>('analytics')
      .insert({
        id: game.id,
        turns,
        userId: getUserId(),
        userName: getUserName(),
        score: game.score,
        bestStreak: game.bestStreak,
        bestChain: game.bestChain,
        date: date.toISOString(),
        words: game.words.map(w => w.word.map(tile => tile.letter).join('')),
        durationSeconds: Math.round((+date - game.startedAt) / 1000),
        abandoned: props.abandoned,
      })
  }
}

export const saveLocalStats = (game: GameState) => {
  const stats: Stats = JSON.parse(localStorage.getItem('stats') ?? '{}');
  stats.gamesPlayed = (stats.gamesPlayed ?? 0) + 1;
  stats.totalWordsPlayed = (stats.totalWordsPlayed ?? 0) + game.words.length;
  if (!stats.wordScoreFreqs) {
    stats.wordScoreFreqs = {};
  }
  if (!stats.wordLengths) {
    stats.wordLengths = {};
  }
  for (const word of game.words) {
    stats.wordScoreFreqs[word.score] = (stats.wordScoreFreqs[word.score] ?? 0) + 1;
    const wordLength = word.word.reduce((total, t) => total + t.letter.length, 0);
    stats.wordLengths[wordLength] = (stats.wordLengths[wordLength] ?? 0) + 1;
  }
  localStorage.setItem('stats', JSON.stringify(stats));
}

export const saveLocalLeaderboard = (entry: LeaderboardEntry) => {
  const localGames: LeaderboardEntry[] = JSON.parse(localStorage.getItem('games') ?? '[]');
  localGames.push(entry);
  localStorage.setItem('games', JSON.stringify(localGames));
}