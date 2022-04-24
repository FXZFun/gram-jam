<script lang="ts">
import Update from 'svelte-material-icons/Update.svelte';
import Pill from "../components/Pill.svelte";

export let turns: number;
</script>

<Pill
  value={turns}
  color='white'
  backgroundColor='#D32F2F'
>
  <Update />
</Pill>
