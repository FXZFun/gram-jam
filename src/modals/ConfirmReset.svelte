<script lang="ts">
import Close from 'svelte-material-icons/Close.svelte';
import ActionButton from "../components/ActionButton.svelte";
import Modal from "../components/Modal.svelte";
import Restart from 'svelte-material-icons/Restart.svelte';
import { tutorialViewed } from './Tutorial.svelte';

export let onReset: () => void;
let open = false;

const handleOpen = () => {
  open = true;
}

const handleClose = () => {
  open = false;
}

const handleReset = () => {
  onReset();
  open = false;
}
</script>

<ActionButton onClick={handleOpen}>
  <Restart size=1em />
  {#if $tutorialViewed}
    Reset
  {/if}
</ActionButton>
<Modal open={open} onClose={handleClose}>
  <div slot=title>
    <h1>Are you sure?</h1>
  </div>
  <div class=controls slot=controls>
    <ActionButton onClick={handleReset}>
      <Restart size=1em />
      Reset
    </ActionButton>
    <ActionButton onClick={handleClose}>
      <Close />
      Close
    </ActionButton>
  </div>
</Modal>

<style>
.controls {
  display: flex;
  gap: 8px;
}
</style>