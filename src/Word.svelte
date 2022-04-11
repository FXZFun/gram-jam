<script lang="ts">
  import { flip } from 'svelte/animate';
  import BoardTile from "./BoardTile.svelte";
  import type { Tile } from "./types";
  import { send, receive, animationDuration } from './animations';

  export let word: Tile[];
</script>

<div class=container>
  {#each word as tile (tile.id)}
    <div
      animate:flip="{{duration: animationDuration}}"
      in:receive="{{key: tile.id}}"
      out:send="{{key: tile.id}}"
    >
      <BoardTile
        active={false}
        adjacent={false}
        letter={tile.letter}
        selected={false}
        multiplier={tile.multiplier}
        matched
        size='small'
      />
    </div>
  {/each}
</div>

<style>
  .container {
    z-index: 100;
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
    align-items: center;
  }
</style>