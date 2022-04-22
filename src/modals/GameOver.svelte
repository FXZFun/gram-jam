<script lang='ts'>
  import Update from 'svelte-material-icons/Update.svelte';
  import ContentCopy from 'svelte-material-icons/ContentCopy.svelte';
  import ContentPaste from 'svelte-material-icons/ContentPaste.svelte';
  import Scoreboard from '../icons/Scoreboard.svelte';
  import Restart from 'svelte-material-icons/Restart.svelte';
  import Tile from '../icons/Tile.svelte';

  import Modal from '../components/Modal.svelte';
  import Word from '../Word.svelte';
  import type { GameRecord, Match } from '../types';
  import ActionButton from '../components/ActionButton.svelte';
  import Streak from '../Streak.svelte';
  import WordChain from '../WordChain.svelte';
  import Leaderboard from '../leaderboard/Leaderboard.svelte';
  import Pill from '../components/Pill.svelte';
  import PostScore from '../leaderboard/PostScore.svelte';
  
  export let gameId;
  export let lost: boolean;
  export let onReset: () => void;
  export let bestStreak: number;
  export let bestChain: number;
  export let bestWords: Match[];
  export let numWords: number;
  export let score: number;
  export let turns: number;
  let shareText: string;
  let copied = false;
  let showLeaderboard = false;
  
  const handleReset = () => {
    copied = false;
    onReset();
  }
  
  const handleShare = () => {
   
    shareText = 'GRAM JAM\n';
    shareText += `Score: ${score}\n\n`;
    shareText += `🔥 Best Streak: ${bestStreak}\n`;
    shareText += `⚡ Best Chain: ${bestChain}\n`;
    shareText += '📘 Best Words:\n';
    shareText += '--------------\n';

    for (const word of bestWords) {
      for (const tile of word.word) {
        // const idx = tile.letter.charCodeAt(0) - 'A'.charCodeAt(0);
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
  
  $: {
    if (lost) {
      const localGames: GameRecord[] = JSON.parse(localStorage.getItem('games') ?? '[]');
      localGames.push({
        date: (new Date()).toISOString(),
        score
      })
      localStorage.setItem('games', JSON.stringify(localGames));
    }
  }
</script>  

<Modal open={lost} onClose={handleReset}>
  <div slot=title>
    <h1>Game Over</h1>
  </div>
  <div slot=content>
    <h2>Score: {score}</h2>
    <h4 class=result>
      Turns:
      <div class=grow />
      <Pill
        value={turns}
        color='white'
        backgroundColor='#D32F2F'
      >
        <Update />
      </Pill>
    </h4>
    <h4 class=result>
      Best Streak:
      <div class=grow />
      <Streak streak={bestStreak} />
    </h4>
    <h4 class=result>
      Best Chain:
      <div class=grow />
      <WordChain chain={bestChain} />
    </h4>
    <h4 class=result>
      Words Made:
      <div class=grow />
      <Pill
        value={numWords}
        color='black'
        backgroundColor='#81C784'
      >
        <Tile color='black' />
      </Pill>
    </h4>
    <h4>Best Words:</h4>
    <ul>
    {#each bestWords as word}
      <li class='word-container'>
        <Word word={word.word} />
        <div class=word-spacer />
        <span class=score>{word.score}</span>
      </li>
    {/each}
    </ul>
  </div>
  <div slot=controls>
    <div class=controls>
      {#key gameId}
        <PostScore
          entry={{
            name: '',
            score,
            bestStreak,
            bestChain,
            turns,
            bestWord: bestWords[0]?.word ?? [],
            date: new Date(),
          }}
        />
      {/key}
      <div class=spacer />
      {#if copied}
        <ActionButton onClick={handleShare}>
          <ContentPaste slot=icon /> Copied
        </ActionButton>
      {:else}
        <ActionButton onClick={handleShare}>
          <ContentCopy slot=icon /> Copy results
        </ActionButton>
      {/if}
    </div>
    <div class=spacer-vert />
    <div class=controls>
      <ActionButton onClick={toggleLeaderboard}>
        <Scoreboard slot=icon />
        Leaderboard
      </ActionButton>
      <div class=spacer />
      <ActionButton onClick={handleReset}>
        <Restart slot=icon size='1em' />
        Reset Game
      </ActionButton>
    </div>
  </div>
</Modal>
<Leaderboard open={showLeaderboard} onClose={toggleLeaderboard} />

<style>
  .score {
    font-weight: bold;
  }
  .controls {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
  }
  .word-container {
    display: flex;
    justify-content: left;
    align-items: center;
    padding: 0.25em;
  }
  .word-spacer {
    flex-grow: 1
  }
  .result {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .spacer {
    width: 1em;
  }
  .spacer-vert {
    height: 1em;
  }
  .grow {
    flex-grow: 1;
  }
</style>