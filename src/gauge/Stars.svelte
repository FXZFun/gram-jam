<script lang='ts'>
export let radius: number;
export let stars: number;
</script>

<text
  class=stars
  dx={radius * Math.PI / 2}
  dy={25}
>
  <textPath xlink:href=#streak-path>
    {Array.from({ length: stars }).fill('✯').join('')}
  </textPath>
</text>

<style>
  .stars {
    font-size: 1.2em;
    letter-spacing: 8px;
    fill: rgb(255, 217, 0);
    text-anchor: middle;
  }
</style>