<script lang="ts">
import { fly, fade } from 'svelte/transition';
import Definition from './modals/Definition.svelte';
import game from './store';
import Word from './Word.svelte';
import { flyIn, delay } from './animations';

  export let onIntroStart: (e: any) => void = undefined;
  export let onIntroEnd: (e: any) => void = undefined;
  export let onOutroStart: (e: any) => void = undefined;
  export let onOutroEnd: (e: any) => void = undefined;

</script>

  <div class=latest-word>
    {#if $game.latestWord !== undefined}
      <div class=marquee-outer>
        {#key $game.marquee}
          <span 
            class=marquee-inner
            in:fly={{ y: 20, delay: 500 }}
            out:fade={{ duration: 250 }}
          >
            {$game.marquee ?? 'LATEST WORD'}
          </span>
        {/key}
      </div>
      <div class=word-container>
        <div class=word-score>
          <Definition word={$game.latestWord.map(t => t.letter).join('')} />
        </div>
        <Word
          onIntroStart={onIntroStart}
          onIntroEnd={onIntroEnd}
          onOutroStart={onOutroStart}
          onOutroEnd={onOutroEnd}
          word={$game.latestWord}
        />
        {#key $game.latestWord}
          <div in:flyIn={{ y: 20, delay: 500 }} class=word-score>+{$game.latestScore}</div>
        {/key}
      </div>
    {/if}
  </div>

<style>
  .latest-word {
    height: 6em;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-evenly;
    font-weight: bold;
  }
  .marquee-outer {
    height: 1.5em;
    display: grid;
  }
  .marquee-inner {
    grid-column: 1/2;
    grid-row: 1/2;
  }
  .word-container {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .word-score {
    width: 4em;
    overflow: visible;
  }
  :global(body.dark-mode) .latest-word {
    color: white;
  }
</style>