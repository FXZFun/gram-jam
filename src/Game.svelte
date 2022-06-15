<script lang='ts'>

import { onMount } from 'svelte';

import { fly } from 'svelte/transition';

import Shuffle from 'svelte-material-icons/Shuffle.svelte';
import { Dictionary, loadDictionary } from './algorithms/dictionary';
import { DIMS, findWords, getMarqueeText, removeLetters, resetGame } from './algorithms/gameLogic';
import type { HighlightColors, Highlighted, Match } from './types';
import WordChain from './pills/WordChain.svelte';
import Swaps from './Swaps.svelte';
import Streak from './pills/Streak.svelte';
import GameOver from './modals/GameOver.svelte';
import ActionButton from './components/ActionButton.svelte';
import Title from './Title.svelte';
import { shuffle} from './algorithms/shuffle';
import { animationDuration, delay } from './animations';
import GameBoard, { clearSelection, animating } from './Board.svelte';
import game, { clearGame, loadGame } from './store';
import BottomControls from './BottomControls.svelte';
import WordContainer from './WordContainer.svelte';
import Stats from './Stats.svelte';
import { turns, resetTurns, saveAnalytics } from './analytics';
import Spinner from './components/Spinner.svelte';
  
  let dictionary: Dictionary;
  let loading = true;
  onMount(async () => {
    dictionary = await loadDictionary();
    loading = false;
    // initialize board on first load
    loadGame(dictionary);
  });
 
  const showStats = false;

  const handleReset = (abandoned = false) => {
    if (abandoned) {
      saveAnalytics($game, $turns.turns, { abandoned });
    }
    $game = resetGame($game, dictionary);
    clearGame();
    resetTurns();
  }
 
 
  // const getTileId = (e) => parseInt((e.target as HTMLElement).getAttribute('data-id'));
  
  const handleEndTurn = async (chain: number, shuffle: boolean) => {
    if (!shuffle && chain === 0) {
      $game.streak = 0;
    }
    if ($game.remainingSwaps <= 0) {
      await delay(animationDuration * 2);
      $game.lost = true;
      $animating = false;
    } else {
      // re-enable input faster
      $animating = false;
      await delay(animationDuration * 3);
      $game.latestChain = 0;
      $game.marquee = undefined;
    }
    return $game.lost;
  }
  
  // chain is incremented on subsequent recursive calls of handleScore
  const handleScore = async (chain = 0, shuffle = false) => {

    let { words, intersections } = findWords(dictionary, $game.board);
    if (!words.length) {
      return await handleEndTurn(chain, shuffle);
    }

    const word = words[0];
    $game.words.push(word);
    $game.highlighted = highlightTiles(words, $game.highlighted);

    // await delay(100000);
    $game.intersections = intersections;

    // let user see match before exiting
    await delay(2 * animationDuration / 3);
    score(words[0], chain);

    const filteredCoords = word.coords.filter((c, i) => (
      !$game.intersections[word.word[i].id]
    ));
    $game.board = removeLetters($game.board, $game.turn, filteredCoords);
    $game.intersections = {};

    await delay(animationDuration);
    await handleScore(chain + 1);
  }
  
  const highlightTiles = (words: Match[], prevHighlighted: Highlighted) => {
    const highlighted: Highlighted = {...prevHighlighted};
    for (const word of words) {
      let highlight: HighlightColors = 'green';
      if ((word.axis === 'row' && word.word.length === DIMS.COLS)
        || (word.axis === 'col' && word.word.length === DIMS.ROWS)) {
          highlight = 'orange';
      } else if (word.intersectingIds.length) {
        for (const id of word.intersectingIds) {
          highlighted[id] = 'red';
        }
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
  
  const score = (word: Match, chain: number) => {
    $game.streak++;

    if ($game.streak > $game.bestStreak) {
      $game.bestStreak = $game.streak;
    }
    if (word.axis === 'row' && word.intersectingIds) {
      $game.shuffles += word.intersectingIds.length;
    }
    if (word.word.length === DIMS.COLS && word.axis === 'row') {
      $game.shuffles++;
    }
    if (word.word.length === DIMS.ROWS && word.axis === 'col') {
      $game.shuffles++;
    }

    if (chain === 0) {
      const points = {
        4: 1,
        5: 2,
        6: 4,
        7: 8,
      }
      $game.remainingSwaps += points[word.word.length] ?? 0;
    } else {
      $game.remainingSwaps++;
    }
    $game.latestChain = chain;
    $game.bestChain = Math.max($game.bestChain, $game.latestChain);
    
    $game.latestWord = word.word;
    $game.latestScore = word.score;
    $game.score += word.score;
    $game.marquee = getMarqueeText(word, chain);
  }
  
  const handleShuffle = async () => {
    if (!$animating) {
      $game.shuffles--;
      clearSelection();
      const coords = Array.from({ length: DIMS.COLS }).flatMap((_, i) => 
        Array.from({ length: DIMS.ROWS }).map((_, j) => [i, j])
      );
      const shuffledCoords = shuffle([...coords]);
      const tempBoard = $game.board.map(col => col.map(tile => tile));
      coords.forEach((coord, i) => {
        const newCoord = shuffledCoords[i];
        const tmp = tempBoard[coord[0]][coord[1]];
        tempBoard[coord[0]][coord[1]] = tempBoard[newCoord[0]][newCoord[1]];
        tempBoard[newCoord[0]][newCoord[1]] = tmp;
      });
      $game.board = tempBoard;

      // pause for animation
      await delay(1200);
      await handleScore(0, true);
    }
  }

</script>

<div class=container>
  <Title />
  <div class=status>
    <Swaps swaps={$game.remainingSwaps} />
    <Streak streak={$game.streak} />
    <WordChain chain={$game.latestChain} />
  </div>
  <div class=shuffle-container>
    <ActionButton
      onClick={$game.shuffles > 0 ? handleShuffle : undefined}
      disabled={$game.shuffles === 0}
    >
      <span>
        {$game.shuffles}
      </span>
      <Shuffle />
    </ActionButton>
  </div>
  <div class=score-container>
    {#if loading}
      <div class=loading>
      Loading Dictionary...
        <br/>
        <Spinner />
      </div>
    {:else}
      {#key $game.score}
        <div in:fly={{ y: 20 }}>{$game.score}</div>
      {/key}
    {/if}
  </div>
  <WordContainer />
  <GameBoard {handleScore} />
  {#if showStats}
    <Stats />
  {/if}
  <div class=spacer />
  <BottomControls onReset={() => handleReset(true)} />
</div>
{#if $game.lost}
  {#key $game.id}
    <GameOver onReset={handleReset} />
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
  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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