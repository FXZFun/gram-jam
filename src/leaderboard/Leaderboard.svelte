<script lang='ts'>
import Close from 'svelte-material-icons/Close.svelte';
import Modal from '../components/Modal.svelte';
import type { LeaderboardEntry } from '../types';
import ActionButton from '../components/ActionButton.svelte';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import { onMount } from 'svelte';
import { loadLeaderboard } from './leaderboard';
import Entry from './Entry.svelte';
  
  let entries: LeaderboardEntry[] = [];
  export let entry: LeaderboardEntry = undefined;
  export let open: boolean;
  export let submitted: string = undefined;

  export let onClose: () => void;

  let games: LeaderboardEntry[] = [];

  onMount(async () => {
    // load global
    const leaderboard = await loadLeaderboard();
    entries = leaderboard.docs.map(d => d.data());
    if (!entries.find(entry => entry.gameId === entry.gameId)) {
      entries = [...entries, entry].sort((a, b) => b.score - a.score)
    }

    // load local
    if (localStorage.getItem('updated') !== 'true') {
      localStorage.removeItem('games');
      localStorage.setItem('updated', 'true');
    }
    games = JSON.parse(localStorage.getItem('games')) ?? [];
    games = games
      .filter(g => g.score)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  })

</script>  

<Tabs>
  <Modal open={open} onClose={onClose}>
    <div slot=title>
      <h1>Leaderboards</h1>
      <TabList>
        <Tab>Global</Tab>
        <Tab>Personal</Tab>
      </TabList>
    </div>
    <div slot=content>
      <TabPanel>
        <div class=list>
          {#each entries as entry, i ((entry.gameId ?? i) + 'global')}
            {#if entry.name !== 'test'}
              <Entry
                submitted={submitted && submitted === entry.gameId}
                entry={entry}
                position={i}
              />
            {/if}
          {/each}
        </div>
      </TabPanel>
      <TabPanel>
        <table>
          {#each games as entry, i ((entry.gameId ?? i) + 'local')}
            <Entry
              submitted={submitted && submitted === entry.gameId}
              entry={entry}
              position={i}
            />
          {/each}
        </table>
      </TabPanel>
    </div>
    <div slot=controls>
      <ActionButton onClick={onClose}>
        <Close />
        Close
      </ActionButton>
    </div>
  </Modal>
</Tabs>

<style>
  table {
    width: 100%;
    text-align: start;
    margin-bottom: 8px;
  }
  .list {
    display: flex;
    flex-direction: column;
    gap: 1em;
  }
</style>