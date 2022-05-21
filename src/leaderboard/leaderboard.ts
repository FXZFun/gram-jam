import { getUserId } from "../store";
import type { GameState, LeaderboardEntry, SLeaderboardEntry } from "../types";
import { supabase } from "./supabase";

export const loadLeaderboard = async (
  from: SLeaderboardEntry = undefined,
  direction: 'asc' | 'desc' = 'desc',
) => {

  let q = supabase
    .from<SLeaderboardEntry>('leaderboard')
    .select('*')
    .order('score', { ascending: direction === 'asc' })
    .limit(10)
    
  if (from?.id) {
    q = q.neq('id', from.id);
    if (direction === 'asc') {
      q = q.gte('score', from.score);
    } else {
      q = q.lte('score', from.score);
    }
  }
    
  const { data } = await q;
  return data ?? [];
}

export const submitScore = async (game: GameState, {
  name: string
}) => {
  const words = game.words.sort((a, b) => b.score - a.score);
  const name = localStorage.getItem('name') || '';
  const date = new Date();
  const response = await supabase.from<SLeaderboardEntry>('leaderboard')
    .insert({
      id: game.id,
      userId: getUserId(),
      gameId: game.id,
      userName: name,
      score: game.score,
      bestStreak: game.bestStreak,
      bestChain: game.bestChain,
      bestWord: words[0]?.word ?? [],
      numWords: game.words.length,
      numTurns: game.turn,
      date: date.toISOString(),
    })
  return response.data[0];
}

export const loadLocalLeaderboard = () => {
    // load local
    if (localStorage.getItem('updated') !== 'true') {
      localStorage.removeItem('games');
      localStorage.setItem('updated', 'true');
    }
    const games: SLeaderboardEntry[] = JSON.parse(localStorage.getItem('games')) ?? [];
    return games
      .filter(g => g.score)
      .map(g => ({ ...g, id: g.gameId }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
}
 