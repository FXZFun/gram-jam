<script lang='ts'>
  export let onClick: () => void | undefined = undefined;
  export let disabled: boolean | undefined = undefined;
  export let type: 'submit' | undefined = undefined;
  export let form: string = undefined;
  export let href: string = undefined;

</script>

{#if href}
  <a
    {href}
    class=action
  >
    <slot />
  </a>
{:else}
  <button
    on:click={onClick}
    {type}
    {disabled}
    {form}
    class=action
  >
    <slot />
  </button>
{/if}

<style>
  .action {
    transition: all 0.25s ease-in;
    cursor: pointer;
    font-weight: bold;
    color: #2F3640;
    height: 2em;
    line-height: 1em;
    border-radius: 1em;
    border: 2px solid #2F3640;
    text-transform: uppercase;
    margin: 0;
    padding: 0 8px;
    display: flex;
    align-items: center;
    gap: 0.5em;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
  }
  .action:active {
    background-color: hsl(213, 56%, 71%);
  }
  :global(body.dark-mode) .action {
    transition: all 0.25s ease-in;
    color: white;
    background-color: #2F3640;
    border-color: white;
  }
  :global(body.dark-mode) .action:active {
    background-color: #434c58;
  }
  .action:hover {
    background-color: white;
    color: black;
  }
</style>