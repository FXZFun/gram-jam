<script lang='ts'>
	import { fly, fade } from 'svelte/transition';

  export let open: boolean;
  export let onClose;
</script>
  
{#if open}
  <div class=container on:click|self={onClose}>
    {#key open}
      <div
        in:fly={{ y: 50, duration: 100 }}
        out:fly={{ y: -50, duration: 100 }}
        class=panel
      >
        <slot />
      </div>
    {/key}
  </div>
{/if}

<style>
  .container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .panel {
    z-index: 100;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 0 8px #00000040;
    max-height: calc(100% - 2em);
    overflow-y: auto;
    margin: 2em 1em;
    width: 100%
  }
  :global(body.dark-mode) .panel {
    background-color: #1D1E20;
    color: white;
  }
  @media (min-width: 769px) {
    .panel {
      width: 30em;
    }
  }


</style>