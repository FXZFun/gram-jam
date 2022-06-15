<script lang="ts">
import { flip } from 'svelte/animate';
import { fly, fade } from 'svelte/transition';
import { Confetti } from 'svelte-confetti';
import { send, receive, flipDuration, receiveShadow, sendShadow } from './animations';
import Definition from './modals/Definition.svelte';
import game from './store';
import Word from './Word.svelte';
import { flyIn } from './animations';

</script>

  <div class=latest-word>
    {#if $game.latestWord !== undefined}
      {#key $game.latestWord.map(t => t.letter).join()}
        {#if $game.latestScore > 30}
          <div class=confetti>
            <Confetti />
          </div>
        {/if}
      {/key}
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
        <div style='width: 50%' />
        {#key $game.latestWord.map(t => t.letter).join()}
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
  .tile-shadow {
    width: 2em;
    height: 2em;
    opacity: 1;
    border-radius: 4px;
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.4);
    transition: opacity 0.3s ease-in-out;
  }
  :global(body.dark-mode) .tile-shadow {
    box-shadow: 0px 8px 24px 0px rgba(0,0,0,0.9);
  }
  .confetti {
    height: 0;
    overflow: visible;
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
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .word-score {
    width: 4em;
    overflow: visible;
  }
  .word-shadow {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.25em;
  }
  :global(body.dark-mode) .latest-word {
    color: white;
  }
</style>