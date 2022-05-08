<script lang='ts'>
import { shrink } from './animations';
import { accordion } from './accordion';
import Info from 'svelte-material-icons/Information.svelte';
import SwapHorizontal from 'svelte-material-icons/SwapHorizontal.svelte';
import SwapVertical from 'svelte-material-icons/SwapVertical.svelte';
import Autorenew from 'svelte-material-icons/Autorenew.svelte'
import Fire from 'svelte-material-icons/Fire.svelte'
import Modal from './components/Modal.svelte';
import ActionButton from './components/ActionButton.svelte';
import Close from 'svelte-material-icons/Close.svelte';
import Flash from 'svelte-material-icons/Flash.svelte';
import Shuffle from 'svelte-material-icons/Shuffle.svelte';
import IconButton from './components/IconButton.svelte';
import { onMount } from 'svelte';

  const VERSION = '7';
  const duration = 500;
  let infoVisible = false;
  let hideText = false;
  $: tutorialViewed = false;
  onMount(() => {
    tutorialViewed = localStorage.getItem('version') === VERSION;
  })
  
  $: {
    if (tutorialViewed) {
      setTimeout(() => { hideText = true }, duration);
    }
  }

  const handleClick = () => {
    infoVisible = true;
  }
  
  const handleClose = () => {
    infoVisible = false;
    tutorialViewed = true;
    localStorage.setItem('version', VERSION);
  }
</script>

<ActionButton onClick={handleClick}>
  <Info size='1em' />
  {#if !hideText}
    <div class=text>
      <div class=badge />
    </div>
    <span use:accordion={{
      duration,
      isOpen: !tutorialViewed,
      axis: 'width' }}>Tutorial</span>
  {/if}
</ActionButton>
<Modal open={infoVisible} onClose={handleClose}>
  <div class=container slot=title>
    <h2>How to play</h2>
  </div>
  <div slot=content>
    <Autorenew size='1.5em' />
    <p class=primary>swap letters to make words along rows and columns</p>
    <p class=secondary>swap two letters by tapping them</p>
    <p class=secondary>words must be 4 or more letters long</p> 
    <p class=secondary>words must not read backwards</p> 
    <p class=secondary>Swapping adjacent tiles costs 1 swap</p>
    <p class=secondary>Swapping non-adjacent tiles costs 2 swaps</p>
    <p class=secondary>Double-letter tiles must appear together in the word</p>
    <div class=spacer />
    <SwapHorizontal size='1.5em' />
    <p class=primary>Earn back swaps by making longer words</p>
    <p class=secondary>5 letters = 1 swap<br/>6 letters = 2 swaps<br/>7 letters = 3 swaps</p>
    <div class=spacer />
    <Fire size='1.5em' />
    <p class=primary>Maintain a word streak by creating a word every swap</p>
    <p class=secondary>Your swap cost is decreased by 1 during a streak</p>
    <div class=spacer />
    <Flash size='1.5em' />
    <p class=primary>Create chains by creating multiple words in a swap</p>
    <p class=secondary>Chains give you back one swap per word</p>
    <div class=spacer />
    <Shuffle size='1.5em' />
     <p class=primary>Use a shuffle to mix up the letters on the board</p>
     <p class=secondary>Earn back shuffles by completing full-row, full-column, or intersecting words</p>
     <p class=secondary>Shuffles do not use up swaps</p>
  </div>
  <div slot=controls>
    <ActionButton onClick={handleClose}>
      <Close slot=icon />
      Close
    </ActionButton>
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 0.5em;
  }
  .primary {
    font-weight: bold;
  }
  .secondary {
    font-size: 0.9em;
  }
  .spacer {
    height: 2em;
  }
  .text {
    position: relative;
  }
  .badge {
    position: absolute;
    top: -0.5em;
    right: 0;
    background-color: red;
    border-radius: 50%;
    width: 0.5em;
    height: 0.5em;
  }
</style>