import { crossfade, fly } from 'svelte/transition';
import { quintOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: d => 500,

	fallback(node, params) {
		const style = getComputedStyle(node);
		const transform = style.transform === 'none' ? '' : style.transform;

		return {
			duration: 600,
			easing: quintOut,
			css: t => `
				transform: ${transform} scale(${t});
				opacity: ${t}
			`
		};
	}
});

export const spin = (node, params) => {
	return {
		duration: 600,
    easing: quintOut,
		css: t => `spin: ease-in-out`
	};
}
  