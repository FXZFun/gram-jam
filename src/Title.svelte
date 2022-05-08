<script>
import BoardTile from "./BoardTile.svelte";

</script>

<div class=title>
  <div class=subtitle>
    <div class=subtitle-inner>
      <BoardTile
        selected
        letter=G
        size=logo
      />
    </div>
    <div class=subtitle-inner>
      <BoardTile
        highlighted=green
        letter=J
        size=logo
      />
    </div>
  </div>
</div>

<style lang='scss'>
  .title {
    position: absolute;
  }
  .subtitle {
    position: relative;
  }
  .subtitle-inner {
    position: absolute;
    &:first-of-type {
      z-index: 2;
      top: 0;
      left: 0;
    }
    &:last-of-type {
      z-index: 1;
      top: 1em;
      left: 1em;
    }
  }
  @media (min-width: 769px) {
    .title {
      flex-direction: row;
    }
  }
</style>