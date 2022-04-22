<script lang="ts">
  import Restart from 'svelte-material-icons/Restart.svelte';

  import ActionButton from './components/ActionButton.svelte';
  import Info from './Info.svelte';
  import DarkMode from './DarkMode.svelte';
import Feedback from './modals/Feedback.svelte';

  export let onReset: () => void;
</script>

<div class=controls>
  <Feedback />
  <div class=spacing />
  <ActionButton onClick={onReset}>
    <Restart slot=icon size='1em' />
    Reset
  </ActionButton>
  <div class=spacing />
	<Info />
  <div class=spacing />
  <DarkMode />
</div>

<style>
  .controls {
    padding: 1em;
    width: 100%;
    display: flex;
    justify-content: center;
  }
  .spacing {
    width: 1em;
  }
</style>