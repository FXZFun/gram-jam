<script lang='ts'>

	import { fly } from 'svelte/transition';

  export let id: string = undefined;
  export let fullHeight = false;
  export let index = 1;
  export let open: boolean;
  export let onClose: () => void;
  
</script>
  
{#if open}
  <div
    class=container
    class:visible={open}
    on:click|self={onClose}
  >
    {#key open}
      <div
        {id}
        in:fly={{ y: 100, duration: 250 }}
        out:fly={{ y: 100, duration: 250 }}
        class=panel
        class:index-2={index === 2}
        class:full-height={fullHeight}
      >
        <div class=title>
          <slot name=title/>
        </div>
        <div class=scroll-container>
          <div class=scroll-container-inner>
            <slot name=content/>
          </div>
        </div>
        <div class=controls>
          <slot name=controls/>
        </div>
      </div>
    {/key}
  </div>
{/if}

<style>
  .container {
    position: absolute;
    overflow: hidden;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .container.visible {
    background-color: #00000040;
  }
  .title {
    width: 100%;
    padding: 0 0.5em;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
  }
  .controls {
    display: flex;
    padding: 0.5em;
  }
  .panel {
    z-index: 2000;
    background-color: white;
    border-radius: 4px;
    box-shadow: 0 0 8px #00000040;
    max-height: calc(100% - 2em);
    margin: 2em 1em;
    width: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    overflow: hidden;
  }
  .panel.full-height {
    height: 100%;
    margin: 1em;
  }
  .panel.index-2 {
    z-index: 3000;
  }
  .scroll-container {
    overflow: hidden;
    display: flex;
    flex-direction: column;
    width: 100%;
    height: 100%;
  }
  .scroll-container-inner {
    height: 100%;
    display: flex;
    flex-direction: column;
    overflow: auto;
    padding: 1em;

    background: /* Shadow covers */
    linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
    radial-gradient(50% 0, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(50% 100%, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
    background: /* Shadow covers */
    linear-gradient(white 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), white 70%) 0 100%, /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
    background-repeat: no-repeat;
    background-size: 100% 40px, 100% 40px, 100% 14px, 100% 14px;
    /* Opera doesn't support this in the shorthand */
    background-attachment: local, local, scroll, scroll;
  }
  :global(body.dark-mode) .scroll-container-inner {
    background:
    linear-gradient(#323438 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), #323438 70%) 0 100%, /* Shadows */
    radial-gradient(50% 0, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(50% 100%, farthest-side, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
    background:
    linear-gradient(#323438 30%, rgba(255, 255, 255, 0)), linear-gradient(rgba(255, 255, 255, 0), #323438 70%) 0 100%, /* Shadows */
    radial-gradient(farthest-side at 50% 0, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)), radial-gradient(farthest-side at 50% 100%, rgba(0, 0, 0, .2), rgba(0, 0, 0, 0)) 0 100%;
  }
  :global(body.dark-mode) .panel {
    background-color: #323438;
    color: white;
  }
  @media (min-width: 769px) {
    .panel {
      width: 30em;
    }
  }


</style>