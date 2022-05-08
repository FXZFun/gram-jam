<script lang="ts">
import Update from 'svelte-material-icons/Update.svelte';
import Pill from "../components/Pill.svelte";
import Tile from '../icons/Tile.svelte';

export let numWords: number;
</script>

<Pill
  value={numWords}
  color='black'
  backgroundColor='#81C784'
>
  <Tile color='black' />
</Pill>
