<script lang='ts'>
  import { fly } from 'svelte/transition';
  import { tweened } from 'svelte/motion';
  import { cubicOut, quadInOut } from 'svelte/easing';
  
  export let score: number;
  let newScore = tweened(score, {
    duration: 500,
    easing: cubicOut,
  });
  
  $: {
    newScore.set(score);
  }

</script>

<div class=score>
  <div>{Math.round($newScore)}</div>
</div>

<style lang='scss'>
  .score {
    color: black;
    position: absolute;
    top: 0;
    right: 0;
    font-weight: bold;
    font-size: 1.5em;

    :global(body.dark-mode) & {
      color: white;
    }
  }
</style>