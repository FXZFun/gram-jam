<script lang='ts'>
  import Modal from '../Modal.svelte';
  import type { GameRecord, Match } from '../types';
  import ActionButton from '../ActionButton.svelte';
  import Streak from '../Streak.svelte';
  import WordChain from '../WordChain.svelte';
  
  // export let lost: boolean;
  // export let onReset: () => void;
  // export let bestStreak: number;
  // export let bestChain: number;
  // export let bestWords: Match[];
  // export let score: number;
  export let open: boolean;
  export let onClose: () => void;
  let copied = false;
  let games: GameRecord[];
  
  $: {
    if (open) {
      games = JSON.parse(localStorage.getItem('games')) ?? [];
      games = games
        .filter(g => g.score)
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
    }
  }
  
</script>  

<Modal open={open} onClose={onClose}>
  <div slot=title>
    <h1>Your Leaderboard</h1>
  </div>
  <div slot=content>
    <table>
    {#each games.sort((a, b) => b.score - a.score) as game}
      <tr>
        <td><h3>
          {new Date(game.date).toLocaleDateString('en-US', { 
            month: 'short',
            day: 'numeric'
          })}
        </h3></td>
        <td><h3>{game.score}</h3></td>
      </tr>
    {/each}
    </table>
  </div>
  <div slot=controls>
    <ActionButton onClick={onClose}>Close</ActionButton>
  </div>
</Modal>

<style>
  table {
    width: 100%;
    text-align: start;
    margin-bottom: 8px;
  }
  table h3 {
    margin: 0.5em;
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
  .grow {
    flex-grow: 1;
  }
</style>