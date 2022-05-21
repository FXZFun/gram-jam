 <script lang="ts">

  import Close from 'svelte-material-icons/Close.svelte';
  import { scoreTile } from './algorithms/letters';
  import type { HighlightColors } from './types';
  
  export let letter: string;
  export let active: boolean = false;
  export let selected: boolean = false;
  export let adjacent: boolean = false;
  export let highlighted: HighlightColors;
  export let size: 'tiny' | 'small' | 'large' = 'large';
  export let multiplier: 1 | 2 | 3 = 1;
  export let id: number = undefined;

  const handleSwipe = (e: any) => {
    //console.log(e);
    //console.log(e.detail.direction);
  }
  
</script>

{#key id}
  <div
    class=tile
    class:selected={selected}
    class:adjacent={adjacent && !selected}
    class:non-adjacent={active && !adjacent && !selected}
    class:matched={highlighted === 'green'}
    class:bonus={highlighted === 'purple'}
    class:intersection={highlighted === 'red'}
    class:long={highlighted === 'orange'}
    class:tiny={size === 'tiny'}
    class:small={size === 'small'}
    class:large={size === 'large'}
  >
    <span>{letter}</span>
    <span class=score>{scoreTile(letter)}</span>
    <span class=debug-id>{id}</span>
    {#if multiplier > 1}
      <span
        class=multiplier
        class:two={multiplier === 2}
        class:three={multiplier === 3}
      >
        {multiplier}
        <Close size='0.625em' />
      </span>
    {/if}
  </div>
{/key}

<style>
	.tile {
    position: relative;
    grid-column: 1/2;
    grid-row: 1/2;
    transition: all 0.2s ease-out;
    background-color: #F5F6FA;
    border: 1px solid #C4E0E3;
    border-bottom: 2px solid #C4E0E3;
    border-radius: 4px;
		width: 100%;
		height: 100%;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 17, 255, 0);
	}
  :global(body.dark-mode) .tile {
    background-color: #2F3640;
    border-color: black;
  }
  .tile.small {
    width: 2em;
    height: 2em;
    font-size: 1em;
  }
  .tile.tiny {
    position: inherit;
    width: 1.5em;
    height: 1.5em;
    font-size: 0.75em;
    margin: 0.125em;
  }
  @media (min-width: 769px) {
    .tile.small {
      font-size: 0.75em;
    }
    .tile.large {
      font-size: 0.75em;
    }
    .tile.tiny {
      width: 2em;
      height: 2em;
      font-size: 1em;
    }
  }
  .tile.selected {
    background-color: #C4E0E3;
    border-color: #9ec1c5;
  }
  :global(body.dark-mode) .tile {
    color: white;
  }
  :global(body.dark-mode) .tile.selected {
    background-color: #2C47D3;
    border-color: #122aa1;
  }
  .tile.matched {
    background-color: #A2F594;
    border-color: #56ad47;
  }
  .tile.bonus {
    background-color: #a994f5;
    border-color: #474ead;
  }
  .tile.intersection {
    background-color: #d85454;
    border-color: #bb2020;
  }
  .tile.long {
    background-color: #d8b554;
    border-color: #b89d05;
  }
  :global(body.dark-mode) .tile.matched {
    background-color: #2A9618;
    border-color: #28701b;
  }
  :global(body.dark-mode) .tile.bonus {
    background-color: #3f21ac;
    border-color: #3800a1;
  }
  :global(body.dark-mode) .tile.intersection {
    background-color: #ac2121;
    border-color: #7e0000;
  }
  :global(body.dark-mode) .tile.long {
    background-color: #cc9601;
    border-color: #836f00;
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
    border-radius: 4px 0 0 0;
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
  :global(body.dark-mode) .multiplier.two {
    background: linear-gradient(to bottom right, #a16e00 0%, #a16e00 50%, #ffffff00 50%, #ffffff00 100%);
  }
  :global(body.dark-mode) .multiplier.three {
    background: linear-gradient(to bottom right, #b43900 0%, #b43900 50%, #ffffff00 50%, #ffffff00 100%);
  }
  .debug-id {
    position: absolute;
    opacity: 0;
    font-size: 0.5em;
    font-weight: normal;
    top: 0;
    right: 0;
    padding: 0.2em;
  }
  .score {
    position: absolute;
    font-size: 0.5em;
    font-weight: normal;
    opacity: 0.8;
    bottom: 0;
    right: 0.4em;
  }
  .tile.tiny .score {
    display: none;
  }
  
  /* flip over animation */
  /* Position the front and back side */
	.flip-box-front, .flip-box-back {
		position: absolute;
		width: 100%;
		height: 100%;
		-webkit-backface-visibility: hidden; /* Safari */
		backface-visibility: hidden;
		box-shadow: -1px 1px 3px black;
	}

	/* Style the front side */
	.flip-box-front {
		background-color: #ddd;
		color: black;
		display: flex;
		justify-content: center;
	}
	
	/* Style the back side */
	.flip-over {
    transition-duration: 0.5s;
		transform: rotateY(90deg);
	}

</style>