<script lang="ts">
  import { flipOver, flipOut } from './animations';

  export let id: string;
  export let i: number;
  export let j: number;
  export let shouldFlip: boolean;
  const dur = 500;
  const stagger = 75;
</script>

{#key id}
  <div
    class=flip
    in:flipOver={{ shouldFlip, duration: dur, delay: dur + stagger * (i + j) }}
    out:flipOut={{ shouldFlip, duration: dur, delay: stagger * (i + j) }}
  >
    <slot />
  </div>
{/key}

<style>
  .flip {
    display: grid;
    grid-row: 1/2;
    grid-column: 1/2;
  }
</style>