<script lang='ts'>
	import { fade, fly } from 'svelte/transition';
  
  export let value: number;
  let prevValue: number;
  let direction: number;
  export let color: string;
  export let backgroundColor: string;
  
  $: {
    direction = prevValue < value ? 1 : -1;
    prevValue = value;
  }
</script>

<div
  in:fade
  out:fade
  class=pill
  style={`
    background-color: ${backgroundColor};
    color: ${color};
    padding-left: calc(${value.toString().length}em + 4px);
  `}
>
  {#key value}
    <div
      class=text
      in:fly={{ y: 20 * direction }}
      out:fly={{ y: -20 * direction }}
    >
      {value}
    </div>
  {/key}
  <slot />
</div>

<style>
  .pill {
    font-family: 'Poppins', sans-serif;
    position: relative;
    color: white;
    display: flex;
    flex-direction: row;
    align-items: center;
    border-radius: 16px;
    margin-right: 0.5em;
    padding: 4px;
    padding-right: 8px;
    font-size: 1.25em;
    font-weight: bold;
  }
  .pill:first-of-type {
    margin-left: 0.5em;
  }
  .pill .text {
    position: absolute;
    left: 0.5em;
    top: 50%;
    line-height: 0;
  }
</style>