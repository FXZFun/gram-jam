<script lang='ts'>
  import Autorenew from 'svelte-material-icons/Autorenew.svelte';
  import { spin } from './animations';
  import { quintOut } from 'svelte/easing';
  import Pill from './Pill.svelte';

  export let swaps: number;
  let prevSwaps: number;
  let diff: number;

  $: {
    diff = swaps - prevSwaps;
    prevSwaps = swaps;
  }
  
  const getSwapLevel = (swaps: number) => {
    if (swaps < 3) return '#b71c1c';
    else if (swaps < 5) return '#e65100';
    else if (swaps < 8) return '#fbc02d';
    else if (swaps < 11) return '#33691e';
    else if (swaps < 14) return '#01579b';
    else return '#311b92';
  }
</script>

{#if false}
  <Pill
    value={diff}
    color='black'
    backgroundColor='white'
  >

  </Pill>
{/if}
<Pill
  value={Math.max(swaps, 0)}
  color='white'
  backgroundColor={getSwapLevel(swaps)}
>
  {#key swaps}
    <Autorenew />
  {/key}
</Pill>
