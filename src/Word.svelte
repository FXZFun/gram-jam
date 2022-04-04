<script lang="ts">
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";

  export let word: Tile[];
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
</div>

<style>
  .container {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }
</style>