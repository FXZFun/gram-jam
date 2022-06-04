<script lang='ts'>
import ActionButton from "../components/ActionButton.svelte";
import Hourglass from "../icons/Hourglass.svelte";
import Modal from "../components/Modal.svelte";
import Close from "svelte-material-icons/Close.svelte";
import Send from "svelte-material-icons/Send.svelte";
import game from "../store";
import { openLeaderboard } from "./Leaderboard.svelte";
import { submitScore } from "./leaderboard";
import Spinner from "../components/Spinner.svelte";

  let open = false;

  let name: string = localStorage.getItem('name') || '';
  let loading = false;

  const handleSubmit = async () => {
    localStorage.setItem('name', name);
    if (!loading) {
      loading = true;
      const e = await submitScore($game);
      loading = false;
      openLeaderboard(e);
      handleClose();
    }
  }
  
  const handleClose = () => {
    open = false;
  }
  
</script>

<ActionButton onClick={() => { open = true }}>
  <Send />
  Submit Score
</ActionButton>
<Modal open={open} onClose={handleClose}>
  <div slot=title>
    <h2>Submit Score</h2>
  </div>
  <div slot=content>
    <form
      name=submit-score
      on:submit|preventDefault={handleSubmit}
    >
      <div class=submit-score>
        {#if loading}
          <Spinner />
        {:else}
          <input
            type='text'
            placeholder="name"
            bind:value={name}
            required
          />
        {/if}
      </div>
    </form>
  </div>
  <div slot=controls class=controls>
    <ActionButton onClick={handleClose}>
      <Close />
      Close
    </ActionButton>
    <div class=spacer />
    <ActionButton onClick={handleSubmit}>
      <Send />
      Submit
    </ActionButton>
  </div>
</Modal>

<style>
  .submit-score {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .spacer {
    width: 0.5em;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
</style>