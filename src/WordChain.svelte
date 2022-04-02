<script lang='ts'>
  import Link from 'svelte-material-icons/Link.svelte'
	import { fly } from 'svelte/transition';
  export let chain: number;
</script>

{#if chain > 0}
  {#key chain}
    <div class=chain>
      <div in:fly={{ y: -20 }}>{chain + 1}</div>
      <Link />
    </div>
  {/key}
{/if}

<style>
  .chain {
    background-color: orange;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    padding: 4px 8px;
    font-size: 1.25em;
    font-weight: bold;
  }
</style>