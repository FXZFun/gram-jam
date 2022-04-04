<script lang='ts'>
  import Autorenew from 'svelte-material-icons/Autorenew.svelte'
	import { fly } from 'svelte/transition';
import Pill from './Pill.svelte';

  export let swaps: number;
  
  const getSwapLevel = (swaps: number) => {
    if (swaps < 3) return '#b71c1c';
    else if (swaps < 5) return '#e65100';
    else if (swaps < 8) return '#fbc02d';
    else if (swaps < 11) return '#33691e';
    else if (swaps < 14) return '#01579b';
    else return '#311b92';
  }
</script>

<Pill
  value={Math.max(swaps, 0)}
  color='white'
  backgroundColor={getSwapLevel(swaps)}
>
  <Autorenew />
</Pill>