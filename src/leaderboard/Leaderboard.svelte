<script lang='ts' context='module'>
import { writable } from 'svelte/store';
import { loadLeaderboard, loadLocalLeaderboard } from './leaderboard';

  const open = writable(false);
  const gameOver = writable(false);
  const entries = writable<SLeaderboardEntry[]>([]);
  
  export const closeLeaderboard = () => {
    gameOver.set(false);
    entries.set([]);
    open.set(false);
  }
  
  export const openLeaderboard = async (
    from: SLeaderboardEntry = undefined,
  ) => {
    if (from) {
      console.log(from);
      gameOver.set(true);
      entries.set([from]);
      await Promise.all([
        loadAbove(from),
        loadBelow(from)
      ]);
    }
    open.set(true);

    // load local
    if (localStorage.getItem('updated') !== 'true') {
      localStorage.removeItem('games');
      localStorage.setItem('updated', 'true');
    }
  }
 
  const loadAbove = async (first: SLeaderboardEntry) => {
    const newEntries = await loadLeaderboard(first, 'asc');
    entries.update(entries => [...newEntries.reverse(), ...entries]);
    return newEntries.length;
  }

  const loadBelow = async (last: SLeaderboardEntry) => {
    const newEntries = await loadLeaderboard(last, 'desc');
    entries.update(entries => [...entries, ...newEntries]);
    return newEntries.length;
  }
 
 
</script>

<script lang='ts'>
import Close from 'svelte-material-icons/Close.svelte';
import type { InfiniteEvent } from 'svelte-infinite-loading';
import Modal from '../components/Modal.svelte';
import type { SLeaderboardEntry } from '../types';
import ActionButton from '../components/ActionButton.svelte';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import EntryList from './EntryList.svelte';
import { onMount } from 'svelte';
  
  let localGames: SLeaderboardEntry[];

  onMount(() => {
    localGames = loadLocalLeaderboard();
  })
 
 
  const handleInfinite = async (direction: 'asc' | 'desc', e: InfiniteEvent) => {
    if (!$gameOver && direction === 'asc') {
      e.detail.complete();
      return [];
    }
    let numLoaded = undefined;
    if (direction === 'asc') {
      numLoaded = await loadAbove($entries[0]);
    } else {
      numLoaded = await loadBelow($entries[$entries.length - 1]);
    }

    if (numLoaded === 10) {
      e.detail.loaded();
    } else {
      e.detail.complete();
    }
  }
  
</script>  

<Tabs>
  <Modal
    id=leaderboard
    fullHeight
    index={2}
    open={$open}
    onClose={closeLeaderboard}
  >
    <div slot=title>
      <h1>Leaderboards</h1>
      <TabList>
        <Tab>Global</Tab>
        <Tab>Personal</Tab>
      </TabList>
    </div>
    <div slot=content class=content>
      <TabPanel>
        <EntryList
          entries={$entries}
          handleInfinite={handleInfinite}
        />
      </TabPanel>
      <TabPanel>
        <EntryList
          entries={localGames}
          handleInfinite={(dir, e) => e.detail.complete()}
        />
      </TabPanel>
    </div>
    <div slot=controls>
      <ActionButton onClick={closeLeaderboard}>
        <Close />
        Close
      </ActionButton>
    </div>
  </Modal>
</Tabs>

<style>
  .content {
    margin: -1em;
  }
</style>