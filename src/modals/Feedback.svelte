<script lang="ts">
import Close from 'svelte-material-icons/Close.svelte';
import Email from 'svelte-material-icons/Email.svelte';
import IconButton from "../components/IconButton.svelte";
import ActionButton from "../components/ActionButton.svelte";
import Modal from "../components/Modal.svelte";
import Send from 'svelte-material-icons/Send.svelte';
import { supabase } from '../leaderboard/supabase';
import { getUserId } from '../store';
import type { Feedback } from '../types';
import Spinner from '../components/Spinner.svelte';

let open = false;
let loading = false;
let feedback: string;
let viewedFeedback: boolean = localStorage.getItem('viewedFeedback') === 'true';

const handleOpen = async () => {
  open = true;
  localStorage.setItem('viewedFeedback', 'true');
  viewedFeedback = true;
}

const handleClose = () => {
  open = false;
  loading = false;
}

const handleSendFeedback = async () => {

  loading = true;
  await supabase.from<Feedback>('feedback')
    .insert({ 
      userId: getUserId(),
      feedback,
    });
  loading = false;
  feedback = undefined;
  open = false;
}
</script>

<IconButton onClick={handleOpen}>
  <Email color={viewedFeedback ? 'currentColor' : 'red'} />
</IconButton>
<Modal open={open} onClose={handleClose}>
  <div class=title slot=title>
    <h1>Submit Feedback</h1>
    <p>Tell me what you like and what you don't</p>
    <p>I'm still changing a lot, so tell me how to make the game better</p>
  </div>
  <div slot=content>
    {#if loading}
      <Spinner />
    {:else}
      <textarea class=feedback bind:value={feedback} />
    {/if}
  </div>
  <div class=controls slot=controls>
    <ActionButton onClick={handleClose}>
      <Close />
      Close
    </ActionButton>
    <ActionButton onClick={handleSendFeedback}>
      <Send />
      Send
    </ActionButton>
  </div>
</Modal>

<style>
  .title {
    width: 100%;
  }
  .feedback {
    width: 100%;
    min-height: 4em;
  }
  .controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 1em;
  }
</style>