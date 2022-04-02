 <script lang="ts">

  import { points } from './letters';
  
  export let letter: string;
  export let selected: boolean | undefined;
  export let matched: boolean | undefined;
  export let size: 'small' | 'large' = 'large';
</script>

<div
  class={`tile
    ${selected ? 'selected' : ''}
    ${matched ? 'matched' : ''}
    ${size}
  `}
>
  <span>{letter}</span>
  <span class='score'>{points[letter]}</span>
</div>

<style>
	.tile {
    position: relative;
		background-color: lightgreen;
    display: flex;
		width: 2.5em;
		height: 2.5em;
    font-size: 1.25em;
    margin: 0.2em;
    font-weight: bold;
    align-items: center;
    justify-content: center;
    user-select: none;
	}
  .tile.small {
    width: 2em;
    height: 2em;
    font-size: 1em;
  }
  .tile.selected {
    background-color: darkgreen;
    color: white;
  }
  .tile.matched {
    background-color: lightcoral !important;
  }
  .score {
    position: absolute;
    font-size: 0.5em;
    font-weight: normal;
    bottom: 0;
    right: 0;
    padding: 0.2em;
  }

</style>