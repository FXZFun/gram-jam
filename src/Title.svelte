<script>
import BoardTile from "./BoardTile.svelte";

</script>

<div class=title>
  <div class=subtitle>
    {#each ['G', 'R', 'A', 'M'] as letter, i}
      <BoardTile
        selected={i === 0}
        letter={letter}
        size='tiny'
      />
    {/each}
  </div>
  <div class=subtitle>
    {#each ['J', 'A', 'M'] as letter, i}
      <BoardTile
        highlighted={i === 0 ? 'green' : undefined}
        letter={letter}
        size='tiny'
      />
    {/each}
  </div>
</div>

<style>
  .subtitle {
    display: flex;
    flex-direction: row;
    overflow: visible;
    padding: 0 0.5em;
  }
  .title {
    position: absolute;
    left: 50%;
    width: 0;
    overflow: visible;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
  @media (min-width: 769px) {
    .title {
      flex-direction: row;
    }
  }
</style>