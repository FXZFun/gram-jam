<script lang='ts'>
  import Modal from './Modal.svelte';
  import Word from './Word.svelte';
  import type { Match } from './types';
import ActionButton from './ActionButton.svelte';
import Streak from './Streak.svelte';
import WordChain from './WordChain.svelte';
  
  export let lost: boolean;
  export let onReset: () => void;
  export let bestStreak: number;
  export let bestChain: number;
  export let bestWords: Match[];
  
  const handleShare = () => {
    
    alert('coming soon!');
  }
</script>  

<Modal open={lost} onClose={onReset}>
  <div class=container>
    <h1>Game Over</h1>
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
    {#each bestWords.sort((a, b) => b.score - a.score).slice(0, 8) as word}
      <tr>
        <td><Word word={word.word} /></td>
        <td><span class=score>{word.score}</span></td>
      </tr>
    {/each}
    </table>
    <div class=controls>
      <ActionButton onClick={handleShare}>Share results</ActionButton>
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