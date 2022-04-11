import { crossfade, fly } from 'svelte/transition';
import { quintOut, quintIn, quadIn, sineOut } from 'svelte/easing';

export const [ send, receive ] = crossfade({
	duration: d => animationDuration,
  easing: quintOut,
	fallback: (node, params, intro) => fly(node, {
    y: intro ? -100 : 0,
    x: intro ? 0 : 150,
    //delay: 500,
    duration: 800,
    easing: quintOut
  })
});

export const spin = (node, params) => {
	return {
		duration: 600,
    easing: quintOut,
		css: t => `spin: ease-in-out`
	};
}

export const animationDuration = 750;