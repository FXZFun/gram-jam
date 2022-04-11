<script lang='ts'>

  import { v4 as uuid } from 'uuid';
  import { sample } from './letters';
  import { flip } from 'svelte/animate';

	import { fly } from 'svelte/transition';
  
  import Restart from 'svelte-material-icons/Restart.svelte';
  import Shuffle from 'svelte-material-icons/Shuffle.svelte';
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
  import Title from './Title.svelte';
  import { shuffle } from './shuffle';
  import { send, receive, animationDuration } from './animations';
import Definition from './Definition.svelte';

  const ROWS = 7;
  const COLS = 6;

  let gameId: string;
	let board: Board = [];
  let words: Match[] = [];
  let turn = 0;
  let remainingSwaps = 10;
  let shuffles = 1;
  let streak = 0;
  let bestStreak = 0;
  let lost = false;
  let totalScore = 0;
  let latestChain = 0;
  let bestChain = 0;
  // for disabling the chain pill after a while
  let chainTimeout: NodeJS.Timeout;
  let gameoverTimeout: NodeJS.Timeout;
  let latestWord: Tile[] = undefined;
  let latestScore: number = undefined;
  
  const handleReset = () => {
    gameId = uuid();
    const tempBoard = [];
    lost = false;
    turn = 0;
    totalScore = 0;
    remainingSwaps = 10;
    shuffles = 1;
    streak = 0;
    bestStreak = 0;
    bestChain = 0;
    latestWord = undefined;
    words = [];
    for (let i = 0; i < COLS; i++) {
      tempBoard.push([]);
      for (let j = 0; j < ROWS; j++) {
        const tile = sample([], 1);
        tempBoard[i].push(tile);
      }
    }
    
    let matches = findWords(tempBoard);
    while (matches.length) {
      for (const match of matches) {
        if (match.axis === 'intersection') continue;
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
    
    for (const [i, col] of tempBoard.entries()) {
      for (const [j, row] of col.entries()) {
        tempBoard[i][j].multiplier = 1;
        const prevTile = board?.[i]?.[j];
        // keep reference to previous tileId for flip transition
        if (prevTile) {
          tempBoard[i][j].id = prevTile.id;
        }
      }
    }
    
    for (let i = 0; i < 3; i++) {
      const col = Math.floor(Math.random() * COLS);
      const row = Math.floor(Math.random() * ROWS);
      tempBoard[col][row].multiplier = 2;
    }

    board = tempBoard;
  }
  
 
  let selected: string[] = [];
  let toClear: string[]= [];
  let matchBonus: boolean = undefined;
  
  const handleDrag = (e: DragEvent) => {
    console.log(e);
  }
  
  const isSelected = (i: number, j: number) => {
    return selected.includes([i, j].join(','))
  };
  
  const getTileKey = (id: number) => {
    return `${id}|${selected.join('|')}|${toClear.join('|')}`
  }
  
  const isMatched = (i: number, j: number) => (
    toClear?.includes([i, j].join(','))
  );
  
  const isAdjacent = (i: number, j: number) => (
    true
    //selected[0]
    //  && Math.abs(i - selected[0][0]) <= 1
    //  && Math.abs(j - selected[0][1]) <= 1
  )
  
  const handleIntroStart = () => {
    // console.log("started");
  }
  
  const handleIntroEnd = () => {
    // console.log("ended");
  }
  
  const handleClick = (i: number, j: number) => {
    const coord = [i, j].join(',');
    if (selected.length === 0) {
      selected = [coord];
    } else if (selected.length === 1 && !(selected[0] === coord)) {
      turn++;
      const [ i2, j2 ] = selected[0].split(',').map(i => parseInt(i));

      // the ol' switcheroo
      const first = board[i][j];
      board[i][j] = board[i2][j2];
      board[i2][j2] = first;
      // clear selection after switch
      selected.push(coord);
      setTimeout(() => {
        selected = [];
      }, 500);

      // if tiles are adjacent deduct 1 swap
      // else deduct 2
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
      
      const [ match, ] = findWords(board);
      if (match) {
        handleScore(match);
      } else {
        streak = 0;
        if (remainingSwaps <= 0) {
          setTimeout(() => {
            lost = true;
          }, 1000);
        }
      }

    } else {
      // click same tile twice
      selected = [];
    }
  }
  
  const handleClearSelection = () => {
    selected = [];
    toClear = [];
    matchBonus = undefined;
  }
  
  // chain is incremented on subsequent recursive calls of handleScore
  const handleScore = (match: Match, chain = 0, timeout = 1000) => {
    if (match) {
      streak++;
      toClear = match.coords.map(c => c.join(','));

      // highlight words that give shuffle bonus
      if ((match.axis === 'row' && match.word.length === COLS)
          || (match.axis === 'col' && match.word.length === ROWS)
          || (match.axis === 'intersection')) {
          matchBonus = true;
      }

      // let animation play
      setTimeout(() => {

        if (streak > bestStreak) {
          bestStreak = streak;
        }
        if (match.axis === 'intersection') {
          shuffles++;
        }
        if (match.word.length === COLS && match.axis === 'row') {
          shuffles++;
        }
        if (match.word.length === ROWS && match.axis === 'col') {
          shuffles++;
        }
        words = words.concat([match]);
     
        if (chain === 0) {
          remainingSwaps += Math.max(match.word.length - 4, 0);
        } else {
          remainingSwaps++;
        }
        latestChain = chain;
        bestChain = Math.max(bestChain, latestChain);
      
        latestWord = match.word;
        latestScore = match.score;
        totalScore += match.score;
        board = handleRemoveLetters(board, match.coords);
        let [ nextMatch, ] = findWords(board);
        if (match) {
          handleClearSelection();
          handleScore(nextMatch, chain + 1);
        }
      }, timeout)

      if (chainTimeout) clearTimeout(chainTimeout);
      if (gameoverTimeout) clearTimeout(gameoverTimeout);
    }

    chainTimeout = setTimeout(() => {
      latestChain = 0;
    }, timeout * 3);

    gameoverTimeout = setTimeout(() => {
        if (remainingSwaps <= 0) {
          lost = true;
        }
    }, timeout * 2);
  }
  
  const handleRemoveLetters = (board: Board, coords: Array<[number, number]>) => {

    // copy previous board
    const tempBoard = board.map(col => col.map(tile => tile));
    // clear column
    for (const [ x, y ] of coords) {
      tempBoard[x][y] = undefined;
    }
    
    const cleared = tempBoard.map(col => (
      col.reverse()
        .filter(tile => tile != undefined)
    ));
    
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (cleared[i][j] == undefined) {
          cleared[i][j] = sample(cleared, 1, turn);
        }
      }
    }

    return cleared.map(col => col.reverse());
  }
  
  const handleShuffle = () => {
    shuffles--;
    const coords = Array.from({ length: 42 }).map(_ => ([
      Math.floor(Math.random() * COLS),
      Math.floor(Math.random() * ROWS),
    ]));
    const shuffledCoords = shuffle([...coords]);
    const tempBoard = board.map(col => col.map(tile => tile));
    coords.forEach((coord, i) => {
      const newCoord = shuffledCoords[i];
      const tmp = tempBoard[coord[0]][coord[1]];
      tempBoard[coord[0]][coord[1]] = tempBoard[newCoord[0]][newCoord[1]];
      tempBoard[newCoord[0]][newCoord[1]] = tmp;
    });
    board = tempBoard;
    setTimeout(() => {
      const [ match, ] = findWords(board);
      if (match) {
        handleScore(match);
      }
    }, 500);
  }

  // initialize board on first load
  handleReset();
 
