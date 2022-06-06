<script lang="ts">
  import { flip } from 'svelte/animate';
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";
  import { send, receive, flipDuration } from './animations';

  export let word: Tile[];
</script>

<div class=container>
  {#each word as tile (tile.id)}
    <div
      data-id={tile.id}
      animate:flip="{{ duration: flipDuration }}"
      in:receive="{{ key: tile.id, duration: flipDuration }}"
      out:send="{{ key: tile.id, duration: flipDuration }}"
    >
      <BoardTile
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