import { addDoc, deleteField } from "@firebase/firestore";
import { analytics } from "./db";
import { getUserId } from "./store";
import type { AnalyticsReport, GameState, LeaderboardEntry, Stats } from "./types";

type AnalyticsProps = {
  abandoned: boolean;
}

const defaultProps = {
  abandoned: false,
}

export const saveAnalytics = async (game: GameState, props: AnalyticsProps = defaultProps) => {

  const date = new Date()
  await addDoc(analytics, {
    gameId: game.id,
    turns: game.turn,
    bestStreak: game.bestStreak,
    bestChain: game.bestChain,
    date: date.toISOString(),
    userId: getUserId(),
    words: game.words.map(w => w.word.map(tile => tile.letter).join('')),
    duration: Math.round((+date - game.startedAt) / 1000),
    abandoned: props.abandoned,
  })
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