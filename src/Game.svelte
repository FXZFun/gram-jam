<script lang="ts">

  import { sample } from './letters';
  import { points } from './letters';
  import { flip } from 'svelte/animate';

  //
	import { quintOut } from 'svelte/easing';
	import { crossfade, fly } from 'svelte/transition';
  
  import { findWords } from './gameLogic';
  import type { Board, Match } from './types';

	const [send, receive] = crossfade({
		duration: d => 200,

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: t => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

  const ROWS = 10;
  const COLS = 6;

	let board: Board = [];
  let words: Match[] = [];
  let remainingSwaps = 10;
  let lost = false;
  let totalScore = 0;
  let latestChain = 0;
  let newScore: number = undefined;
  let latestWord: string = undefined;
  
  const handleReset = () => {
    board = [];
    lost = false;
    totalScore = 0;
    remainingSwaps = 10;
    newScore = undefined;
    latestWord = undefined;
    words = [];
    for (let i = 0; i < COLS; i++) {
      board.push([]);
      for (let j = 0; j < ROWS; j++) {
        board[i].push(sample());
      }
    }
    // TODO clear these out ahead of time
    // const matches = findWords(board);
    // handleScore(matches, 0);
  }
  
 
  let selected: [number, number] | undefined = undefined;
  let rangeX: [number, number] | undefined = undefined;
  let rangeY: [number, number] | undefined = undefined;
  
  const handleDrag = (e: DragEvent) => {
    console.log(e);
  }
  
  const handleClick = (i: number, j: number) => {
    if (!selected) {
      selected = [i, j];
    } else if (!(selected[0] === i && selected[1] === j)) {
      const [ i2, j2 ] = selected;
      const first = board[i][j];
      board[i][j] = board[i2][j2];
      board[i2][j2] = first;
      selected = undefined;
      remainingSwaps--;
      const matches = findWords(board);
      handleScore(matches);
    } else {
      selected = undefined;
    }
    if (remainingSwaps === 0) {
      setTimeout(() => {
        lost = true;
      }, 505);
    }
  }
  
  const handleClearSelection = () => {
    selected = rangeX = rangeY = undefined;
  }
  
  const handleScore = (matches: Match[], chain = 0, timeout = 500) => {
    if (matches.length) {
    // for (let match of matches) {
      const match = matches[0];
      if (match.axis === 'row') {
        rangeX = [match.i, match.i + match.word.length - 1];
        rangeY = [match.j, match.j]
      } else {
        rangeX = [match.i, match.i];
        rangeY = [match.j, match.j + match.word.length - 1];
      }

      newScore = match.score;
      totalScore += match.score;
      latestWord = match.word;
      words = words.concat([match]);
     
      remainingSwaps += match.word.length - 4 + chain;
      latestChain = chain;
      setTimeout(() => {
        handleRemoveLetters();
        handleClearSelection();
        // remainingSwaps += match.word.length - 4;
        matches = findWords(board);
        handleScore(matches, chain + 1);
      }, timeout)
    }
  }
  
  const handleRemoveLetters = () => {
    // clear column
    if (rangeX[0] === rangeX[1]) {
      const wordLength = rangeY[1] - rangeY[0] + 1;
      const i = rangeX[0];
      for (let j = rangeY[1]; j >= 0; j--) {
        const newLetter = board[i][j - wordLength];
        if (newLetter) {
          board[i][j] = newLetter;
        } else {
          board[i][j] = sample();
        }
      }
    // clear row
    } else {
      for (let j = rangeY[1]; j >= 0; j--) {
        for (let i = rangeX[0]; i <= rangeX[1]; i++) {
          const newLetter = board[i][j - 1];
          if (newLetter) {
            board[i][j] = newLetter;
          } else {
            board[i][j] = sample();
          }
        }
      }
    }
  }
  
  const handleShare = () => {
    alert('coming soon!');
  }

  // initialize board on first load
  handleReset();
 
</script>

<div class='container'>
  {#key totalScore}
    <div class='score-container'>
      Score:
      <div in:fly={{ y: 20 }}>{totalScore}</div>
    </div>
  {/key}
  {#if latestWord !== undefined}
    <div>Latest Word: {latestWord} ({newScore} points)</div>
  {/if}
  {#if latestChain > 0}
    {#key latestChain}
      <div class='chain'>word chain: <span in:fly={{ y: -20 }}>{latestChain + 1}</span></div>
    {/key}
  {/if}
  <div>Swaps left: {remainingSwaps}</div>
  <div class='game'>
    {#each board as row, i}
        <div class='row'>
          {#each row as letter, j (letter[1])}
            <div
              animate:flip="{{duration: 200}}"
              in:receive="{{key: letter[1]}}"
              out:send="{{key: letter[1]}}"
              on:drag={handleDrag}
              on:click={() => handleClick(i, j)}
              class={`tile
                ${selected && i === selected[0] && j === selected[1]
                  ? 'selected'
                  : ''}
                ${rangeX && rangeY &&
                  rangeX[0] <= i && i <= rangeX[1] &&
                  rangeY[0] <= j && j <= rangeY[1]
                    ? 'range-selected'
                    : ''
                }  
                  `}
            >
              <span>{letter[0]}</span>
              <span class='score'>{points[letter[0]]}</span>
            </div>
          {/each}
        </div>
    {/each}
  </div>
  <button class='action' on:click={handleReset}>Reset Game</button>
  {#if lost}
    <div class='dialog-container'>
      <div class='dialog'>
        <h1>Game Over</h1>
        <h3>Best words:</h3>
          <table>
          {#each words.sort((a, b) => b.score - a.score).slice(0, 10) as word}
            <tr>
              <td>{word.word.toUpperCase()}:</td>
              <td>{word.score}</td>
            </tr>
          {/each}
          </table>
        <button class='action' on:click={handleShare}>Share results</button>
        <button class='action' on:click={handleReset}>Reset Game</button>
      </div>
    </div>
  {/if}
</div>

<style>
  .container {
    position: relative;
  }
  .game {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
  }
  .row {
    display: flex;
    flex-direction: column;
  }
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
  .score {
    position: absolute;
    font-size: 0.5em;
    font-weight: normal;
    bottom: 0;
    right: 0;
    padding: 0.2em;
  }
  .score-container {
    display: flex;
    justify-content: center;
    font-size: 2em;
  }
  .score-container div {
    padding-left: 8px;
  }
  .chain {
    position: absolute;
    top: 0;
    left: 0;
  }
  .tile.selected {
    background-color: darkgreen;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .range-selected {
    background-color: lightcoral !important;
  }
  .dialog-container {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }
  .dialog {
    border: none;
    border-radius: 8px;
    box-shadow: 0 0 8px darkgray;
    background-color: white;
    padding: 16px;
  }
  .action {
    background-color: green;
    color: white;
    border: none;
    border-radius: 4px;
    text-transform: uppercase;
    margin: 0;
  }
  table {
    width: 100%;
    text-align: start;
    margin-bottom: 8px;
  }
</style>