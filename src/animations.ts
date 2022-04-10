import { crossfade, fly } from 'svelte/transition';
import { quintOut, quintIn, quadIn, sineOut } from 'svelte/easing';

export const [send, receive] = crossfade({
	duration: d => Math.log(d) * 100,
  easing: quintOut,
	fallback: (node, params, intro) => fly(node, {
    y: intro ? -100 : 0,
    x: intro ? 0 : 200,
    //delay: 500,
    duration: intro ? 500 : 500,
    easing: intro ? quadIn : quintOut,
  })
});

export const spin = (node, params) => {
	return {
		duration: 600,
    easing: quintOut,
		css: t => `spin: ease-in-out`
	};
}
  