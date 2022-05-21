<script lang='ts'>
import { onMount } from 'svelte';
import ContentCopy from 'svelte-material-icons/ContentCopy.svelte';
import ContentPaste from 'svelte-material-icons/ContentPaste.svelte';
import Restart from 'svelte-material-icons/Restart.svelte';

import Modal from '../components/Modal.svelte';
import type { LeaderboardEntry } from '../types';
import ActionButton from '../components/ActionButton.svelte';
import Streak from '../pills/Streak.svelte';
import WordChain from '../pills/WordChain.svelte';
import { openLeaderboard } from '../leaderboard/Leaderboard.svelte';
import PostScore from '../leaderboard/PostScore.svelte';
import Turns from '../pills/Turns.svelte';
import Words from '../pills/Words.svelte';
import { saveAnalytics } from '../analytics';
import game from '../store';
import StaticWord from '../StaticWord.svelte';
import Trophy from '../icons/Trophy.svelte';
  
  export let onReset: () => void;
  const words = $game.words.sort((a, b) => b.score - a.score);

  let shareText: string;
  let copied = false;

  onMount(() => {
    const entry = {
      name: '',
      gameId: $game.id,
      score: $game.score,
      bestStreak: $game.bestStreak,
      bestChain: $game.bestChain,
      turns: $game.turn,
      bestWord: words[0]?.word ?? [],
      numWords: $game.words.length,
      date: (new Date()).toISOString(),
    }
    const localGames: LeaderboardEntry[] = JSON.parse(localStorage.getItem('games') ?? '[]');
    localGames.push(entry);
    localStorage.setItem('games', JSON.stringify(localGames));
    saveAnalytics($game);
  });
  
  const handleShare = () => {
   
    shareText = 'GRAM JAM\n';
    shareText += `Score: ${$game.score}\n\n`;
    shareText += `🔥 Best Streak: ${$game.bestStreak}\n`;
    shareText += `⚡ Best Chain: ${$game.bestChain}\n`;
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
  
</script>  

<Modal open onClose={onReset}>
  <div slot=title>
    <h1>Game Over</h1>
  </div>
  <div slot=content>
    <h2>Score: {$game.score}</h2>
    <h4 class=result>
      Turns:
      <Turns turns={$game.turn} />
    </h4>
    <h4 class=result>
      Best Streak:
      <Streak streak={$game.bestStreak} />
    </h4>
    <h4 class=result>
      Best Chain:
      <WordChain chain={$game.bestChain} />
    </h4>
    <h4 class=result>
      Words Made:
      <Words numWords={$game.words.length} />
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
    <PostScore />
    {#if copied}
      <ActionButton onClick={handleShare}>
        <ContentPaste /> Copied
      </ActionButton>
    {:else}
      <ActionButton onClick={handleShare}>
        <ContentCopy /> Copy results
      </ActionButton>
    {/if}
    <ActionButton onClick={() => openLeaderboard()}>
      <Trophy />
      Leaderboard
    </ActionButton>
    <ActionButton onClick={onReset}>
      <Restart size='1em' />
      Reset Game
    </ActionButton>
  </div>
</Modal>

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