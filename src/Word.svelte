<script lang='ts'>
import Tile from "./Tile.svelte";

  export let word: string;
  const letters = [];
  for (let i = 0; i < word.length; i++) {
    letters.push(word.charAt(i).toUpperCase());
  }
</script>

<div class=container>
  {#each letters as letter}
    <Tile
      {letter}
      selected={false}
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