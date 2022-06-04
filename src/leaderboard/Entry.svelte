<script lang="ts">
import type { SLeaderboardEntry } from "../types";
import Streak from "../pills/Streak.svelte";
import WordChain from "../pills/WordChain.svelte";
import { scoreWord } from "../algorithms/letters";
import Turns from "../pills/Turns.svelte";
import Words from "../pills/Words.svelte";
import StaticWord from "../StaticWord.svelte";
import { onMount } from "svelte";

  export let entry: SLeaderboardEntry;
  export let current: boolean;
  export let position: number | undefined;
  let ref: HTMLElement;

  onMount(() => {
    if (ref && current) {
      ref.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  });
  
  const parseDate = (timestamp: string | { seconds: number }) => (
    typeof timestamp === 'string'
      ? new Date(timestamp)
      : new Date(timestamp.seconds*1000)
  )

  const formatDate = (date: Date) => (
    new Date(date).toLocaleDateString('en-US', { 
      month: 'short',
      day: 'numeric'
    })
  )

</script>

<div
  bind:this={ref}
  id={entry.id}
  class=container
  class:selected={current}
>
  <div class=row>
    <div class=topline>
      <h2 class=rank>
        {#if position !== undefined}
          #{position + 1}
        {/if}
      </h2>
      <h3 class=name>{entry.userName}</h3>
      <h2 class=score>{entry.score}</h2>
    </div>
  </div>
  <div class=row>
    <div class=pills>
      <Turns turns={entry.numTurns} />
      {#if entry.numWords}
        <Words numWords={entry.numWords} />
      {/if}
      <WordChain chain={entry.bestChain} />
      <Streak streak={entry.bestStreak} />
    </div>
  </div>
  <div class=row>
    <StaticWord word={entry.bestWord.map(tile => ({ ...tile, id: Math.random() }))} />
    <h5>+{scoreWord(entry.bestWord)}</h5>
  </div>
  <div class=row>
    <h5 class=date>{formatDate(parseDate(entry.date))}</h5>
  </div>
</div>

<style>
  .container {
    width: calc(100% - 1em);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 0.5em;
    padding-bottom: 0.5em;
    border-bottom: 2px solid grey;
    padding: 0.5em;
  }
  .selected {
    background-color: #80808080;
    border-radius: 0.5em;
    border-bottom: 2px solid darkgrey;
  }
  .row {
    width: 100%;
    display: flex;
    align-items: center;
  }
  .topline {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: 0.25em;
  }
  .score {
    margin: 0;
    align-self: end;
  }
  .rank {
    margin: 0;
    padding: 0;
  }
  h3, h5 {
    margin: 0;
  }
  .date {
    font-style: italic;
    opacity: 0.6;
    align-self: end;
  }
  h3 {
    display: inline;
  }
  .pills {
    width: 100%;
    display: flex;
    justify-content: center;
  }
</style>