<script lang='ts'>
import Shuffle from 'svelte-material-icons/Shuffle.svelte';
import ActionButton from "../components/ActionButton.svelte";

export let onShuffle: () => void;
export let shuffles: number;

</script>

<div class=shuffle-container>
  <ActionButton
    onClick={shuffles > 0 ? onShuffle : undefined}
    disabled={shuffles === 0}
  >
    <span>
      {shuffles}
    </span>
    <Shuffle />
  </ActionButton>
</div>

<style>
  .shuffle-container {
    position: absolute;
    font-size: 1.25em;
    bottom: 0;
    right: 0;
  }
  .shuffle-container span {
    padding: 0.25em;
  }
</style>