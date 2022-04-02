<script lang="ts">
	export let name: string;
	import Game from './Game.svelte';
	import Info from './Info.svelte';
</script>

<main>
	<div class='container'>
		<Info />
		<Game />
	</div>
</main>

<style>
	main {
		text-align: center;
		width: 100%;
		height: 100%;
		overflow: hidden;
	}

	.container {
		width: 100%;
		height: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
		overflow: hidden;
	}

</style>