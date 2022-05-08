<script lang="ts">
	import Game from './Game.svelte';
</script>

<main>
	<Game />
</main>

<style>
	main {
		text-align: center;
		overscroll-behavior: contain;
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
		padding: 0;
	}
</style>