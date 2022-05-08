<script lang='ts'>
  let clazz: string = undefined;
  export { clazz as class };
  export let small: boolean = undefined;
  export let color: string = undefined;
  export let dy: number;
  
  export let transform: string;
</script>

<circle
  class='handle {clazz}'
  cx=50%
  cy={dy}
  r={small ? 6 : 12}
  fill={color}
  {transform}
/>

<style lang='scss'>
  @use 'sass:list';
  @import './levels';

  .handle {
    transition: all 0.5s;
  }
  
  @for $i from 1 through 5 {
    .gauge-handle.lvl-#{$i} {
      fill: list.nth($levels, $i);
    }
  }

</style>