<script lang='ts'>
import { onMount } from 'svelte';
import ContentCopy from 'svelte-material-icons/ContentCopy.svelte';
import ContentPaste from 'svelte-material-icons/ContentPaste.svelte';
import Scoreboard from '../icons/Scoreboard.svelte';
import Restart from 'svelte-material-icons/Restart.svelte';

import Modal from '../components/Modal.svelte';
import Word from '../Word.svelte';
import type { LeaderboardEntry, Match } from '../types';
import ActionButton from '../components/ActionButton.svelte';
import Streak from '../pills/Streak.svelte';
import WordChain from '../pills/WordChain.svelte';
import Leaderboard from '../leaderboard/Leaderboard.svelte';
import PostScore from '../leaderboard/PostScore.svelte';
import Turns from '../pills/Turns.svelte';
import Words from '../pills/Words.svelte';
import { saveAnalytics } from '../analytics';
import { getUserId } from '../store';
import StaticWord from '../StaticWord.svelte';
import Trophy from '../icons/Trophy.svelte';
  
  export let gameId: string;
  export let onReset: () => void;
  export let bestStreak: number;
  export let bestChain: number;
  export let words: Match[];
  export let numWords: number;
  export let score: number;
  export let turns: number;
  export let duration: number;

  let shareText: string;
  let copied = false;
  let showLeaderboard = false;

  let entry: LeaderboardEntry;
  
  onMount(() => {
    entry = {
      name: '',
      gameId,
      score,
      bestStreak,
      bestChain,
      turns,
      bestWord: words[0]?.word ?? [],
      numWords: words.length,
      date: (new Date()).toISOString(),
    }
    const localGames: LeaderboardEntry[] = JSON.parse(localStorage.getItem('games') ?? '[]');
    localGames.push(entry);
    localStorage.setItem('games', JSON.stringify(localGames));
    saveAnalytics({
      ...entry,
      date: (new Date()).toISOString(),
      userId: getUserId(),
      words: words.map(w => w.word.map(tile => tile.letter).join('')),
      duration,
    })
  });
  
  const handleShare = () => {
   
    shareText = 'GRAM JAM\n';
    shareText += `Score: ${score}\n\n`;
    shareText += `🔥 Best Streak: ${bestStreak}\n`;
    shareText += `⚡ Best Chain: ${bestChain}\n`;
    shareText += '📘 Best Words:\n';
    shareText += '--------------\n';

    for (const word of words.slice(0, 5)) {
      for (const tile of word.word) {
        shareText += tile.letter;
      }
      shareText += ` ${word.score}\n`
      
    }
    shareText += `https://gramjam.app/`
    const copyArea = document.createElement('textarea');
    copyArea.textContent = shareText;
    document.body.appendChild(copyArea);
    
    var selection = document.getSelection();
    var range = document.createRange();
    //  range.selectNodeContents(textarea);
    range.selectNode(copyArea);
    selection.removeAllRanges();
    selection.addRange(range); 
    document.execCommand('copy');
    selection.removeAllRanges();
    document.body.removeChild(copyArea);

    copied = true;
  }
  
  const toggleLeaderboard = () => {
    showLeaderboard = !showLeaderboard;
  }
  
</script>  

<Modal open onClose={onReset}>
  <div slot=title>
    <h1>Game Over</h1>
  </div>
  <div slot=content>
    <h2>Score: {score}</h2>
    <h4 class=result>
      Turns:
      <Turns {turns} />
    </h4>
    <h4 class=result>
      Best Streak:
      <Streak streak={bestStreak} />
    </h4>
    <h4 class=result>
      Best Chain:
      <WordChain chain={bestChain} />
    </h4>
    <h4 class=result>
      Words Made:
      <Words {numWords} />
    </h4>
    <h4>Best Words:</h4>
    <ul>
    {#each words.slice(0, 5) as word}
      <li class='word-container'>
        <StaticWord word={word.word} />
        <span class=score>{word.score}</span>
      </li>
    {/each}
    </ul>
  </div>
  <div slot=controls class=controls>
    <PostScore
      {entry}
      onSubmit={toggleLeaderboard}
    />
    {#if copied}
      <ActionButton onClick={handleShare}>
        <ContentPaste /> Copied
      </ActionButton>
    {:else}
      <ActionButton onClick={handleShare}>
        <ContentCopy /> Copy results
      </ActionButton>
    {/if}
    <ActionButton onClick={toggleLeaderboard}>
      <Trophy />
      Leaderboard
    </ActionButton>
    <ActionButton onClick={onReset}>
      <Restart size='1em' />
      Reset Game
    </ActionButton>
  </div>
</Modal>
{#if entry?.gameId && showLeaderboard}
  <Leaderboard
    {entry}
    submitted={entry.gameId}
    open={showLeaderboard}
    onClose={toggleLeaderboard}
  />
{/if}

<style>
  .score {
    font-weight: bold;
  }
  .controls {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    flex-direction: row;
    justify-content: center;
    gap: 1em;
  }
  .word-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.25em;
  }
  .result {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
  }
</style>