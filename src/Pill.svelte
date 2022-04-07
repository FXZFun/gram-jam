<script lang='ts'>
	import { fade, fly } from 'svelte/transition';
  
  export let value: number;
  export let large: boolean = undefined;
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
  class={`pill ${large ? 'large' : ''}`}
  style={`
    background-color: ${backgroundColor};
    color: ${color};
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
    font-size: 1.25em;
    border-radius: 1em;
    margin: 0.25em;
    padding: 0.25em;
    padding-left: 2em;
    font-weight: bold;
  }
  .pill.large {
    font-size: 1.5em;
  }
  .pill .text {
    position: absolute;
    left: 0.5em;
    top: 50%;
    line-height: 0;
  }
</style>