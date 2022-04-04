<script lang="ts">
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";

  export let word: Tile[];
  export let score: number | undefined;
</script>

<div class=container>
  {#each word as tile}
    <BoardTile
      letter={tile.letter}
      selected={false}
      multiplier={tile.multiplier}
      matched
      size='small'
    />
  {/each}
  {#if score}
    <span class=score>
      {score}
    </span>
  {/if}
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
  .score {
    width: 0;
    padding-left: 1em;
    overflow: visible;
  }
</style>