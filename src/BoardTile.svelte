 <script lang="ts">

  import Close from 'svelte-material-icons/Close.svelte';
  import { swipe } from 'svelte-gestures';
  import { points } from './letters';
  
  export let letter: string;
  export let gameId: string = undefined;
  export let active: boolean | undefined;
  export let selected: boolean | undefined;
  export let adjacent: boolean | undefined;
  export let matched: boolean | undefined;
  export let bonus: boolean | undefined;
  export let size: 'tiny' | 'small' | 'large' = 'large';
  export let multiplier: 1 | 2 | 3 = 1;

  const pts = points[letter] ?? '';

  let prevGameId: string;
  let prevLetter: string;
  let prevMultiplier: number;
  let prevPoints: string;
  
  const handleSwipe = (e: any) => {
    //console.log(e);
    //console.log(e.detail.direction);
  }
  
  // TODO this is hacky
  $: {
    if (prevGameId !== gameId) {
      setTimeout(() => {
        prevGameId = gameId;
        prevLetter = letter;
        prevMultiplier = multiplier;
        prevPoints = points[prevLetter];
      }, 500);
    }
  }
</script>

<div
  on:swipe={handleSwipe}
  class=tile
  class:selected={selected}
  class:adjacent={adjacent && !selected}
  class:non-adjacent={active && !adjacent && !selected}
  class:matched={matched}
  class:bonus={bonus}
  class:tiny={size === 'tiny'}
  class:small={size === 'small'}
  class:large={size === 'large'}
  class:flip-over={prevGameId && gameId !== prevGameId}
>
  <span>{prevLetter ?? letter}</span>
  <span class=score>{prevPoints ?? pts}</span>
  {#if (prevMultiplier ?? multiplier) > 1}
    <span
      class=multiplier
      class:two={(prevMultiplier ?? multiplier) === 2}
      class:three={(prevMultiplier ?? multiplier) === 3}
    >
      {multiplier}
      <Close size='0.625em' />
    </span>
  {/if}
</div>

<style>
	.tile {
    font-family: 'Poppins', sans-serif;
    position: relative;
    transition: all 0.25s ease-in-out;
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
    width: 1.5em;
    height: 1.5em;
    font-size: 0.75em;
  }
  @media (min-width: 769px) {
    .tile.tiny {
      width: 2em;
      height: 2em;
      font-size: 1em;
    }
  }
  .tile.selected {
    background-color: #C4E0E3;
  }
  :global(body.dark-mode) .tile {
    color: white;
  }
  :global(body.dark-mode) .tile.selected {
    background-color: #2C47D3;
  }
  .tile.matched {
    background-color: #A2F594;
    border-color: #56ad47;
  }
  .tile.matched.bonus {
    background-color: #a994f5;
    border-color: #474ead;
  }
  :global(body.dark-mode) .tile.matched {
    background-color: #2A9618;
  }
  :global(body.dark-mode) .tile.matched.bonus {
    background-color: #3f21ac;
    border-color: #3800a1;
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
  :global(body.dark-mode) .multiplier.two {
    background: linear-gradient(to bottom right, #a16e00 0%, #a16e00 50%, #ffffff00 50%, #ffffff00 100%);
  }
  :global(body.dark-mode) .multiplier.three {
    background: linear-gradient(to bottom right, #b43900 0%, #b43900 50%, #ffffff00 50%, #ffffff00 100%);
  }
  .score {
    position: absolute;
    font-size: 0.5em;
    font-weight: normal;
    bottom: 0;
    right: 0;
    padding: 0.2em;
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