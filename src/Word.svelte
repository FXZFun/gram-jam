<script lang='ts'>
import Tile from "./Tile.svelte";

  export let word: string;
  
  const getLetters = (word: string) => {
    const letters = [];
    for (let i = 0; i < word.length; i++) {
      letters.push(word.charAt(i).toUpperCase());
    }
    return letters;
  }
</script>

<div class=container>
  {#each getLetters(word) as letter}
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