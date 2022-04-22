<script lang='ts'>
  import Hot from 'svelte-material-icons/Fire.svelte'
  import { schemeSpectral } from 'd3-scale-chromatic';
  import Pill from './components/Pill.svelte';
  
  export let streak: number;
  $: backgroundColor = schemeSpectral[11][Math.min(Math.round(streak / 2), 10)];
  $: color = 6 < streak && streak < 15 ? 'black' : 'white';
</script>

{#if streak > 0}
  <Pill
    color='black'
    backgroundColor='#FFB74D'
    value={streak}
  >
      <Hot />
  </Pill>
{/if}