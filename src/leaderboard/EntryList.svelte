<script lang='ts'>
import VirtualList from 'svelte-tiny-virtual-list';
import InfiniteLoading, { InfiniteEvent } from 'svelte-infinite-loading';
import type { SLeaderboardEntry } from '../types';
import Entry from './Entry.svelte';
import { onMount } from 'svelte';

  export let relative: boolean;
  export let currGameId: string;
  export let entries: SLeaderboardEntry[];
  export let handleInfinite: (direction: 'asc' | 'desc', e: InfiniteEvent) => void = undefined;
  let listHeight: number;
  onMount(() => {
    listHeight = document.querySelector('#leaderboard .scroll-container-inner')
      ?.getBoundingClientRect().height
      ?? 600;
  });
</script>

<VirtualList
  width=100%
  height={listHeight}
  itemCount={entries.length}
  itemSize={180}
  overscanCount={10}
>
  <InfiniteLoading
    slot='header'
    on:infinite={e => handleInfinite('asc', e)}
    direction='top'
  >
    <div slot='noResults' />
  </InfiniteLoading>
  <div
    slot=item
    let:index
    let:style
    {style}
  >
    <Entry
      entry={entries[index]}
      current={(entries[index].id ?? entries[index].gameId) === currGameId}
      position={relative ? undefined : index}
    />
  </div>
  <InfiniteLoading
    slot='footer'
    on:infinite={e => handleInfinite('desc', e)}
    direction='bottom'
  >
    <div slot='noResults' />
  </InfiniteLoading>
</VirtualList>