<script lang="ts">
import { flip } from 'svelte/animate';

import { fade } from 'svelte/transition';
import { send, receive, flipDuration } from './animations';
import type { Board, Coord, Highlighted, Tile } from './types';

import BoardTile from './BoardTile.svelte';
import Flipper from './Flipper.svelte';

export let board: Board;
export let gameId: string;
$: prevGameId = '';
$: {
  // play flip animation
  setTimeout(() => {
    prevGameId = gameId;
  }, 1000);
}

export let selected: number[];
export let highlighted: Highlighted;
export let intersection: Coord | undefined;
export let intersectingTile: Tile;
export let onClick: (i: number, j: number) => void;

</script>

<div class=board>
  {#each board.flatMap((row, i) => row.map((tile, j) => ({ i, j, tile }))) as { tile, i, j } (tile.id)}
    <div
      class=tile-container
      style="grid-row: {j + 1}; grid-column: {i + 1};"
      data-id={tile.id}
      animate:flip="{{ duration: flipDuration }}"
      in:receive="{{
        key: tile.id,
        duration: flipDuration,
        delay: 0,
      }}"
      out:send="{{
        key: tile.id,
        duration: flipDuration,
        delay: 0,
      }}"
      on:click={() => onClick(i, j)}
      class:flying={[...Object.keys(highlighted), ...selected].includes(tile.id)}
    >
      <Flipper
        id={gameId}
        shouldFlip={prevGameId !== gameId}
        {i} {j}
      >
        <BoardTile
          id={tile.id}
          letter={tile.letter}
          active={!!selected.length}
          selected={selected.includes(tile.id)}
          highlighted={highlighted[tile.id]}
          adjacent={false}
          multiplier={tile.multiplier}
        />
      </Flipper>
    </div>
  {/each}
  {#if intersectingTile}
    {#each [{ tile: intersectingTile, coord: intersection }] as { tile, coord } (tile.id)}
      <div
        class=tile-container
        style="grid-row: {1 + coord[1]}; grid-column: {1 + coord[0]};"
        data-id={tile.id}
        animate:flip={{ duration: flipDuration }}
        in:fade
        out:send={{ key: tile.id, duration: flipDuration }}
        class:flying={true}
      >
        {#key tile.id}
          <BoardTile
            id={intersectingTile.id}
            letter={intersectingTile.letter}
            active={!!selected.length}
            selected={false}
            highlighted='red'
            adjacent={false}
            multiplier={intersectingTile.multiplier}
          />
        {/key}
      </div>
    {/each}
  {/if}
</div>

<style>
  .board {
    aspect-ratio: 6 / 7;
    margin-left: auto;
    margin-right: auto;
    display: grid;
    grid-auto-flow: column;
    grid-template-columns: repeat(6, 1fr);
    grid-template-rows: repeat(7, 1fr);
    gap: 8px;
  }
  @media (max-width: 769px) {
    .board {
      width: 100%;
    }
  }
  @media (min-width: 769px) {
    .board {
      gap: 10px;
      height: 100%;
      font-size: 2em;
    }
  }
  .tile-container {
		width: 100%;
    display: grid;
  }
  .flying {
    z-index: 500;
  }
</style>