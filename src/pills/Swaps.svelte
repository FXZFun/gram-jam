<script lang='ts'>
  import Autorenew from 'svelte-material-icons/Autorenew.svelte';
  import { spin } from '../animations';
  import { quintOut } from 'svelte/easing';
  import Pill from '../components/Pill.svelte';

  export let swaps: number;
  let prevSwaps: number;
  let diff: number;

  $: {
    diff = swaps - prevSwaps;
    prevSwaps = swaps;
  }
  
  const getSwapLevel = (swaps: number) => {
    if (swaps < 3) return ['white', '#b71c1c'];
    else if (swaps < 5) return ['white', '#e65100'];
    else if (swaps < 8) return ['black', '#fbc02d'];
    else if (swaps < 11) return ['white', '#33691e'];
    else if (swaps < 14) return ['white', '#01579b'];
    else if (swaps < 17) return ['white', '#311b92'];
    else return ['white', '#C2185B'];
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
  large
  value={Math.max(swaps, 0)}
  color={getSwapLevel(swaps)[0]}
  backgroundColor={getSwapLevel(swaps)[1]}
>
  {#key swaps}
    <Autorenew />
  {/key}
</Pill>
