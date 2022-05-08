<script lang="ts">
import Restart from 'svelte-material-icons/Restart.svelte';
import Twitter from 'svelte-material-icons/Twitter.svelte';

import ActionButton from './components/ActionButton.svelte';
import Tutorial from './Tutorial.svelte';
import DarkMode from './DarkMode.svelte';
import Feedback from './modals/Feedback.svelte';
import Leaderboard from './leaderboard/Leaderboard.svelte';
import Trophy from './icons/Trophy.svelte';

export let onReset: () => void;

let leaderboardOpen = false;
const handleToggleLeaderboard = () => {
  leaderboardOpen = !leaderboardOpen;
}
</script>

<div class=controls>
  <ActionButton href='https://twitter.com/GramJamGame'>
    <Twitter size='1em' />
  </ActionButton>
  <ActionButton onClick={handleToggleLeaderboard}>
    <Trophy />
  </ActionButton>
  <Feedback />
  <ActionButton onClick={onReset}>
    <Restart size='1em' />
    Reset
  </ActionButton>
	<Tutorial />
  <DarkMode />
</div>
{#if leaderboardOpen}
  <Leaderboard
    open={leaderboardOpen}
    onClose={handleToggleLeaderboard}
  />
{/if}

<style>
  .controls {
    padding: 1em;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 1em;
  }
</style>