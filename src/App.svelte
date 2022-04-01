<script lang="ts">
	export let name: string;
	import Game from './Game.svelte';
</script>

<main>
	<p>swap letters to make words</p>
	<div class='container'>
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

	h1 {
		color: #ff3e00;
		text-transform: uppercase;
		font-size: 4em;
		font-weight: 100;
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