<script lang='ts'>
  import Flash from 'svelte-material-icons/Flash.svelte'
  import Pill from '../components/Pill.svelte';
  import { schemeSpectral } from 'd3-scale-chromatic';

  export let chain: number;
  $: backgroundColor = schemeSpectral[11][Math.min(Math.round(chain), 10)];
  $: color = 3 < chain && chain < 8 ? 'black' : 'white';

</script>

{#if chain > 0}
  <Pill
    value={chain + 1}
    color='black'
    backgroundColor='#FFFF00'
  >
    <Flash />
  </Pill>
{/if}