 <script lang="ts">

  import Close from 'svelte-material-icons/Close.svelte';
  import { scoreTile } from './algorithms/letters';
  import type { HighlightColors } from './types';
  
  export let letter: string;
  export let active: boolean = false;
  export let selected: boolean = false;
  export let adjacent: boolean = false;
  export let highlighted: HighlightColors;
  export let size: 'logo' | 'small' | 'large' = 'large';
  export let multiplier: number = 1;
  export let id: number = undefined;

  const handleSwipe = (e: any) => {
    //console.log(e);
    //console.log(e.detail.direction);
  }
  
</script>

{#key id}
  <div
    class=tile
    class:selected={selected}
    class:adjacent={adjacent && !selected}
    class:non-adjacent={active && !adjacent && !selected}
    class:matched={highlighted === 'green'}
    class:bonus={highlighted === 'purple'}
    class:intersection={highlighted === 'red'}
    class:long={highlighted === 'orange'}
    class:logo={size === 'logo'}
    class:small={size === 'small'}
    class:large={size === 'large'}
  >
    <span>{letter}</span>
    <span class=score>{scoreTile(letter)}</span>
    <span class=debug-id>{id}</span>
    {#if multiplier > 1}
      <span class='multiplier mult-{multiplier}'>
        {multiplier}
        <Close size='0.625em' />
      </span>
    {/if}
  </div>
{/key}

<style lang='scss'>
  @use 'sass:list';
  @use 'sass:color';
  
	.tile {
    position: relative;
    grid-column: 1/2;
    grid-row: 1/2;
    transition: all 0.2s ease-out;
    background-color: #F5F6FA;
    border: 1px solid #C4E0E3;
    border-bottom: 2px solid #C4E0E3;
    border-radius: 4px;
		width: 100%;
		height: 100%;
    font-size: 1.5em;
    font-weight: bold;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    cursor: pointer;
    -webkit-tap-highlight-color: rgba(0, 17, 255, 0);
    &.small {
      width: 2em;
      height: 2em;
      font-size: 1em;
    }
    &.logo {
      position: inherit;
      width: 1.5em;
      height: 1.5em;
      font-size: 1em;
     .score {
        display: none;
     }
    }
    &.selected {
      $color: #C4E0E3;
      background-color: $color;
      border-color: color.scale($color, $lightness: -20%);
    }
    &.matched {
      $color: #A2F594;
      background-color: $color;
      border-color: color.scale($color, $lightness: -20%);
    }
    &.bonus {
      $color: #a994f5;
      background-color: $color;
      border-color: color.scale($color, $lightness: -20%);
    }
    &.intersection {
      $color: #d85454;
      background-color: $color;
      border-color: color.scale($color, $lightness: -20%);
    }
    &.long {
      $color: #d8b554;
      background-color: $color;
      border-color: color.scale($color, $lightness: -20%);
    }
    @media (min-width: 769px) {
      &.small {
        font-size: 0.75em;
      }
      &.large {
        font-size: 0.75em;
      }
      &.tiny {
        width: 2em;
        height: 2em;
        font-size: 1em;
      }
    }
    .score {
      position: absolute;
      font-size: 0.5em;
      font-weight: normal;
      opacity: 0.8;
      bottom: 0;
      right: 0.4em;
    }
    .debug-id {
      position: absolute;
      opacity: 0;
      font-size: 0.5em;
      font-weight: normal;
      top: 0;
      right: 0;
      padding: 0.2em;
    }
    .multiplier {
      position: absolute;
      height: 1.75em;
      width: 1.75em;
      top: 0;
      left: 0;
      font-size: 0.625em;
      line-height: 1;
      padding: 2px;
      font-weight: normal;
      border-radius: 4px 0 0 0;
      display: flex;
      align-items: start;
      justify-content: start;
      
      $colors: #EBF8B9 #FBC6A4 #0abaff #0cff55;
      
      @for $i from 2 through 5 {
        $color: list.nth($colors, $i - 1);
        &.mult-#{$i} {
          background: linear-gradient(to bottom right, $color 0%, $color 50%, #ffffff00 50%, #ffffff00 100%);
        }
      }
    }
    :global(body.dark-mode) & {
      background-color: #2F3640;
      border-color: black;
      color: white;
      &.selected {
        $color: #2C47D3;
        background-color: $color;
        border-color: color.scale($color, $lightness: -20%);
      }
      &.matched {
        $color: #2A9618;
        background-color: $color;
        border-color: color.scale($color, $lightness: -20%);
      }
      &.bonus {
        $color: #3f21ac;
        background-color: $color;
        border-color: color.scale($color, $lightness: -20%);
      }
      &.intersection {
        $color: #ac2121;
        background-color: $color;
        border-color: color.scale($color, $lightness: -20%);
      }
      &.long {
        $color: #cc9601;
        background-color: $color;
        border-color: color.scale($color, $lightness: -20%);
      }
      
      $dark-colors: #a16e00 #b43900 #0063b4 #008a39;

      @for $i from 2 through 5 {
        $dark-color: list.nth($dark-colors, $i - 1);
        .multiplier.mult-#{$i} {
          background: linear-gradient(to bottom right, $dark-color 0%, $dark-color 50%, #ffffff00 50%, #ffffff00 100%);
        }
      }
    }
  }
</style>