<script lang="ts">
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";

  export let word: Tile[];
</script>

<div class=container>
  {#each word as tile (tile.id)}
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