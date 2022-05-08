<script lang='ts'>
// https://stackoverflow.com/questions/5737975/circle-drawing-with-svgs-arc-path/10477334#10477334
export let radius: number;
export let level: number;
</script>

{#key level}
  <text
    class=streak-level
    dx={radius * Math.PI / 2}
    dy={-15}
  >
    <textPath xlink:href=#streak-path>
      LEVEL {level}
    </textPath>
  </text>
{/key}

<style>
  .streak-level {
    font-size: 0.8em;
    fill: white;
    text-anchor: middle;
  }
</style>