<script lang='ts'>
  import Flash from 'svelte-material-icons/Flash.svelte'
	import { fly } from 'svelte/transition';
  export let streak: number;
</script>

{#if streak > 0}
  {#key streak}
    <div class=streak>
      <div in:fly={{ y: -20 }}>{streak}</div>
      <Flash />
    </div>
  {/key}
{/if}

<style>
  .streak {
    background-color: orange;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 12px;
    margin-right: 4px;
    padding: 4px 8px;
    font-size: 1.25em;
    font-weight: bold;
  }
</style>