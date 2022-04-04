<script lang='ts'>
  import Info from 'svelte-material-icons/Information.svelte';
  import SwapHorizontal from 'svelte-material-icons/SwapHorizontal.svelte';
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
    <h3>How to play</h3>
    <p>swap letters to make words</p>
    <p><SwapHorizontal size='1.5em' />Swapping adjacent tiles uses up 1 swap</p>
    <p><Autorenew size='1.5em' />Swapping non-adjacent tiles uses up 2 swaps</p>
    <p>Earn back swaps by making longer words</p>
    <p><Fire size='1.5em' />Maintain a word streak to decrease your swap penalty</p>
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
  }
  .controls {
    justify-self: end;
  } 
  p {
    display: flex;
    align-items: center;
  }
</style>