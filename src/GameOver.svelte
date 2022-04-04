<script lang='ts'>
  import Modal from './Modal.svelte';
  import Word from './Word.svelte';
  import type { Match } from './types';
  import ActionButton from './ActionButton.svelte';
  import Streak from './Streak.svelte';
  import WordChain from './WordChain.svelte';
  import { symbols } from './letters';
  
  export let lost: boolean;
  export let onReset: () => void;
  export let bestStreak: number;
  export let bestChain: number;
  export let bestWords: Match[];
  export let score: number;
  let shareText: string;
  let copied = false;
  
  const handleShare = () => {
   
    shareText = '✨ WORD CRUSH ✨\n';
    shareText += `Score: ${score}\n\n`;
    shareText += `Best Streak: ${bestStreak}\n`;
    shareText += `Best Chain: ${bestChain}\n`;
    shareText += 'Best Words:\n';

    for (const word of bestWords) {
      for (const tile of word.word) {
        // const idx = tile.letter.charCodeAt(0) - 'A'.charCodeAt(0);
        shareText += tile.letter;
      }
      shareText += ` ${word.score}\n`
      
    }
    shareText += `\nplay with your friends: https://jessecoleman.github.io/word-crush/`
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

<Modal open={lost} onClose={onReset}>
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
        <td><Word word={word.word} score={undefined}/></td>
        <td><span class=score>{word.score}</span></td>
      </tr>
    {/each}
    </table>
    <div class=controls>
      <ActionButton onClick={handleShare}>{copied ? 'Copied' : 'Share results'}</ActionButton>
      <div class=spacer />
      <ActionButton onClick={onReset}>Reset Game</ActionButton>
    </div>
  </div>
</Modal>

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
  }
  .result {
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  .spacer {
    width: 1em;
  }
  .grow {
    flex-grow: 1;
  }
</style>