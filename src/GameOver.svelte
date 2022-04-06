<script lang='ts'>
  import Modal from './Modal.svelte';
  import Word from './Word.svelte';
  import type { GameRecord, Match } from './types';
  import ActionButton from './ActionButton.svelte';
  import Streak from './Streak.svelte';
  import WordChain from './WordChain.svelte';
import Leaderboard from './Leaderboard.svelte';
  
  export let lost: boolean;
  export let onReset: () => void;
  export let bestStreak: number;
  export let bestChain: number;
  export let bestWords: Match[];
  export let score: number;
  let shareText: string;
  let copied = false;
  let showLeaderboard = false;
  
  const handleReset = () => {
    copied = false;
    onReset();
  }
  
  const handleShare = () => {
   
    shareText = '✨ GRAM JAM ✨\n';
    shareText += `Score: ${score}\n\n`;
    shareText += `🔥 Best Streak: ${bestStreak}\n`;
    shareText += `⚡ Best Chain: ${bestChain}\n`;
    shareText += '📘 Best Words:\n';

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
  <div class=container>
    <h1>Game Over</h1>
    <h2>Score: {score}</h2>
    <h3 class=result>
      Best Streak:
      <div class=grow />
      <Streak streak={bestStreak} />
    </h3>
    <h3 class=result>
      Best Chain:
      <div class=grow />
      <WordChain chain={bestChain} />
    </h3>
    <h3>Best Words:</h3>
    <table>
    {#each bestWords as word}
      <tr>
        <td><Word word={word.word} /></td>
        <td><span class=score>{word.score}</span></td>
      </tr>
    {/each}
    </table>
    <div class=controls>
      <ActionButton onClick={handleReset}>Reset Game</ActionButton>
      <div class=spacer />
      <ActionButton onClick={handleShare}>{copied ? 'Copied' : 'Share results'}</ActionButton>
    </div>
    <div class=spacer-vert />
    <div class=controls>
      <ActionButton onClick={toggleLeaderboard}>View Leaderboard</ActionButton>
  </div>
</Modal>
<Leaderboard open={showLeaderboard} onClose={toggleLeaderboard} />

<style>
  table {
    width: 100%;
    text-align: start;
    margin-bottom: 8px;
  }
  .score {
    font-weight: bold;
  }
  .container {
    padding: 2em;
  }
  .controls {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: center;
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