</script>

<div class=container>
  <div class=title>
    <Title />
  </div>
  <div class=status>
    <Swaps swaps={remainingSwaps} />
    <Streak {streak} />
    <WordChain chain={latestChain} />
  </div>
  <div class=shuffle-container>
    <ActionButton
      onClick={shuffles > 0 ? handleShuffle : undefined}
      disabled={shuffles === 0}
    >
      <span>
        {shuffles}
      </span>
        <Shuffle />
    </ActionButton>
  </div>
  <div class=score-container>
    Score:
    {#key totalScore}
      <div class=score in:fly={{ y: 20 }}>{totalScore}</div>
    {/key}
  </div>
  <div class=latest-word>
    {#if latestWord !== undefined}
      <div>Latest Word:</div>
      <div class=word-container>
        <div class=word-score>
          <Definition word={latestWord.map(t => t.letter).join('')} />
        </div>
        <Word word={latestWord} />
        <div class=word-score>+{latestScore}</div>
      </div>
    {/if}
  </div>
  <div class=game>
    {#each board as row, i}
        <div class=row>
          {#each row as tile, j (tile.id)}
            <div
              animate:flip="{{duration: animationDuration}}"
              in:receive="{{
                key: tile.id,
                delay: 0,
              }}"
              out:send="{{
                key: tile.id,
                delay: 0,
              }}"
              on:introstart="{handleIntroStart}"
              on:introend="{handleIntroEnd}"
              on:click={() => handleClick(i, j)}
            >
              <BoardTile
                gameId={gameId}
                letter={tile.letter}
                active={!!selected.length}
                selected={selected.includes([i, j].join(','))}
                matched={toClear.includes([i, j].join(','))}
                adjacent={false}
                bonus={matchBonus}
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
  {gameId}
  {lost}
  score={totalScore}
  onReset={handleReset}
  {bestStreak}
  {bestChain}
  turns={turn}
  numWords={words.length}
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
    font-weight: bold;
  }
  .word-container {
    display: flex;
    align-items: center;
    width: 100%;
  }
  .word-score {
    width: 3em;
    overflow: visible;
  }
  :global(body.dark-mode) .latest-word {
    color: white;
  }
  .controls {
    width: 100%;
    display: flex;
    justify-content: center;
    padding-top: 1em;
  }
  .spacing {
    width: 1em;
  }
  .row {
    display: flex;
    flex-direction: column;
  }
  .score-container {
    margin-top: 2em;
    position: relative;
    display: flex;
    justify-content: center;
    font-weight: bold;
    font-size: 1.75em;
  }
  .shuffle-container {
    position: absolute;
    padding: 0.75em;
    font-size: 1.25em;
    top: 0;
    right: 0;
  }
  .shuffle-container span {
    padding: 0.25em;
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
    flex-direction: column;
    padding: 0.75em;
    position: absolute;
    top: 0;
    left: 0;
  }
</style>