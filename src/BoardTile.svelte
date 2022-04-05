 <script lang="ts">

  import Close from 'svelte-material-icons/Close.svelte';
  import { points } from './letters';
  
  export let letter: string;
  export let active: boolean | undefined;
  export let selected: boolean | undefined;
  export let adjacent: boolean | undefined;
  export let matched: boolean | undefined;
  export let size: 'small' | 'large' = 'large';
  export let multiplier: 1 | 2 | 3 = 1;
</script>

<div
  class={`tile
    ${selected ? 'selected' : ''}
    ${adjacent && !selected ? 'adjacent' : ''}
    ${active && !adjacent && !selected ? 'non-adjacent' : ''}
    ${matched ? 'matched' : ''}
    ${size}
  `}
>
  {#if letter.length === 1}
    <span>{letter}</span>
  {:else}
    <div class=bigram-container>
      <span class='bigram top'>{letter.charAt(0)}</span>
      <span class='bigram bottom'>{letter.charAt(1)}</span>
    </div>
  {/if}
  <span class=score>{points[letter] ?? ''}</span>
  {#if multiplier > 1}
    <span class={`multiplier ${multiplier === 2 && 'two'} ${multiplier === 3 && 'three'}`}>
      {multiplier}
      <Close size='0.625em' />
    </span>
  {/if}
</div>

<style>
	.tile {
    font-family: 'Poppins', sans-serif;
    position: relative;
    background-color: #F5F6FA;
    border: 1px solid #C4E0E3;
    border-radius: 2px;
    display: flex;
		width: min(12vw, 8vh);
		height: min(12vw, 8vh);
    font-size: 1.375em;
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
    background-color: #C4E0E3;
  }
  .tile.matched {
    background-color: #A2F594 !important;
    border-color: #56ad47 !important;
  }
  .tile.adjacent {
  }
  .tile.non-adjacent {
  }
  .multiplier {
    position: absolute;
    height: 1.75em;
    width: 1.75em;
    top: 0;
    left: 0;
    font-size: 0.625em;
    line-height: 1;
    padding: 2px;
    font-weight: normal;
    background: linear-gradient(to bottom right, darkgreen 0%, darkgreen 50%, #ffffff00 50%, #ffffff00 100%);
    display: flex;
    align-items: start;
    justify-content: start;
  }
  .multiplier.two {
    background: linear-gradient(to bottom right, #EBF8B9 0%, #EBF8B9 50%, #ffffff00 50%, #ffffff00 100%);
  }
  .multiplier.three {
    background: linear-gradient(to bottom right, #FBC6A4 0%, #FBC6A4 50%, #ffffff00 50%, #ffffff00 100%);
  }
  .score {
    position: absolute;
    font-size: 0.5em;
    font-weight: normal;
    bottom: 0;
    right: 0;
    padding: 0.2em;
  }
  .bigram-container {
    position: relative;
    width: 66%;
    height: 66%;
  }
  .bigram {
    position: absolute;
    line-height: 1;
  }
  .bigram.top {
    top: 0;
    left: 0;
  }

  .bigram.bottom {
    bottom: 0;
    right: 0;
  }

</style>