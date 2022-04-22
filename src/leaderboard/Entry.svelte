<script lang="ts">
import Word from "../Word.svelte";
import type { LeaderboardEntry, Tile } from "../types";
import Streak from "../Streak.svelte";
import WordChain from "../WordChain.svelte";
import { scoreWord } from "../algorithms/letters";

  export let entry: LeaderboardEntry;
  export let position: number;
</script>

<div class=container>
  <h2>{position + 1}</h2>
  <div class=stats>
    <div class=row>
      <h3>{entry.name}</h3>
      <div class=spacer />
      <div class=pills>
        <WordChain chain={entry.bestChain} />
        <Streak streak={entry.bestStreak} />
      </div>
      <h3>{entry.score}</h3>
    </div>
    <div class=row>
      <Word word={entry.bestWord} />
      <h5>+{scoreWord(entry.bestWord)}</h5>
    </div>
  </div>
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  h2 {
    padding: 1em;
  }
  h5 {
    margin: 0;
  }
  .stats {
    display: flex;
    flex-direction: column;
    width: 100%;
  }
  .row {
    display: flex;
    align-items: center;
  }
  h3 {
    display: inline;
  }
  .pills {
    display: flex;
    padding: 0 0.5em;
  }
  .spacer {
    flex-grow: 1;
  }
</style>