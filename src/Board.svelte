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
import { send, receive, flipDuration, getBBoxJSON, delay, flipOver, receiveShadow, sendShadow } from './animations';
import game, { saveGame } from './store';

import BoardTile from './BoardTile.svelte';
import Flipper from './Flipper.svelte';
import { turns, updateTurns } from "./analytics";
import { tweened } from 'svelte/motion';
import { sineIn } from 'svelte/easing';
import type { Coord, Tile } from "./types";
import { DIMS } from "./algorithms/gameLogic";

  export let handleScore: () => Promise<boolean>;
  let boardWidth = 0;
  let boardHeight = 0;
  $: PAD = boardWidth > 400 ? 0.9 : 0.85;
  $: SMALL_PAD = boardWidth > 400 ? 0.85 : 0.8;
  $: wordScale = boardWidth > 400 ? 1 / 2 : 2 / 3;
  $: tileWidth = boardWidth / DIMS.COLS;
  $: tileHeight = boardHeight / DIMS.ROWS;
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
  
  const getPenalty = ([i, j], [i2, j2]) => {
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
    // if ($game.streak > 0) {
    //   penalty--;
    // }
    return penalty
  }
  
  const swapTiles = async ([i, j]: Coord, [i2, j2]: Coord) => {
    console.log('swapping', [i, j], [i2, j2]);
    // the ol' switcheroo
    const first = $game.board[i][j];
    $game.board[i][j] = $game.board[i2][j2];
    $game.board[i2][j2] = first;

    $game.turn++;
    $game.remainingSwaps -= getPenalty([i, j], [i2, j2]);
    
    // gross!
    // wait for end of swap animation
    let bbox = getBBoxJSON();
    while ($selected.coords.length) {
      await delay(100);
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
  
  let draggingTileId: string = undefined;
  let hoveredTile: Tile = undefined;
  let dragOrig: Coord = undefined;

  const getHoveredTile = (e) => {
    const [i, j] = [
      Math.round(e.detail.offsetX / tileWidth),
      Math.round(e.detail.offsetY / tileHeight),
    ];
    return {
      tile: $game.board[i][j],
      i, j
    }
  }
  
  let draggedTimestamp = 0;
  const onDragStart = async (e, id: string, i: number, j: number) => {

    console.log('start', id, draggedTimestamp);
    const newTimestamp = +new Date();
    if (newTimestamp - draggedTimestamp < 100) {
      draggedTimestamp = newTimestamp;
      return;
    };
    const style = getComputedStyle(e.target);
    const dims = style.transform.match(/\((.*)\)/);
    const [ox, oy] = dims ? dims[1].split(', ').slice(-2).map(parseFloat) : [0, 0];
    x.set(ox, { duration: 0 });
    y.set(oy, { duration: 0 });
    draggingTileId = id;
    dragOrig = [i, j];
    $selected.tiles = new Set([id]);
    $selected.coords = [[i, j].join()];
    draggedTimestamp = newTimestamp;
  }

  const onDrag = async (e) => {
    x.set(e.detail.offsetX, { duration: 0 });
    y.set(e.detail.offsetY, { duration: 0 });
    const { tile, i, j } = getHoveredTile(e);
    if (tile.id !== draggingTileId) {
      hoveredTile = tile;
    } else {
      hoveredTile = undefined;
    }
  }
  
  
  const onDragEnd = async (e, id: string, i: number, j: number) => {
    // debounce?
    console.log('end', id, draggedTimestamp);
    const newTimestamp = +new Date();
    if (newTimestamp === draggedTimestamp) return;
    
    const { i: i2, j: j2 } = getHoveredTile(e);
    const targetId = $game.board[i2][j2].id;
    // click not drag
    console.log(e.detail);

    const coordStr = [i2, j2].join();
    if ($selected.coords[0] !== coordStr) {
      $selected.coords.push(coordStr);
      $selected.tiles.add(targetId);
      $selected = $selected
      console.log($selected);
      draggingTileId = undefined;
      hoveredTile = undefined;
      dragOrig = undefined;
      await swapTiles([i, j], [i2, j2]);
    } else if (newTimestamp - draggedTimestamp < 100) {
      await handleClick(i, j);
    } else {
      // return to center of origin
      await Promise.all([
        x.set(i * tileWidth, { duration: 150 }),
        y.set(j * tileHeight, { duration: 150 }),
      ]);
      draggingTileId = undefined;
      hoveredTile = undefined;
      dragOrig = undefined;
      clearSelection();
    }
    draggedTimestamp = newTimestamp;
  }

  $: tiles = $game.board.flatMap((row, i) => row.map((tile, j) => ({ i, j, tile })));
  $: {
    console.log($game.latestWord);
  }
</script>

<div
  class=board
  bind:clientWidth={boardWidth}
  bind:clientHeight={boardHeight}
>
  {#each $game.latestWord ?? [] as tile, i (tile.id)}
    <div
      data-id={tile.id}
      animate:flip="{{ duration: flipDuration }}"
      in:receive="{{ key: tile.id, duration: flipDuration }}"
      out:send="{{ key: tile.id, duration: flipDuration }}"
      class=tile-container
      class:word={true}
      style='
        font-size: {wordScale}em;
        width: {tileWidth * SMALL_PAD * wordScale}px;
        height: {tileHeight * SMALL_PAD * wordScale}px;
        transform: translate3d({
          (boardWidth - ($game.latestWord.length * tileWidth * wordScale)) / 2 + (i * tileWidth * wordScale)}px,
          {-tileHeight * wordScale / SMALL_PAD}px, 0px
        );
      '
    >
      <BoardTile
        active={false}
        adjacent={false}
        letter={tile.letter}
        selected={false}
        multiplier={tile.multiplier}
        highlighted='green'
      />
    </div>
  {/each}
  {#each $game.latestWord ?? [] as tile, i (tile.id)}
    <div
      class=tile-shadow
      animate:flip="{{ duration: flipDuration }}"
      in:receiveShadow="{{ key: tile.id, duration: flipDuration }}"
      out:sendShadow="{{ key: tile.id, duration: flipDuration }}"
      style='
        width: {tileWidth * SMALL_PAD * wordScale}px;
        height: {tileHeight * SMALL_PAD * wordScale}px;
        transform: translate3d({
          (boardWidth - ($game.latestWord.length * tileWidth * wordScale)) / 2 + (i * tileWidth * wordScale)}px,
          {-tileHeight * wordScale / SMALL_PAD}px, 0px
        );
      '
    />
  {/each}
  {#if hoveredTile && $selected.coords.length}
    {#key hoveredTile.id}
      <div
        class=tile-container
        style='
          opacity: 0.5;
          width: {tileWidth * PAD}px;
          height: {tileHeight * PAD}px;
          transform: translate3d({dragOrig[0] * tileWidth}px, {dragOrig[1] * tileHeight}px, 0px);
        '
        in:fade={{ duration: 1000, delay: 250 }}
      >
        <BoardTile
          letter={hoveredTile.letter}
          active={!!$selected.tiles.size}
          hovered
          multiplier={hoveredTile.multiplier}
        />
      </div>
    {/key}
  {/if}
  {#each tiles as { tile, i, j } (tile.id)}
    <div
      class=tile-container
      style='
        width: {tileWidth * PAD}px;
        height: {tileHeight * PAD}px;
        transform: translate3d({i * tileWidth}px, {j * tileHeight}px, 0px)
      '
      data-id={tile.id}
      on:neodrag:start={e => onDragStart(e, tile.id, i, j)}
      on:neodrag={e => onDrag(e)}
      on:neodrag:end={e => onDragEnd(e, tile.id, i, j)}
      use:draggable={{
        bounds: 'parent',
        defaultClassDragging: 'dragging',
        position: (draggingTileId === tile.id)
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
      class:dragging={draggingTileId === tile.id}
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
          hovered={tile.id === hoveredTile?.id}
          dragging={tile.id === draggingTileId}
          highlighted={$game.highlighted[tile.id]}
          adjacent={false}
          multiplier={tile.multiplier}
        />
      </Flipper>
    </div>
  {/each}
  {#each tiles.filter(t => $game.highlighted[t.tile.id]) as { tile, i, j } (tile.id)}
    <div
      class=tile-shadow
      style='
        width: {tileWidth * PAD}px;
        height: {tileHeight * PAD}px;
        transform: translate3d({i * tileWidth}px, {j * tileHeight}px, 0px)
      '
      animate:flip="{{ duration: flipDuration }}"
      in:fade
      out:sendShadow="{{
        key: tile.id,
        duration: flipDuration,
      }}"
      class:flying={
        $game.highlighted[tile.id] ||
        $selected.tiles.has(tile.id) ||
        draggingTileId === tile.id
      }
    />
  {/each}
  {#each Object.entries($game.intersections) as [ id, { tile, coord: [i, j] }] (id)}
    <div
      class=tile-container
      style='
        width: {tileWidth * PAD}px;
        height: {tileHeight * PAD}px;
        transform: translate3d({i * tileWidth}px, {j * tileHeight}px, 0px);
      '
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
      height: 60%;
      font-size: 2.5em;
    }
  }
  .tile-container {
    display: grid;
    position: absolute;
  }
  .tile-container.word {
    z-index: 500;
  }
  .tile-shadow {
    opacity: 1;
    z-index: 400;
    border-radius: 4px;
    position: absolute;
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.4);
    transition: opacity 0.3s ease-in-out;
  }
  :global(body.dark-mode) .tile-shadow {
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.9);
  }
  .tile-container.flying {
    z-index: 500;
  }
  .tile-container::after {
    opacity: 0;
    transition: opacity 0.3s ease-in-out;
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.8);
  }
  .tile-container.dragging::after {
    box-sizing: border-box;
    content: '';
    position: absolute;
    z-index: -1;
    width: 100%;
    height: 100%;
    opacity: 1;
  }
</style>