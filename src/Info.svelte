<script lang='ts'>
  import Info from 'svelte-material-icons/Information.svelte';
  import SwapHorizontal from 'svelte-material-icons/SwapHorizontal.svelte';
  import SwapVertical from 'svelte-material-icons/SwapVertical.svelte';
  import Autorenew from 'svelte-material-icons/Autorenew.svelte'
  import Fire from 'svelte-material-icons/Fire.svelte'
  import Modal from './Modal.svelte';
  import ActionButton from './ActionButton.svelte';
  import Close from 'svelte-material-icons/Close.svelte';

  let infoVisible = false;

  const handleClick = () => {
    infoVisible = !infoVisible;
  }
  
  const handleClose = () => {
    infoVisible = false;
  }
</script>

<ActionButton onClick={handleClick}>
  <Info size='1em' /> Tutorial
</ActionButton>
<Modal open={infoVisible} onClose={handleClose}>
  <div class=container>
    <h2>How to play</h2>
    <p>swap letters to make words</p>
    <SwapHorizontal size='1.5em' />
    <p>Swapping adjacent tiles costs 1 swap</p>
    <Autorenew size='1.5em' />
    <p>Swapping non-adjacent tiles costs 2 swaps</p>
    <SwapVertical size='1.5em' />
    <p>Earn back swaps by making longer words</p>
    <Fire size='1.5em' />
    <p>Maintain a word streak to decrease your swap penalty</p>
    <div class=controls>
      <ActionButton onClick={handleClose}><Close /> Close</ActionButton>
    </div>
  </div>
</Modal>

<style>
  .container {
    padding: 8px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .controls {
    justify-self: end;
  } 
</style>