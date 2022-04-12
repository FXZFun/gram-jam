<script lang='ts'>
  export let onClick: () => void | undefined = undefined;
  export let disabled: boolean | undefined = undefined;
  export let type: 'submit' | undefined = undefined;
  export let form: string = undefined;

</script>

<button
  on:click={onClick}
  {type}
  {disabled}
  {form}
  class=action
>
  <slot />
</button>

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
  }
  :global(body.dark-mode) .action {
    transition: all 0.25s ease-in;
    color: white;
    background-color: #2F3640;
    border-color: white;
  }
  .action :global(svg) {
    margin-right: 4px;
  }
  .action:hover {
    background-color: white;
    color: black;
  }
</style>