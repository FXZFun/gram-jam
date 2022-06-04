<script lang='ts' context='module'>
import { writable } from 'svelte/store';
import game from '../store';
import { loadLeaderboard, loadLocalLeaderboard } from './leaderboard';

  const open = writable(false);
  let loaded = writable(false);
  const gameOver = writable(false);
  const entries = writable<SLeaderboardEntry[]>([]);
  const localEntries = writable<SLeaderboardEntry[]>([]);
  
  export const closeLeaderboard = () => {
    gameOver.set(false);
    entries.set([]);
    open.set(false);
    loaded.set(false);
  }
  
  export const openLeaderboard = async (from: SLeaderboardEntry = undefined) => {
    open.set(true);
    localEntries.set(loadLocalLeaderboard());
    if (from) {
      gameOver.set(true);
      entries.set([from]);
      await Promise.all([
        loadAbove(from),
        loadBelow(from)
      ]);
    }
    loaded.set(true);

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
import ActionButton from '../components/ActionButton.svelte';
import { Tabs, TabList, TabPanel, Tab } from '../components/tabs';
import EntryList from './EntryList.svelte';
import type { SLeaderboardEntry } from '../types';
import Spinner from '../components/Spinner.svelte';

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
        <Tab idx={0}>Global</Tab>
        <Tab idx={1}>Personal</Tab>
      </TabList>
    </div>
    <div slot=content class=content>
      <TabPanel idx={0}>
        {#if $loaded}
          <EntryList
            currGameId={$game.id}
            relative={$game.remainingSwaps === 0}
            entries={$entries}
            handleInfinite={handleInfinite}
          />
        {:else}
          <Spinner />
        {/if}
      </TabPanel>
      <TabPanel idx={1}>
        <EntryList
          currGameId={$game.id}
          relative={false}
          entries={$localEntries}
          handleInfinite={(_, e) => e.detail.complete()}
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
		overflow-x: hidden;
    margin: -1em;
  }
</style>