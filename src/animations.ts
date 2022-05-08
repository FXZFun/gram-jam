import { crossfade, fade, fly } from 'svelte/transition';
import { quintOut, quadInOut, quintInOut, quadOut, quintIn, quadIn, sineOut } from 'svelte/easing';

const getMajorAxis = () => {
  if (document.body.clientHeight / document.body.clientWidth > 16 / 9) {
    return document.body.clientWidth;
  } else {
    return document.body.clientHeight;
  }
}

const getTileSize = (): number => {
  const boardSize = document.querySelector('.board').getBoundingClientRect();
  const tileSize = boardSize.width / 6;
  return tileSize;
}

export const flipDuration = (len: number) => animationDuration * Math.sqrt(len / getMajorAxis());

export const [ send, receive ] = crossfade({
	duration: flipDuration,
  easing: quadOut,
	fallback: (node, params, intro) => (
    fly(node, {
      y: intro ? -getTileSize() : 0,
      x: intro ? 0 : 100,
      duration: animationDuration,
      easing: intro ? quadIn : quadOut
    })
  )
});

export const spin = (node: HTMLElement) => {
	return {
		duration: 600,
    easing: quintOut,
		css: t => `spin: ease-in-out`
	};
}

export const flyIn = (node: HTMLElement, {
  y = 20,
  duration = 500,
  delay = 0,
}) => ({
  duration,
  delay,
  easing: quintOut,
  css: (t: number) => `transform: translateY(${t * y}px); transform: scale(${t})`,
});

export const animationDuration = 750;

export const getAnimationPromise = (): [ Promise<void>, () => void ] => {
  let resolve: () => void;

  const promise = new Promise<void>(_resolve => {
    resolve = _resolve;
  })

  return [ promise, resolve ];
}

export const delay = async (t: number) => new Promise(resolve => setTimeout(resolve, t));

export const flipOver = (node: HTMLElement, {
  delay = 0,
	duration = 500,
  shouldFlip = false,
}) => {
  if (!shouldFlip) return {};
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
	return {
		delay,
		duration,
    easing: quadIn,
		css: (t: number, u: number) => `
      transform: ${transform} rotateY(${u * 90}deg);
    `
	};
}

export const flipOut = (node: HTMLElement, {
  delay = 0,
	duration = 500,
  shouldFlip = false,
}) => {
  if (!shouldFlip) return {};
  const style = getComputedStyle(node);
  const transform = style.transform === 'none' ? '' : style.transform;
	return {
		delay,
		duration,
    easing: quadOut,
		css: (t: number, u: number) => `
      transform: ${transform} rotateY(${1 - (u * 90)}deg);
    `
	};
}

export const shrink = (node: HTMLElement, {
  duration = 2000,
}) => {
  return {
    duration,
    css: (t: number) => `
      transform: scaleX(${t}%);
    `
  }
}

export const getBBoxJSON = () => (
  JSON.stringify(document.querySelector('.large.selected')?.getBoundingClientRect())
);

export const gaugeIn = (node: SVGCircleElement, {
  duration = 1000,
  delay = 0,
  easing = quadIn,
}) => {
  const r = parseFloat(node.getAttribute('r'));

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
      opacity: ${t};
    `,
      //transform: scale(${f(u, r)}) rotate(135, ${r * f(u, r)}, ${r * f(u, r)});
	};
}

export const gaugeOut = (node: SVGCircleElement, {
  duration = 1000,
  delay = 0,
  easing = quadIn,
}) => {
  const r = parseFloat(node.getAttribute('r'));
  const w = parseFloat(node.getAttribute('stroke-width'));

	return {
		delay,
		duration,
		easing,
		css: (t: number, u: number) => `
      opacity: ${t};
      stroke-width: ${0.5 * (1 + t) * w};
    `,
      //transform: scale(${f(u, r)}) rotate(135, ${r * f(u, r)}, ${r * f(u, r)});
	};
}