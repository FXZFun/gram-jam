<script lang="ts">
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	const tab = {};
	const { registerTab, selectTab, selectedTab } = getContext(TABS);

	registerTab(tab);
</script>

<style>
	button {
		cursor: pointer;
		background: none;
		border: none;
		border-radius: 0;
		margin: 0;
		color: #ccc;
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

<button class:selected="{$selectedTab === tab}" on:click="{() => selectTab(tab)}">
	<slot />
</button>