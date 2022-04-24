<script lang="ts">
import Close from 'svelte-material-icons/Close.svelte';
import Email from 'svelte-material-icons/Email.svelte';
import IconButton from "../components/IconButton.svelte";
import ActionButton from "../components/ActionButton.svelte";
import Modal from "../components/Modal.svelte";
import Send from 'svelte-material-icons/Send.svelte';
import { addDoc } from '@firebase/firestore';
import { feedback as feedbackDb } from '../db';
import { getUserId } from '../store';

let open = false;
let feedback: string;
let viewedFeedback: boolean = localStorage.getItem('viewedFeedback') === 'true';

const handleOpen = async () => {
  open = true;
  localStorage.setItem('viewedFeedback', 'true');
  viewedFeedback = true;
}

const handleClose = () => {
  open = false;
}

const handleSendFeedback = () => {

  addDoc(feedbackDb, {
    userId: getUserId(),
    feedback,
    date: new Date(),
  })
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
    <textarea class=feedback bind:value={feedback} />
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