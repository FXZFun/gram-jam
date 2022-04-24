import { getDocs, limit, orderBy, query, where } from "@firebase/firestore";
import { dataset_dev } from "svelte/internal";
import { leaderboard } from "../db";

export const loadLeaderboard = async (today = false) => {
  let date = new Date(0);
  if (today) {
    date = new Date();
    date.setHours(0);
    date.setMinutes(0);
    date.setSeconds(0);
  }
  console.log(date);

  const q = query(
    leaderboard,
    orderBy('score', 'desc'),
    // limit(50),
  )
  const topScores = await getDocs(q);
  return topScores;
}