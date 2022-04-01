<script lang="ts">

  import { sample } from './letters';
  import { points } from './letters';
  import { flip } from 'svelte/animate';

  //
	import { quintOut } from 'svelte/easing';
	import { crossfade } from 'svelte/transition';
  
  import { findWords } from './gameLogic';
  import type { Board } from './types';

	const [send, receive] = crossfade({
		duration: d => 200, //Math.sqrt(d * 200),

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
  //

	let board: Board = [];
  let remainingSwaps = 10;
  let totalScore = 0;
  let newScore: number = undefined;
  let latestWord: string = undefined;
  let shiftMod = false;
  for (let i = 0; i < 6; i++) {
    board.push([]);
    for (let j = 0; j < 10; j++) {
      board[i].push(sample());
    }
  }
  
  let selected: [number, number] | undefined = undefined;
  let shiftSelected: [number, number] | undefined = undefined;
  
  let rangeX: [number, number] | undefined = undefined;
  let rangeY: [number, number] | undefined = undefined;
  
  const handleDrag = (e: DragEvent) => {
    console.log(e);
  }
  
  const handleClick = (i: number, j: number) => {
    console.log(i, j);
    if (shiftMod) {
      if (!shiftSelected) {
        shiftSelected = [i, j];
        rangeX = [i, i];
        rangeY = [j, j];
      } else {
        if (shiftSelected[0] === i || shiftSelected[1] === j) {
          rangeX = [shiftSelected[0], i];
          rangeY = [shiftSelected[1], j];
          rangeX.sort();
          rangeY.sort();
        } else {
          shiftSelected = undefined;
        }
      }
    }
    // swap
    else {
      shiftSelected = rangeX = rangeY = undefined;
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
          setTimeout(() => {
            handleScore();
          }, 500)
        }
      } else {
        selected = undefined;
      }
    }
  }
  
  const handleReset = (i: number, j: number) => {
    board[i][j] = sample();
  }
  
  const handleShiftDown = (e: KeyboardEvent) => {
    if (e.key === 'Shift') shiftMod = true;
  }

  const handleShiftUp = (e: KeyboardEvent) => {
    if (e.key === 'Shift') shiftMod = false;
  }
  
  const handleClearSelection = () => {
    console.log('clear');
    selected = undefined;
    shiftSelected = undefined;
    rangeX = undefined;
    rangeY = undefined;
  }
  
  const handleScore = () => {
    console.log('scored');
    newScore = 0;
    const wordLetters: string[] = [];
    for (let i = rangeX[0]; i <= rangeX[1]; i++) {
      for (let j = rangeY[0]; j <= rangeY[1]; j++) {
        const [ letter ] = board[i][j];
        newScore += points[letter]
        wordLetters.push(letter);
      }
    }
    totalScore += newScore;
    latestWord = wordLetters.join('');
    handleRemoveLetters();
    handleClearSelection();
  }
  
  const handleRemoveLetters = () => {
    // clear column
    let wordLength: number;
    if (rangeX[0] === rangeX[1]) {
      const wordLength = rangeY[1] - rangeY[0] + 1;
      const i = rangeX[0];
      for (let j = rangeY[1]; j >= 0; j--) {
        const newLetter = board[i][j - wordLength];
        console.log('col', i, j - wordLength, newLetter);
        if (newLetter) {
          board[i][j] = newLetter;
        } else {
          board[i][j] = sample();
        }
      }
    // clear row
    } else {
      wordLength = rangeX[1] - rangeX[0] + 1;
      for (let j = rangeY[1]; j >= 0; j--) {
        for (let i = rangeX[0]; i <= rangeX[1]; i++) {
          const newLetter = board[i][j - 1];
          console.log('row', i, j - 1, newLetter);
          if (newLetter) {
            board[i][j] = newLetter;
          } else {
            board[i][j] = sample();
          }
        }
      }
    }
    console.log(wordLength);
    switch (wordLength) {
      case 4:
        remainingSwaps += 1;
        break;
      case 5:
        remainingSwaps += 2;
        break;
      case 6:
        remainingSwaps += 3;
        break;
      default:
        console.log('remainingSwaps', remainingSwaps);
        break;
    }
  }
</script>

<svelte:window
  on:keydown={handleShiftDown}
  on:keyup={handleShiftUp}
/>

<div on:click|self={handleClearSelection}>
  <div>Score: {totalScore}</div>
  {#if latestWord !== undefined}
    <div>Latest Word: {latestWord} ({newScore} points)</div>
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
              on:click={(e) => handleClick(i, j)}
              on:dblclick={(e) => handleReset(i, j)}
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
  <button on:click={handleClearSelection}>Clear</button>
  <button on:click={handleScore}>Score</button>
</div>

<style>
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
		width: 2em;
		height: 2em;
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
  .tile.selected {
    background-color: darkgreen;
    box-sizing: border-box;
    -moz-box-sizing: border-box;
    -webkit-box-sizing: border-box;
  }
  .range-selected {
    background-color: lightcoral !important;
  }
</style>