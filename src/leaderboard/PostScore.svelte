<script lang='ts'>
  import ActionButton from "../ActionButton.svelte";
  import Hourglass from "../icons/Hourglass.svelte";
  import { leaderboard } from "./leaderboard";
  import Modal from "../Modal.svelte";
  import type { LeaderboardEntry, Tile } from "../types";
  import  { addDoc, query, getDocs, orderBy, limit, QueryDocumentSnapshot } from '@firebase/firestore';
  import Entry from "./Entry.svelte";
  import Leaderboard from "./Leaderboard.svelte";
import Trophy from "../icons/Trophy.svelte";

  export let entry: LeaderboardEntry;

  let showPostScore = false;

  let name: string;
  let submitted: boolean;
  let loading: boolean = false;
  let snapshot: QueryDocumentSnapshot<LeaderboardEntry>[] = [];

  const togglePostScore = () => {
    showPostScore = !showPostScore;
  }
   
  const handleSubmit = async () => {
    if (!loading) {
      loading = true;
      await addDoc(leaderboard, {
        ...entry,
        name,
      });
      submitted = true;
      handleLoadLeaderboard();
    }
  }
  
  const handleLoadLeaderboard = async () => {
    const q = query(leaderboard, orderBy('score', 'desc'), limit(25))
    const topScores = await getDocs(q);
    loading = false;
    snapshot = topScores.docs;
  }
  
  const handleClose = () => {
    submitted = false;
    togglePostScore();
  }
  
</script>

<ActionButton onClick={togglePostScore}>
  <Trophy />
  Submit Score
</ActionButton>
<Modal open={showPostScore} onClose={togglePostScore}>
  <div class=container>
    {#if submitted && !loading}
      <h1>Global Leaderboard</h1>
      {#each snapshot as entry, i}
        <Entry entry={entry.data()} position={i} />
      {/each}
      <div class=controls>
        <ActionButton onClick={togglePostScore}>Close</ActionButton>
      </div>
    {:else}
      <h2>Submit Score</h2>
      <form
        on:submit|preventDefault={handleSubmit}
      >
        <div class=submit-score>
          <div class=load-indicator />
          <input type='text' placeholder="name" bind:value={name} required />
          <div
            class=load-indicator
            class:loading={loading}
          >
            <Hourglass />
          </div>
        </div>
        <div class=controls>
          <ActionButton onClick={handleClose}>Close</ActionButton>
          <div class=spacer />
          <ActionButton type=submit>Submit</ActionButton>
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
  .submit-score {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
  }
  .load-indicator {
    width: 2em;
    opacity: 0;
  }
  .loading {
    transition: all 0.25s ease-in;
    opacity: 1;
  }
  .spacer {
    width: 0.5em;
  }
  .controls {
    display: flex;
    justify-content: center;
  }
</style>