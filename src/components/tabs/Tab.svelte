<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	export let idx: number;
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(idx);
</script>

<style>
	button {
		cursor: pointer;
		background-color: #00000000;
		border: none;
		border-radius: 0;
		margin: 0;
		color: #ccc;
	}
	button:hover {
		background-color: #80808080;
	}
	
	.selected {
		color: black;
		border-bottom: 4px solid black;
	}
	
	:global(body.dark-mode) .selected {
		color: white;
		border-bottom: 4px solid white;
	}
</style>

<button class:selected="{$selectedTab === idx}" on:click="{() => selectTab(idx)}">
	<slot />
</button>