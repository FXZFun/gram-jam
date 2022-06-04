<script lang='ts'>
	import { fly } from 'svelte/transition';
	import { getContext } from 'svelte';
	import { TABS } from './Tabs.svelte';

	export let idx: number;
	const { registerPanel, selectedPanel } = getContext(TABS);

	registerPanel(idx);
</script>

{#key idx}
	{#if $selectedPanel === idx}
		<div
			class=tab-panel
			in:fly={{
				x: (selectedPanel < idx ? -1 : 1) * 480,
				duration: 250,
			}}
			out:fly={{
				x: (selectedPanel > idx ? -1 : 1) * 480,
				duration: 250,
			}}
		>
			<slot />
		</div>
	{/if}
{/key}