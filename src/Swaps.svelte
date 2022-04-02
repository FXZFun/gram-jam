<script lang='ts'>
  import Shuffle from 'svelte-material-icons/Shuffle.svelte'
	import { fly } from 'svelte/transition';

  export let swaps: number;
  
  const getSwapLevel = (swaps: number) => {
    if (swaps < 3) return 'low';
    else if (swaps < 7) return 'med';
    else if (swaps < 15) return 'high';
    else return 'super';
  }
</script>

<div class={`swap-count ${getSwapLevel(swaps)}`}>
  {#key swaps}
    <div in:fly={{ y: 20 }}>
      {swaps}
    </div>
  {/key}
  <Shuffle />
</div>

<style>
  .swap-count {
    transition: all 1s ease-in-out;
    position: absolute;
    top: 0;
    right: 0;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 1.25em;
    font-weight: bold;
  }
  .low {
    background-color: red;
  }
  .med {
    background-color: orange;
  }
  .high {
    background-color: green;
  }
  .super {
    background-color: blue;
  }
</style>