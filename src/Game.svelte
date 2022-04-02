<script lang="ts">

  import { sample } from './letters';
  import { points } from './letters';
  import { flip } from 'svelte/animate';

  //
	import { quintOut } from 'svelte/easing';
	import { crossfade, fly } from 'svelte/transition';
  
  import { findWords } from './gameLogic';
  import type { Board, Match } from './types';
  import WordChain from './WordChain.svelte';
  import Modal from './Modal.svelte';
  import Swaps from './Swaps.svelte';
  import Tile from './Tile.svelte';
  import Streak from './Streak.svelte';
import Word from './Word.svelte';

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

  const ROWS = 8;
  const COLS = 6;

	let board: Board = [];
  let words: Match[] = [];
  let remainingSwaps = 10;
  let streak = 0;
  let bestStreak = 0;
  let lost = false;
  let totalScore = 0;
  let latestChain = 0;
  let bestChain = 0;
  let newScore: number = undefined;
  let latestWord: string = undefined;
  
  const handleReset = () => {
    const tempBoard = [];
    lost = false;
    totalScore = 0;
    remainingSwaps = 10;
    newScore = undefined;
    latestWord = undefined;
    words = [];
    for (let i = 0; i < COLS; i++) {
      tempBoard.push([]);
      for (let j = 0; j < ROWS; j++) {
        tempBoard[i].push(sample([]));
      }
    }

    let matches = findWords(tempBoard);
    while (matches.length) {
      for (const match of matches) {
        console.log('scrambling', match.word);
        const tempTile = tempBoard[match.i][match.j];
        // TODO more sophisticated scramble
        if (match.axis === 'row') {
          tempBoard[match.i][match.j] = tempBoard[match.i + 1][match.j];
          tempBoard[match.i + 1][match.j] = tempTile;
        } else {
          tempBoard[match.i][match.j] = tempBoard[match.i][match.j + 1];
          tempBoard[match.i][match.j + 1] = tempTile;
        }
      }
      matches = findWords(tempBoard);
    }
    board = tempBoard;
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

      const distanceX = Math.abs(i - i2);
      const distanceY = Math.abs(j - j2);
      let penalty = 0;
      if (Math.max(distanceX, distanceY) === 1) {
        penalty = 1;
      } else {
        penalty = 2;
      }
      if (streak > 0) {
        penalty--;
      }
      remainingSwaps -= penalty;
      
      const matches = findWords(board);
      if (matches.length > 0) {
        streak++;
        if (streak > bestStreak) bestStreak = streak;
      } else {
        streak = 0;
      }
      handleScore(matches);
    } else {
      selected = undefined;
    }
    if (remainingSwaps <= 0) {
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
      if (latestChain > bestChain) bestChain = latestChain;
      setTimeout(() => {
        handleRemoveLetters();
        handleClearSelection();
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
          board[i][j] = sample(board);
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
            board[i][j] = sample(board);
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
    <div>Latest Word:</div>
    <Word word={latestWord} />
  {/if}
  <div class=multipliers>
    <Streak {streak} />
    <WordChain chain={latestChain} />
  </div>
  <Swaps swaps={remainingSwaps} />
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
            >
              <Tile
                letter={letter[0]}
                selected={selected && i === selected[0] && j === selected[1]}
                matched={rangeX && rangeY &&
                  rangeX[0] <= i && i <= rangeX[1] &&
                  rangeY[0] <= j && j <= rangeY[1]
                }
              />
            </div>
          {/each}
        </div>
    {/each}
  </div>
  <button class='action' on:click={handleReset}>Reset Game</button>
  <Modal open={lost} onClose={handleReset}>
    <h1>Game Over</h1>
    <h3>Best Streak: {bestStreak}</h3>
    <h3>Best Chain: {bestChain}</h3>
    <h3>Best Words:</h3>
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
  </Modal>
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
  .score-container {
    display: flex;
    justify-content: center;
    font-size: 2em;
  }
  .score-container div {
    padding-left: 8px;
  }
  .multipliers {
    position: absolute;
    top: 0;
    left: 0;
    display: flex;
    flex-direction: row;
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