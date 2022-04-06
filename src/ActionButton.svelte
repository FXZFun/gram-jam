<script lang='ts'>
  export let onClick: () => void;
  export let disabled: boolean | undefined = undefined;
</script>

<button on:click={onClick} class=action>
  <slot />
</button>

<style>
  .action {
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
  }
  :global(body.dark-mode) .action {
    color: white;
    background-color: #2F3640;
  }
  .action:hover {
    background-color: white;
    color: black;
  }
</style>