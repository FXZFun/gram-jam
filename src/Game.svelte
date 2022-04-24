<script lang='ts'>

import { onMount } from 'svelte';
import { sample } from './algorithms/letters';

import { fly } from 'svelte/transition';

import Shuffle from 'svelte-material-icons/Shuffle.svelte';
import { loadDictionary } from './algorithms/dictionary';
import { findWords, getMarqueeText } from './algorithms/gameLogic';
import type { Board, Coord, Freqs, HighlightColors, Highlighted, Match, Tile } from './types';
import WordChain from './pills/WordChain.svelte';
import Swaps from './Swaps.svelte';
import Streak from './pills/Streak.svelte';
import GameOver from './modals/GameOver.svelte';
import ActionButton from './components/ActionButton.svelte';
import Title from './Title.svelte';
import { shuffle} from './algorithms/shuffle';
import { animationDuration, getAnimationPromise, delay, getBBoxJSON } from './animations';
import type { Trie } from './algorithms/trie';
import GameBoard from './Board.svelte';
import { initializeGameState, sampleBoard, getUserId } from './store';
import BottomControls from './BottomControls.svelte';
import WordContainer from './WordContainer.svelte';
import Stats from './Stats.svelte';
import { saveAnalytics } from './analytics';
  
  let loading = true;
  let dictionary: Trie<string>;
  onMount(async () => {
    dictionary = await loadDictionary();
    loading = false;
    // initialize board on first load
    handleReset();
  });

  const ROWS = 7;
  const COLS = 6;

 
  const showStats = false;
  let game = initializeGameState();

  let marquee: string;
  let freqs: Freqs<string> = {};
  let newLetters: string[] = [];
  
  let introPromises: Record<string, Promise<void>> = {};
  let introResolvers: Record<string, () => void> = {};
  
  let outroPromises: Record<string, Promise<void>> = {};
  let outroResolvers: Record<string, () => void> = {};

  let latestWord: Tile[] = undefined;
  let latestScore: number = undefined;
  
  const handleReset = () => {
    const date = new Date()
    saveAnalytics({
      gameId: game.id,
      turns: game.turn,
      bestStreak: game.bestStreak,
      bestChain: game.bestChain,
      date: date.toISOString(),
      userId: getUserId(),
      words: game.words.map(w => w.word.map(tile => tile.letter).join('')),
      duration: Math.round((+date - game.startedAt) / 1000),
      abandoned: true,
    })

    const prevBoard = game.board;
    game = initializeGameState();

    highlighted = {};
    latestWord = undefined;
    if (!game.board.length) {
      for (let i = 0; i < COLS; i++) {
        game.board.push([]);
        for (let j = 0; j < ROWS; j++) {
          const [ , tile ] = sample([], 1);
          game.board[i].push(tile);
        }
      }
    }
    
    let matches = findWords(dictionary, game.board);
    while (matches.length) {
      for (const match of matches) {
        const a =  match.coords[Math.floor(Math.random() * match.word.length)];
        const b =  match.coords[Math.floor(Math.random() * match.word.length)];

        const tempTile = game.board[a[0]][a[1]];
        game.board[a[0]][a[1]] = game.board[b[0]][b[1]];
        game.board[b[0]][b[1]] = tempTile;
      }
      matches = findWords(dictionary, game.board);
    }
    
    for (const [i, col] of game.board.entries()) {
      for (const [j, row] of col.entries()) {
        // reset multipliers
        game.board[i][j].multiplier = 1;
        const prevTile = prevBoard?.[i]?.[j];
        // keep reference to previous tileId for flip transition
        // TODO consider just having a gameOver specific fallback here
        if (prevTile) {
          game.board[i][j].id = prevTile.id;
        }
      }
    }
    
    // start game with 3 2x multipliers
    for (let i = 0; i < 3; i++) {
      const col = Math.floor(Math.random() * COLS);
      const row = Math.floor(Math.random() * ROWS);
      game.board[col][row].multiplier = 2;
    }

    game = game;
  }
 
  let selectedCoords: string[] = [];
  let selectedTiles: number[] = [];
  let highlighted: Highlighted = {};
  let animating = false;
  
  const getTileId = (e) => parseInt((e.target as HTMLElement).getAttribute('data-id'));
  
  const handleIntroStart = (e) => {
    const tileId = getTileId(e);
    const [ introPromise, introResolve ] = getAnimationPromise();
    introPromises[tileId] = introPromise;
    introResolvers[tileId] = introResolve;
  }
  
  const handleIntroEnd = (e) => {
    const tileId = getTileId(e);
    introResolvers[tileId]?.();
    delete introPromises[tileId];
    delete introResolvers[tileId];
  }
  
  const handleOutroStart = (e) => {
    const tileId = getTileId(e);
    const [ outroPromise, outroResolve ] = getAnimationPromise();
    outroPromises[tileId] = outroPromise;
    outroResolvers[tileId] = outroResolve;
  }
  
  const handleOutroEnd = (e) => {
    const tileId = getTileId(e);
    outroResolvers[tileId]?.();
    delete outroPromises[tileId];
    delete outroResolvers[tileId];
  }
  
  const handleClick = async (i: number, j: number) => {
    if (!animating) {
      animating = true;
      const coord = [i, j].join(',');
      const tileId = game.board[i][j].id;
      if (selectedCoords.length === 0) {
        selectedCoords = [coord];
        selectedTiles = [tileId];
      } else if (selectedTiles.length === 1 && selectedTiles[0] !== tileId) {
        game.turn++;
        const [ i2, j2 ] = selectedCoords[0].split(',').map(i => parseInt(i));

        // the ol' switcheroo
        const first = game.board[i][j];
        game.board[i][j] = game.board[i2][j2];
        game.board[i2][j2] = first;
        game = game;
        // clear selection after switch
        selectedCoords = selectedCoords.concat([coord]);
        selectedTiles = selectedTiles.concat([tileId]);

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

        if (game.streak > 0) {
          penalty--;
        }
        game.remainingSwaps -= penalty;
        game = game;
        
        // gross!
        // wait for end of swap animation
        let bbox = getBBoxJSON();
        while (selectedCoords.length) {
          await delay(50);
          const bbox2 = getBBoxJSON();
          if (bbox === bbox2) {
            clearSelection();
            break;
          }
          bbox = bbox2;
        };
        
        await handleScore();
        // check game lose conditions
      } else {
        // click same tile twice
        clearSelection();
      }
      animating = false;
    }
  }
  
  const clearSelection = () => {
    selectedCoords = [];
    selectedTiles = [];
  }
  
  const handleEndTurn = async () => {
    if (game.remainingSwaps <= 0) {
      await delay(animationDuration * 2);
      game.lost = true;
      animating = false;
    } else {
      // re-enable input faster
      animating = false;
      await delay(animationDuration * 3);
      game.latestChain = 0;
      marquee = undefined;
    }
    game = game;
    return game.lost;
  }
  
  // chain is incremented on subsequent recursive calls of handleScore
  const handleScore = async (chain = 0, shuffle = false) => {
    let words = findWords(dictionary, game.board);
    if (!words.length) {
      if (!shuffle && chain === 0) {
        game.streak = 0;
      }
      return await handleEndTurn();
    }

    game.words = game.words.concat(words[0]);
    highlighted = highlightTiles(words, highlighted);

    const word = words[0];
    let coords = word.coords;
    if (word.intersection) {
      game.intersectingTile = word.intersectingTile;
      game.intersection = word.intersection.split(',').map(c => parseInt(c)) as Coord;
      coords = word.coords.filter(coord => coord.join(',') !== word.intersection)
    } 

    // let user see match before exiting
    await delay(2 * animationDuration / 3);
    score(words[0], chain);

    marquee = getMarqueeText(words[0], chain);

    game.board = removeLetters(game.board, coords);
    game.intersectingTile = undefined;
    game = game;

    await delay(animationDuration);
    await handleScore(chain + 1);
    
    game = game;
  }
  
  const highlightTiles = (words: Match[], prevHighlighted: Highlighted) => {
    const highlighted: Highlighted = {...prevHighlighted};
    for (const word of words) {
      let highlight: HighlightColors = 'green';
      if ((word.axis === 'row' && word.word.length === COLS)
        || (word.axis === 'col' && word.word.length === ROWS)) {
          highlight = 'orange';
      } else if (word.intersectingTile) {
        highlighted[word.intersectingTile.id] = 'red';
        highlight = 'purple';
      }
      for (const tile of word.word) {
        if (!highlighted[tile.id]) {
          highlighted[tile.id] = highlight;
        }
      }
    }
    return highlighted;
  }
  
  const score = (match: Match, chain: number) => {
    game.streak++;

    if (game.streak > game.bestStreak) {
      game.bestStreak = game.streak;
    }
    if (match.intersection) {
      game.shuffles++;
    }
    if (match.word.length === COLS && match.axis === 'row') {
      game.shuffles++;
    }
    if (match.word.length === ROWS && match.axis === 'col') {
      game.shuffles++;
    }

    if (chain === 0) {
      game.remainingSwaps += Math.max(match.word.length - 4, 0);
    } else {
      game.remainingSwaps++;
    }
    game.latestChain = chain;
    game.bestChain = Math.max(game.bestChain, game.latestChain);
    
    latestWord = match.word;
    game.intersectingTile = match.intersectingTile;
    latestScore = match.score;
    game.score += match.score;
  }
  
  const removeLetters = (board: Board, coords: Coord[]) => {

    // clear column
    for (const [ x, y ] of coords) {
      board[x][y] = undefined;
    }
    
    const cleared = board.map(col => (
      col.reverse()
        .filter(tile => tile != undefined)
    ));
    
    let localFreqs: Freqs<string>;
    let localLetters: string[] = [];
    for (let i = 0; i < COLS; i++) {
      for (let j = 0; j < ROWS; j++) {
        if (cleared[i][j] == undefined) {
          const [ stats, tile ] = sample(cleared, 1, game.turn);
          cleared[i][j] = tile;
          localFreqs = stats;
          localLetters.push(tile.letter);
        }
      }
    }
    freqs = localFreqs;
    newLetters = localLetters;

    return cleared.map(col => col.reverse());
  }
  
  const handleShuffle = async () => {
    if (!animating) {
      game.shuffles--;
      clearSelection();
      const coords = Array.from({ length: COLS }).flatMap((_, i) => 
        Array.from({ length: ROWS }).map((_, j) => [i, j])
      );
      const shuffledCoords = shuffle([...coords]);
      const tempBoard = game.board.map(col => col.map(tile => tile));
      coords.forEach((coord, i) => {
        const newCoord = shuffledCoords[i];
        const tmp = tempBoard[coord[0]][coord[1]];
        tempBoard[coord[0]][coord[1]] = tempBoard[newCoord[0]][newCoord[1]];
        tempBoard[newCoord[0]][newCoord[1]] = tmp;
      });
      game.board = tempBoard;
      game = game;

      // pause for animation
      await delay(1200);
      await handleScore(0, true);
    }
  }

