import { addDoc, deleteField } from "@firebase/firestore";
import { analytics } from "./db";
import { getUserId } from "./store";
import type { AnalyticsReport, GameState } from "./types";

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
