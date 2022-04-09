<script lang='ts'>
  import ActionButton from "../ActionButton.svelte";
  import { leaderboard } from "./leaderboard";
  import Modal from "../Modal.svelte";
  import type { LeaderboardEntry, Tile } from "../types";
  import  { addDoc, query, getDocs, orderBy, limit, QueryDocumentSnapshot } from '@firebase/firestore';
  import Entry from "./Entry.svelte";

  export let open: boolean;
  export let onClose: () => void;
  export let entry: LeaderboardEntry;

  let name: string;
  let submitted: boolean;
  let snapshot: QueryDocumentSnapshot[] = [];
  
  const handleSubmit = () => {
    addDoc(leaderboard, {
      ...entry,
      name,
    });
    submitted = true;
  }
  
  const handleLoadLeaderboard = async () => {
    const q = query(leaderboard, orderBy('score', 'desc'), limit(25))
    const topScores = await getDocs(q);
    snapshot = topScores.docs;
  }
  
  const handleClose = () => {
    submitted = false;
    onClose();
  }
  
  $: {
    if (submitted) {
      handleLoadLeaderboard();
    }
  }
</script>

<Modal {open} {onClose}>
  <div class=container>
    {#if submitted}
      <h3>Global Leaderboard</h3>
      {#each snapshot as entry, i}
        <Entry entry={entry.data()} position={i} />
      {/each}
      <div class=controls>
        <ActionButton onClick={onClose}>Close</ActionButton>
      </div>
    {:else}
      <h3>Submit Score</h3>
      <form on:submit|preventDefault={handleSubmit}>
        <input type='text' placeholder="name" bind:value={name} required />
        <div class=controls>
          <ActionButton onClick={onClose}>Close</ActionButton>
          <div class=spacer />
          <ActionButton onClick={handleSubmit}>Submit</ActionButton>
        </div>
      </form>
    {/if}
  </div>
</Modal>

<style>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding: 1em;
  }
  .score-list {
    width: 100%;
  }
  .spacer {
    width: 0.5em;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
</style>