<script lang="ts">
import type { Freqs } from "./types";
import { flip } from 'svelte/animate';
import { send, receive, flipDuration } from './animations';

  export let freqs: Freqs<string>;
  export let newLetters: string[];
  
  $: sorted = Object.entries(freqs).sort((a, b) => b[1] - a[1]);
  $: max = sorted?.[0]?.[1] ?? 0;
</script>

<div class=chart>
  {#each sorted.slice(0, 15) as [ letter, weight ] (letter)}
    <div
      class=bar-container
      animate:flip="{{ duration: 500, delay: 500 }}"
      in:receive="{{ key: letter, duration: 500, delay: 500 }}"
      out:send="{{ key: letter, duration: 500, delay: 500 }}"
    >
      <div
        class=bar
        class:sampled={newLetters.includes(letter)}
        style='height: {100 * weight / max}%;'
      />
      <span class=letter>{letter}</span>
    </div>
  {/each}
</div>

<style>
  .chart {
    display: flex;
    flex-direction: row;
    gap: 0.5em;
    height: 2em;
    padding: 1em;
  }
  .bar-container {
    display: flex;
    flex-direction: row;
    align-items: end;
    position: relative;
    height: 100%;
  }
  .bar {
    transition: height 1s ease-in-out;
    background-color: brown;
    width: 1em;
  }
  .sampled {
    transition: background-color 0.2s ease-in-out;
    background-color: green;
  }
  .letter {
    line-height: 1;
    color: white;
    position: absolute;
    bottom: 0;
    left: 2px;
  }
</style>