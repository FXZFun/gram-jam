<script lang="ts">
import QuestionMark from '../icons/QuestionMark.svelte';
import Close from 'svelte-material-icons/Close.svelte';
import ActionButton from "../components/ActionButton.svelte";
import Modal from "../components/Modal.svelte";
import Insensitive from '../icons/Insensitive.svelte';
import { supabase } from '../leaderboard/supabase';
import { delay } from '../animations';
import type { Flagged } from '../types';
import { getUserId } from '../store';

export let word: string;
export let onClose: () => void;
export let open = false;
let success = false;

const handleReport = async (reason: 'insensitive' | 'obscure') => {
  await supabase.from<Flagged>('flagged')
    .insert({
      userId: getUserId(),
      word,
      reason,
    });
  success = true;
  await delay(1000);
  open = false;
}

const handleClose = () => {
  success = false;
  onClose();
}
</script>

<Modal open={open} onClose={onClose}>
  <h1 slot=title>Report {word}</h1>
  <div class=controls slot=content>
    {#if success}
      <h5>submitted! Thank you!</h5>
    {:else}
      <ActionButton onClick={() => handleReport('insensitive')}>
        <Insensitive />
        Offensive
      </ActionButton>
      <ActionButton onClick={() => handleReport('obscure')}>
        <QuestionMark />
        Obscure
      </ActionButton>
    {/if}
  </div>
  <div class=controls slot=controls>
    <ActionButton onClick={handleClose}>
      <Close />
      Close
    </ActionButton>
  </div>
</Modal>

<style>
  .controls {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
  }
</style>