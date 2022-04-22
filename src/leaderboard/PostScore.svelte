<script lang='ts'>
  import ActionButton from "../components/ActionButton.svelte";
  import Hourglass from "../icons/Hourglass.svelte";
  import { leaderboard } from "./leaderboard";
  import Modal from "../components/Modal.svelte";
  import type { LeaderboardEntry, Tile } from "../types";
  import  { addDoc, query, getDocs, orderBy, limit, QueryDocumentSnapshot } from '@firebase/firestore';
  import Entry from "./Entry.svelte";
  import Leaderboard from "./Leaderboard.svelte";
import Trophy from "../icons/Trophy.svelte";
import Close from "svelte-material-icons/Close.svelte";
import Send from "svelte-material-icons/Send.svelte";
import { getUserId } from "../store";

  export let entry: LeaderboardEntry;

  let showPostScore = false;

  let name: string;
  let showLeaderboard= false;
  let loading = false;
  let snapshot: QueryDocumentSnapshot<LeaderboardEntry>[] = [];

  const handleSubmit = async () => {
    if (!loading) {
      loading = true;
      await addDoc(leaderboard, {
        ...entry,
        name,
        userId: getUserId(),
      });
      handleLoadLeaderboard();
    }
  }
  
  const handleLoadLeaderboard = async () => {
    const q = query(leaderboard, orderBy('score', 'desc'), limit(25))
    const topScores = await getDocs(q);
    showPostScore = false;
    showLeaderboard = true;
    snapshot = topScores.docs;
  }
  
  const handleClose = () => {
    showPostScore = false;
  }
  
  const handleCloseLeaderboard = () => {
    showLeaderboard = false;
  }
  
</script>

<ActionButton onClick={() => { showPostScore = true }}>
  <Trophy slot=icon />
  Submit Score
</ActionButton>
<Modal open={showPostScore} onClose={handleClose}>
  <div slot=title>
    <h2>Submit Score</h2>
  </div>
  <div slot=content>
    <form
      name=submit-score
      on:submit|preventDefault={handleSubmit}
    >
      <div class=submit-score>
        <div class=load-indicator />
        <input
          type='text'
          placeholder="name"
          bind:value={name}
          required
        />
        <div
          class=load-indicator
          class:loading={loading}
        >
          <Hourglass />
        </div>
      </div>
    </form>
  </div>
  <div slot=controls class=controls>
    <ActionButton onClick={handleClose}>
      <Close slot=icon />
      Close
    </ActionButton>
    <div class=spacer />
    <ActionButton onClick={handleSubmit}>
      <Send slot=icon />
      Submit
    </ActionButton>
  </div>
</Modal>
<Modal open={showLeaderboard} onClose={handleCloseLeaderboard}>
  <div slot=title>
    <h1>Global Leaderboard</h1>
  </div>
  <div slot=content>
    {#each snapshot as entry, i}
      <Entry entry={entry.data()} position={i} />
    {/each}
  </div>
  <div slot=controls class=controls>
    <ActionButton onClick={handleCloseLeaderboard}>Close</ActionButton>
  </div>
</Modal>

<style>
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