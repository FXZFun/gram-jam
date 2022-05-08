<script lang='ts'>

import { onMount } from 'svelte';

import { fly } from 'svelte/transition';

import { loadDictionary } from './algorithms/dictionary';
import { DIMS, findWords, getMarqueeText, removeLetters, resetGame } from './algorithms/gameLogic';
import type { Board, Coord, Freqs, HighlightColors, Highlighted, Match, Tile } from './types';
import GameOver from './modals/GameOver.svelte';
import Title from './Title.svelte';
import { shuffle} from './algorithms/shuffle';
import { animationDuration, delay } from './animations';
import GameBoard, { clearSelection, animating, turns } from './Board.svelte';
import game, { dictionary } from './store';
import BottomControls from './BottomControls.svelte';
import WordContainer from './WordContainer.svelte';
import Stats from './Stats.svelte';
import { saveAnalytics } from './analytics';
import Spinner from './components/Spinner.svelte';
import Gauge from './gauge/Gauge.svelte';
import Score from './pills/Score.svelte';
import Shuffle from './pills/Shuffle.svelte';
  
  let loading = true;
  let prevProgress = $game.streak;
  onMount(async () => {
    $dictionary = await loadDictionary();
    loading = false;
    // initialize board on first load
    $game = resetGame($game, $dictionary);
  });
 
  const showStats = false;

  const handleReset = (abandoned = false) => {
    if (abandoned) {
      saveAnalytics($game, $turns, { abandoned });
    }
    $game = resetGame($game, $dictionary);
    $turns = []
  }
 
  // const getTileId = (e) => parseInt((e.target as HTMLElement).getAttribute('data-id'));
  
  const handleEndTurn = async () => {
    prevProgress = $game.streak;
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
    $game = $game;
    return $game.lost;
  }
  
  // chain is incremented on subsequent recursive calls of handleScore
  const handleScore = async (chain = 0, shuffle = false) => {

    let { words, intersections } = findWords($dictionary, $game.board);
    if (!words.length) {
      if (!shuffle && chain === 0) {
        if ($game.streak === 0) {
          $game.streakLevel = Math.max($game.streakLevel - 1, 1);
        } else {
          $game.streak -= $game.streak % 5 || 5;
        }
        $game.remainingSwaps--;
      }
      return await handleEndTurn();
    }

    const word = words[0];
    $game.words.push(word);
    $game.highlighted = highlightTiles(words, $game.highlighted);

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
  
  const score = (match: Match, chain: number) => {
    $game.streak++;
    const threshold = $game.streakLevel * $game.streakInterval;
    if ($game.streak >= threshold) {
      const newStreak = $game.streak - threshold;
      $game.streak = threshold;
      setTimeout(() => {
        $game.streak = newStreak;
        $game.streakLevel++;
      }, 750);
    }

    if ($game.streak > $game.bestStreak) {
      $game.bestStreak = $game.streak;
    }
    if (match.axis === 'row' && match.intersectingIds) {
      $game.shuffles += match.intersectingIds.length;
    }
    if (match.word.length === DIMS.COLS && match.axis === 'row') {
      $game.shuffles++;
    }
    if (match.word.length === DIMS.ROWS && match.axis === 'col') {
      $game.shuffles++;
    }

    if (chain === 0) {
      $game.remainingSwaps += Math.max(match.word.length - 4, 0);
    } else {
      // game.remainingSwaps++;
    }
    $game.latestChain = chain;
    $game.bestChain = Math.max($game.bestChain, $game.latestChain);
    
    $game.latestWord = match.word;
    $game.latestScore = match.score;
    $game.score += match.score;
    $game.marquee = getMarqueeText(match, chain);
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
      $game = $game;

      // pause for animation
      await delay(1200);
      await handleScore(0, true);
    }
  }

</script>

<div class=container>
  <div class=top-container>
    <Title />
    <Score score={$game.score} />
    <Gauge
      radius={96}
      swaps={$game.remainingSwaps}
      level={$game.streakLevel}
      prevProgress={prevProgress}
      progress={$game.streak}
      interval={$game.streakInterval}
    />
    <Shuffle
      shuffles={$game.shuffles}
      onShuffle={handleShuffle}
    />
  </div>
  {#if loading}
    <div class=loading-dictionary>
      Loading Dictionary...
      <br/>
      <Spinner />
    </div>
  {:else}
    <GameBoard {handleScore} />
  {/if}
  <WordContainer />
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
    gap: 1em;
    padding: 1.5em;
    -webkit-box-sizing: border-box; /* Safari/Chrome, other WebKit */
    -moz-box-sizing: border-box;    /* Firefox, other Gecko */
    box-sizing: border-box;         /* Opera/IE 8+ */
    overscroll-behavior: contain;
    overflow: hidden;
  }
  .top-container {
    position: relative;
    width: 100%;
  }
  .spacer {
    flex-grow: 1;
  }
  .loading-dictionary {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: black;
    font-weight: bold;
    font-size: 1.75em;
  }
  :global(body.dark-mode) .loading-dictionary {
    color: white;
  }
</style>