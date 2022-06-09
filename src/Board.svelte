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
import { draggable } from '@neodrag/svelte';
import { fade } from 'svelte/transition';
import { send, receive, flipDuration, getBBoxJSON, delay } from './animations';
import game, { saveGame } from './store';

import BoardTile from './BoardTile.svelte';
import Flipper from './Flipper.svelte';
import { turns, updateTurns } from "./analytics";
import { tweened } from 'svelte/motion';
import { sineIn } from 'svelte/easing';
import type { Coord } from "./types";
import { DIMS } from "./algorithms/gameLogic";

  export let handleScore: () => Promise<boolean>;
  let boardWidth = 0;
  let boardHeight = 0;
  const pad = 0.9;
  // $: tileWidth = boardWidth / DIMS.COLS;
  // $: tileHeight = boardHeight / DIMS.ROWS;
  const tileWidth = 50;
  const tileHeight = 50;
  let prevGameId = '';
  $: {
    // play flip animation
    setTimeout(() => {
      prevGameId = $game.id;
    }, 1000);
  }

  const coordStr2Int = (c: string) => c.split(',').map(i => parseInt(i));
 
  const handleClick = async (i: number, j: number) => {
    console.log('click');
    if (!$animating) {
      $animating = true;
      const coord = [i, j].join(',');
      const tileId = $game.board[i][j].id;
      if ($selected.coords.length === 0) {
        $selected.coords = [coord];
        $selected.tiles.add(tileId);
      } else if ($selected.tiles.size === 1 && !$selected.tiles.has(tileId)) {
        $game.turn++;
        $selected.coords.push(coord);
        $selected.tiles.add(tileId);
        const [ i2, j2 ] = coordStr2Int($selected.coords[0]);

        await swapTiles([i, j], [i2, j2]);
      } else {
        // click same tile twice
        clearSelection();
      }
      $animating = false;
    }
  }
  
  const swapTiles = async ([i, j]: Coord, [i2, j2]: Coord) => {
    console.log('swapping', [i, j], [i2, j2]);
    // the ol' switcheroo
    const first = $game.board[i][j];
    $game.board[i][j] = $game.board[i2][j2];
    $game.board[i2][j2] = first;

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
        break;
      }
      bbox = bbox2;
    };
    // clear selection after switch
    clearSelection();
    
    await handleScore();
    updateTurns([[i, j], [i2, j2]], $game.words);
    saveGame($game, $turns);
  }
  
  const x = tweened(0, { easing: sineIn });
  const y = tweened(0, { easing: sineIn });
  
  let initialCoords: Coord = undefined;
  let draggingId: string = undefined;

  const onDragStart = async (e, id: string, i: number, j: number) => {

    const style = getComputedStyle(e.target);
    const dims = style.transform.match(/\((.*)\)/)
    const [ox, oy] = dims ? dims[1].split(', ').slice(-2).map(parseFloat) : [0, 0];
    console.log([ox, oy]);
    x.set(ox, { duration: 0 });
    y.set(oy, { duration: 0 });
    draggingId = id;
    $selected.tiles = new Set([id]);
    $selected.coords = [[i, j].join()];
  }

  const onDrag = async (e) => {
    x.set(e.detail.offsetX, { duration: 0 });
    y.set(e.detail.offsetY, { duration: 0 });
  }
  
  const onDragEnd = async (e, id: string, i: number, j: number) => {
    console.log('ending');
    console.log(e.detail);
    draggingId = undefined;
    const tileDim = e.detail.domRect.width + 8;
    const [i2, j2] = [
      Math.round(e.detail.offsetX / tileDim),
      Math.round(e.detail.offsetY / tileDim),
    ];
    console.log(i2, j2);
    const targetId = $game.board[i2][j2].id;
    // click not drag
    if (e.detail.offsetX === 0 && e.detail.offsetY === 0) {
      console.log('clicked');
      // await handleClick(i, j);
    }
    $selected.tiles.add(targetId);
    if ($selected.coords[0] !== [i2, j2].join()) {
      await swapTiles([i, j], [i2, j2]);
    } else {
      // return to center of origin
    }
    clearSelection();
  }

  $: tiles = $game.board.flatMap((row, i) => row.map((tile, j) => ({ i, j, tile })));
</script>

<div class=board bind:clientWidth={boardWidth} bind:clientHeight={boardHeight}>
  {#each tiles as { tile, i, j } (tile.id)}
    <div
      class=tile-container
      data-coords='{i}-{j}'
      style='position: absolute; width: {tileWidth * pad}px; height: {tileHeight * pad}px; transform: translate3d({i * tileWidth}px, {j * tileHeight}px, 0px);'
      data-id={tile.id}
      on:neodrag:start={e => onDragStart(e, tile.id, i, j)}
      on:neodrag={e => onDrag(e)}
      on:neodrag:end={e => onDragEnd(e, tile.id, i, j)}
      use:draggable={{
        bounds: 'parent',
        defaultClassDragging: 'flying',
        position: (draggingId === tile.id)
          ? { x: $x, y: $y }
          : { x: i * tileWidth, y: j * tileHeight }
      }}
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
  {#each Object.entries($game.intersections) as [ id, { tile, coord: [i, j] }] (id)}
    <div
      class=tile-container
      style='position: absolute; width: {tileWidth * pad}px; height: {tileHeight * pad}px; transform: translate3d({i * tileWidth}px, {j * tileHeight}px, 0px);'
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
    position: relative;
    margin-left: auto;
    margin-right: auto;
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
    transform: scale(1.1);
    transition: box-shadow 0.3s ease-in;
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.5);
  }
</style>