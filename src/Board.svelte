<script lang='ts' context='module'>
import { writable } from "svelte/store";

  type Selection = {
    coords: string[],
    tiles: Set<string>
  }

  const initializeSelection = (): Selection => ({
    coords: [],
    tiles: new Set(),
  })
  export const animating = writable(false);
  const selected = writable<Selection>(initializeSelection());

  export const clearSelection = () => {
    selected.set(initializeSelection());
  }
  
</script>

<script lang="ts">
import { flip } from 'svelte/animate';

import { fade } from 'svelte/transition';
import { send, receive, flipDuration, getBBoxJSON, delay } from './animations';
import game, { saveGame } from './store';

import BoardTile from './BoardTile.svelte';
import Flipper from './Flipper.svelte';
import { turns, updateTurns } from "./analytics";

  export let handleScore: () => Promise<boolean>;
  let prevGameId = '';
  $: {
    // play flip animation
    setTimeout(() => {
      prevGameId = $game.id;
    }, 1000);
  }

  const coordStr2Int = (c: string) => c.split(',').map(i => parseInt(i));
 
  const handleClick = async (i: number, j: number) => {
    if (!$animating) {
      $animating = true;
      const coord = [i, j].join(',');
      const tileId = $game.board[i][j].id;
      if ($selected.coords.length === 0) {
        $selected.coords = [coord];
        $selected.tiles.add(tileId);
      } else if ($selected.tiles.size === 1 && !$selected.tiles.has(tileId)) {
        $game.turn++;
        const [ i2, j2 ] = coordStr2Int($selected.coords[0]);

        // the ol' switcheroo
        const first = $game.board[i][j];
        $game.board[i][j] = $game.board[i2][j2];
        $game.board[i2][j2] = first;
        // clear selection after switch
        $selected.coords.push(coord);
        $selected.tiles.add(tileId);

        // if tiles are adjacent deduct 1 swap
        // else deduct 2
        const distanceX = Math.abs(i - i2);
        const distanceY = Math.abs(j - j2);
        let penalty = 0;
        if (Math.max(distanceX, distanceY) === 1) {
          penalty = 1;
        } else {
          penalty = 2;
        }

        if ($game.streak > 0) {
          penalty--;
        }
        $game.remainingSwaps -= penalty;
        
        // gross!
        // wait for end of swap animation
        let bbox = getBBoxJSON();
        while ($selected.coords.length) {
          await delay(50);
          const bbox2 = getBBoxJSON();
          if (bbox === bbox2) {
            clearSelection();
            break;
          }
          bbox = bbox2;
        };
        
        await handleScore();
        updateTurns([[i, j], [i2, j2]], $game.words);
        saveGame($game, $turns);
      } else {
        // click same tile twice
        clearSelection();
      }
      $animating = false;
    }
  }

 
  $: tiles = $game.board.flatMap((row, i) => row.map((tile, j) => ({ i, j, tile })));
</script>

<div class=board>
  {#each tiles as { tile, i, j } (tile.id)}
    <div
      class=tile-container
      style='grid-row: {j + 1}; grid-column: {i + 1};'
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
      on:click={() => handleClick(i, j)}
      class:flying={
        $game.highlighted[tile.id] ||
        $selected.tiles.has(tile.id)
      }
    >
      <Flipper
        id={$game.id}
        shouldFlip={prevGameId !== $game.id}
        {i} {j}
      >
        <BoardTile
          letter={tile.letter}
          active={!!$selected.tiles.size}
          selected={$selected.tiles.has(tile.id)}
          highlighted={$game.highlighted[tile.id]}
          adjacent={false}
          multiplier={tile.multiplier}
        />
      </Flipper>
    </div>
  {/each}
  {#each Object.entries($game.intersections) as [ id, { tile, coord }] (id)}
    <div
      class=tile-container
      style="grid-row: {coord[1] + 1}; grid-column: {coord[0] + 1};"
      data-id={id}
      animate:flip={{ duration: flipDuration }}
      in:fade
      out:send={{ key: id, duration: flipDuration }}
      class:flying={true}
    >
      <BoardTile
        letter={tile.letter}
        active={$selected.tiles.size > 0}
        selected={false}
        highlighted='red'
        adjacent={false}
        multiplier={tile.multiplier}
      />
    </div>
  {/each}
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
      height: 60%;
      font-size: 2.5em;
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