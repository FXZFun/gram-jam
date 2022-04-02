<script lang='ts'>
  import Info from 'svelte-material-icons/Information.svelte';
  import Modal from './Modal.svelte';

  let infoVisible = false;

  const handleClick = () => {
    infoVisible = !infoVisible;
  }
  
  const handleClose = () => {
    infoVisible = false;
  }
</script>

<div class=info-button>
  <button on:click={handleClick}>
    <Info width='1.25em' height='1.25em' />
  </button>
</div>
<Modal open={infoVisible} onClose={handleClose}>
  <h3>How to play</h3>
	<p>swap letters to make words</p>
</Modal>

<style>
  .info-button {
    position: absolute;
    top: 0;
    right: 0;
  }
  .info-button button {
    background-color: white;
    border: none;
  }
</style>