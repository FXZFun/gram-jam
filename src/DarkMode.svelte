<script lang="ts">
  import ActionButton from "./ActionButton.svelte"
  import DarkMode from 'svelte-material-icons/Brightness3.svelte';
  import LightMode from 'svelte-material-icons/Brightness7.svelte';

  type DarkMode = 'light' | 'dark';
  let mode: DarkMode = localStorage.getItem('darkMode') as DarkMode ?? 'light';
  if (mode === 'dark') {
    window.document.body.classList.add('dark-mode')
  }

  const toggle = () => {
    window.document.body.classList.toggle('dark-mode')
    mode = window.document.body.classList.contains('dark-mode') ? 'dark' : 'light';
    localStorage.setItem('darkMode', mode)
  }
</script>

<ActionButton onClick={toggle}>
  {#if mode === 'light'}
    <DarkMode />
  {:else}
    <LightMode />
  {/if}
</ActionButton>
<style>
  :global(body.dark-mode) {
    background-color: #1D1E20;
  }
</style>