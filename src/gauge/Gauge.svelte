<script lang="ts">
// https://www.fullstacklabs.co/blog/creating-an-svg-gauge-component-from-scratch
import { gaugeIn, gaugeOut } from '../animations';
import Arc from './Arc.svelte';
import Handle from './Handle.svelte';
import Level from './Level.svelte';
import Stars from './Stars.svelte';

  export let radius: number;
  export let swaps: number;
  export let level: number;
  export let prevProgress: number;
  export let progress: number;
  export let interval: number;

  const ratio = 2 / 3;
  $: strokeWidth = 16;
  $: innerRadius = radius - strokeWidth / 2;
  $: circumference = innerRadius * 2 * Math.PI;

  $: arc = circumference * ratio;
  $: dashArray = `${arc} ${circumference}`;
  $: ticks = '0 ' + Array
    .from({ length: level })
    .map((_, i) => `${arc / level} 0`)
    .concat([`${circumference}`])
    .join(' ');
  
  const getOffset = (arc: number, progress: number) => {
    const progPct = progress / (level * interval);
    return arc - progPct * arc;
  }
  
  const getHandleRotation = (progress: number) => (
    `rotate(${(360 * ratio * progress / (level * interval)) - 120}, ${radius}, ${radius})`
  )

</script>

<div class=gauge-container>
  <svg
    height={radius * 2 - 48}
    width={radius * 2}
    viewBox='0 0 {radius*2} {radius*2 - 48}'
  >
    <g transform='rotate(150, {radius}, {radius})'>
      <circle
        class=gauge-base
        cx={radius}
        cy={radius}
        r={innerRadius}
        stroke=gray
        stroke-width={strokeWidth / 2}
        stroke-dasharray={dashArray}
      />
      {#key level}
        <circle
          class='gauge-new lvl-{level}'
          in:gaugeIn={{ duration: 500 }}
          out:gaugeOut={{ duration: 500 }}
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke-width={strokeWidth / 2}
          stroke-dasharray={dashArray}
          stroke-dashoffset={getOffset(arc, progress)}
        />
        <circle
          class='gauge lvl-{level}'
          in:gaugeIn={{ duration: 500 }}
          out:gaugeOut={{ duration: 500 }}
          cx={radius}
          cy={radius}
          r={innerRadius}
          stroke-width={strokeWidth}
          stroke-dasharray={dashArray}
          stroke-dashoffset={getOffset(arc, prevProgress)}
        />
      {/key}
      <circle
        class=gauge-ticks
        cx={radius}
        cy={radius}
        r={innerRadius}
        stroke='white'
        opacity=0.6
        stroke-width={strokeWidth / 2}
        stroke-dasharray={ticks}
      />
    </g>
    <Handle
      color=gray
      small
      dy={strokeWidth / 2}
      transform={getHandleRotation(interval)}
    />
    {#key level}
      <Handle
        class='gauge-handle lvl-{level}'
        dy={strokeWidth / 2}
        transform={getHandleRotation(prevProgress)}
      />
      <Handle
        color=white
        small
        dy={strokeWidth / 2}
        transform={getHandleRotation(progress)}
      />
    {/key}
    <Arc
      radius={innerRadius}
      x={strokeWidth / 2}
      y={strokeWidth / 2}
    >
      <Stars radius={innerRadius} stars={swaps} />
      <Level radius={innerRadius} {level} />
    </Arc>
    <text
      class=swaps
      x={radius}
      y={radius}
      alignment-baseline=middle
      font-size=3em
      font-weight=bold
    >
      {swaps}
    </text>
    <text
      class=swaps
      x={radius}
      y={radius + 36}
    >
      swaps
    </text>
  </svg>
</div>

<style lang='scss'>
  @use 'sass:color';
  @use 'sass:list';
  @import './levels';

  svg {
    overflow: visible;
  }
  text {
    fill: black;
  }
  circle {
    stroke-linecap: round;
    fill: transparent;
  }
  :global(body.dark-mode) text {
    fill: white;
  }
  .gauge, .gauge-new, .gauge-ticks {
    transition: all 0.5s;
  }
  
  @for $i from 1 through 5 {
    $color: list.nth($levels, $i);
    .gauge.lvl-#{$i} {
      stroke: $color;
    }
    .gauge-handle.lvl-#{$i} {
      fill: $color;
    }
    .gauge-new.lvl-#{$i} {
      stroke: color.scale($color, $lightness: 20%);
    }
  }
  .swaps {
    text-anchor: middle;
  }
</style>