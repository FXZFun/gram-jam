<script lang="ts">
  import { fly } from 'svelte/transition';
  import { flip } from 'svelte/animate';
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";
  import { send, receive, flipOut, animationDuration, flipDuration } from './animations';

  export let word: Tile[];
  export let onIntroStart: (e: any) => void = undefined;
  export let onIntroEnd: (e: any) => void = undefined;
  export let onOutroStart: (e: any) => void = undefined;
  export let onOutroEnd: (e: any) => void = undefined;
</script>

<div class=container>
  {#each word as tile (tile.id)}
    <div
      data-id={tile.id}
      animate:flip="{{ duration: flipDuration }}"
      in:receive="{{ key: tile.id, duration: flipDuration }}"
      out:send="{{ key: tile.id, duration: flipDuration }}"
      on:introstart="{onIntroStart}"
      on:introend="{onIntroEnd}"
      on:outrostart="{onOutroStart}"
      on:outroend="{onOutroEnd}"
    >
      <BoardTile
        id={tile.id}
        active={false}
        adjacent={false}
        letter={tile.letter}
        selected={false}
        multiplier={tile.multiplier}
        highlighted='green'
        size='small'
      />
    </div>
  {/each}
</div>

<style>
  .container {
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    gap: 0.25em;
    height: 2em;
  }
</style>