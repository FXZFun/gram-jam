<script lang='ts'>
  export let radius: number;
  export let x: number;
  export let y: number;
</script>

<g transform='translate({x}, {y})'>
  <path
    id=streak-path
    fill=transparent
    d='M{0},{radius}a{radius},{radius} 0 1,1 {radius*2},0a{radius},{radius} 0 1,1 -{radius*2},0'
  />
  <slot />
</g>