</script>

<div class=container>
  <Title />
  <div class=status>
    <Swaps swaps={game.remainingSwaps} />
    <Streak streak={game.streak} />
    <WordChain chain={game.latestChain} />
  </div>
  <div class=shuffle-container>
    <ActionButton
      onClick={game.shuffles > 0 ? handleShuffle : undefined}
      disabled={game.shuffles === 0}
    >
      <span>
        {game.shuffles}
      </span>
      <Shuffle />
    </ActionButton>
  </div>
  <div class=score-container>
    {#if loading}
      Loading Dictionary...
    {:else}
      {#key game.score}
        <div in:fly={{ y: 20 }}>{game.score}</div>
      {/key}
    {/if}
  </div>
  <WordContainer
    {latestWord}
    {latestScore}
    {marquee}
    onIntroStart={handleIntroStart}
    onIntroEnd={handleIntroEnd}
    onOutroStart={handleOutroStart}
    onOutroEnd={handleOutroEnd}
  />
  <GameBoard
    gameId={game.id}
    board={game.board}
    selected={selectedTiles}
    {highlighted}
    onClick={handleClick}
    intersection={game.intersection}
    intersectingTile={game.intersectingTile}
  />
  {#if showStats}
    <Stats {freqs} {newLetters} />
  {/if}
  <div class=spacer />
  <BottomControls onReset={handleReset} />
</div>
{#if game.lost}
  {#key game.id}
    <GameOver
      gameId={game.id}
      score={game.score}
      onReset={handleReset}
      bestStreak={game.bestStreak}
      bestChain={game.bestChain}
      turns={game.turn}
      words={game.words.sort((a, b) => b.score - a.score)}
      numWords={game.words.length}
      duration={Math.round((+new Date() - game.startedAt) / 1000)}
    />
  {/key}
{/if}

<style>
  .container {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 1.5em;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    overscroll-behavior: contain;
    overflow: hidden;
  }
  .spacer {
    flex-grow: 1;
  }
  .score-container {
    transition: color 0.5s ease-in-out;
    color: black;
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
    position: absolute;
    top: 0.5em;
    left: 0.5em;
  }
</style>