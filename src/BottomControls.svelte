<script lang="ts">
import Restart from 'svelte-material-icons/Restart.svelte';
import Twitter from 'svelte-material-icons/Twitter.svelte';

import ActionButton from './components/ActionButton.svelte';
import Tutorial from './modals/Tutorial.svelte';
import DarkMode from './DarkMode.svelte';
import Feedback from './modals/Feedback.svelte';
import Leaderboard, { openLeaderboard } from './leaderboard/Leaderboard.svelte';
import Trophy from './icons/Trophy.svelte';
import ConfirmReset from './modals/ConfirmReset.svelte';

export let onReset: () => void;

</script>

<div class=controls>
  <ActionButton href='https://twitter.com/GramJamGame'>
    <Twitter size=1em />
  </ActionButton>
  <ActionButton onClick={() => openLeaderboard()}>
    <Trophy />
  </ActionButton>
  <Feedback />
  <ConfirmReset onReset={onReset} />
	<Tutorial />
  <DarkMode />
</div>
<Leaderboard />

<style>
  .controls {
    padding: 1em;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 0.5em;
  }
</style>