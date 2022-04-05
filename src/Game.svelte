<script lang="ts">

  import { sample } from './letters';
  import { points } from './letters';
  import { flip } from 'svelte/animate';

  //
	import { quintOut } from 'svelte/easing';
	import { crossfade, fly } from 'svelte/transition';
  
  import Restart from 'svelte-material-icons/Restart.svelte';
  import { findWords } from './gameLogic';
  import type { Board, Match, Tile } from './types';
  import WordChain from './WordChain.svelte';
  import Swaps from './Swaps.svelte';
  import BoardTile from './BoardTile.svelte';
  import Streak from './Streak.svelte';
  import Word from './Word.svelte';
  import GameOver from './GameOver.svelte';
  import ActionButton from './ActionButton.svelte';
import Info from './Info.svelte';
import DarkMode from './DarkMode.svelte';

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

  const ROWS = 7;
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
  // for disabling the chain pill after a while
  let chainTimeout: NodeJS.Timeout;
  let latestWord: Tile[] = undefined;
  let latestScore: number = undefined;
  
  const handleReset = () => {
    const tempBoard = [];
    lost = false;
    totalScore = 0;
    remainingSwaps = 10;
    streak = 0;
    bestStreak = 0;
    bestChain = 0;
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
        const tempTile = tempBoard[match.i][match.j];
        // TODO more sophisticated scramble
        const toSwap =  Math.floor(Math.random() * match.word.length);
        if (match.axis === 'row') {
          tempBoard[match.i][match.j] = tempBoard[match.i + toSwap][match.j];
          tempBoard[match.i + toSwap][match.j] = tempTile;
        } else {
          tempBoard[match.i][match.j] = tempBoard[match.i][match.j + toSwap];
          tempBoard[match.i][match.j + toSwap] = tempTile;
        }
      }
      matches = findWords(tempBoard);
    }
    board = tempBoard;
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
  
  const handleScore = (matches: Match[], chain = 0, timeout = 750) => {
    if (matches.length) {
      if (chain > 0) {
        streak++;
        remainingSwaps++;
      }
      const match = matches[0];
      if (match.axis === 'row') {
        rangeX = [match.i, match.i + match.word.length - 1];
        rangeY = [match.j, match.j]
      } else {
        rangeX = [match.i, match.i];
        rangeY = [match.j, match.j + match.word.length - 1];
      }

      totalScore += match.score;
      latestWord = match.word;
      latestScore = match.score;
      words = words.concat([match]);
     
      remainingSwaps += match.word.length - 4;
      latestChain = chain;
      if (latestChain > bestChain) bestChain = latestChain;
      
      setTimeout(() => {
        handleRemoveLetters();
        handleClearSelection();
        matches = findWords(board);
        handleScore(matches, chain + 1);
        clearTimeout(chainTimeout);
      }, timeout)

      chainTimeout = setTimeout(() => {
        console.log('reseting chain');
        latestChain = 0;
      }, timeout * 2 + 10);
     }
  }
  
  const handleRemoveLetters = () => {
    // clear column
    if (rangeX[0] === rangeX[1]) {
      const wordLength = rangeY[1] - rangeY[0] + 1;
      const i = rangeX[0];
      for (let j = rangeY[1]; j >= 0; j--) {
        const tmp = board[i][j - wordLength];
        if (tmp) {
          board[i][j] = tmp;
        } else {
          board[i][j] = sample(board);
        }
      }
    // clear row
    } else {
      for (let j = rangeY[1]; j >= 0; j--) {
        for (let i = rangeX[0]; i <= rangeX[1]; i++) {
          const tmp = board[i][j - 1];
          if (tmp) {
            board[i][j] = tmp;
          } else {
            board[i][j] = sample(board);
          }
        }
      }
    }
  }

  // initialize board on first load
  handleReset();
 
</script>

<div class=container>
  <div class=status>
    <Streak {streak} />
    <WordChain chain={latestChain} />
    <div class=spacer />
    <Swaps swaps={remainingSwaps} />
  </div>
  {#key totalScore}
    <div class=score-container>
      Score:
      <div class=score in:fly={{ y: 20 }}>{totalScore}</div>
    </div>
  {/key}
  <div class=latest-word>
    {#if latestWord !== undefined}
      <div>Latest Word:</div>
      <Word word={latestWord} score={latestScore} />
    {/if}
  </div>
  <div class='game'>
    {#each board as row, i}
        <div class='row'>
          {#each row as tile, j (tile.id)}
            <div
              animate:flip="{{duration: 200}}"
              in:receive="{{key: tile.id}}"
              out:send="{{key: tile.id}}"
              on:drag={handleDrag}
              on:click={() => handleClick(i, j)}
            >
              <BoardTile
                letter={tile.letter}
                active={!!selected}
                selected={selected && i === selected[0] && j === selected[1]}
                adjacent={selected
                  && Math.abs(i - selected[0]) <= 1
                  && Math.abs(j - selected[1]) <= 1
                }
                matched={rangeX && rangeY &&
                  rangeX[0] <= i && i <= rangeX[1] &&
                  rangeY[0] <= j && j <= rangeY[1]
                }
                multiplier={tile.multiplier}
              />
            </div>
          {/each}
        </div>
    {/each}
  </div>
  <div class=controls>
    <ActionButton onClick={handleReset}>
      <Restart size='1em' />
      Reset Game
    </ActionButton>
    <div class=spacing />
		<Info />
    <div class=spacing />
    <DarkMode />
  </div>
</div>
<GameOver
  {lost}
  score={totalScore}
  onReset={handleReset}
  {bestStreak}
  {bestChain}
  bestWords={words.sort((a, b) => b.score - a.score).slice(0, 5)}
/>

<style>
  .container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .game {
    display: flex;
    flex-direction: row;
    margin-left: auto;
    margin-right: auto;
  }
  .latest-word {
    height: 4em;
  }
  :global(body.dark-mode) .latest-word {
    color: white;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .spacing {
    width: 1em;
  }
  .row {
    display: flex;
    flex-direction: column;
  }
  .score-container {
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 1.75em;
  }
  :global(body.dark-mode) .score-container {
    color: white;
  }
  .score-container div {
    padding-left: 8px;
    flex-grow: 1;
  }
  .status {
    display: flex;
    flex-direction: row;
    padding: 1em;
    width: 100%;
  }
  .status .spacer {
    flex-grow: 1;
  }
</style>