import { crossfade, fade, fly } from 'svelte/transition';
import { quintOut, quadInOut, quintInOut, quadOut, quintIn, quadIn, sineOut, cubicOut } from 'svelte/easing';
import type { AnimationConfig, FlipParams } from 'svelte/animate';

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

export const flipDuration = (len: number) => 1 * animationDuration * Math.sqrt(len / getMajorAxis());

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

export const flip = (node: HTMLElement, { from, to }: { from: DOMRect; to: DOMRect }, params: FlipParams = {}): AnimationConfig => {
	const style = getComputedStyle(node);
	const transform = style.transform === 'none' ? '' : style.transform;
  console.log(node, transform, from, to);

  // TODO figure out this shiz
  const dims = style.transform.match(/\((.*)\)/)
  const [px, py] = dims ? dims[1].split(', ').slice(-2).map(parseFloat) : [0, 0];
  // const [px, py] = [0, 0];
  console.log(px, py);
  console.log(style.transformOrigin);
	let [ox, oy] = style.transformOrigin.split(' ').map(parseFloat);
	const dx = (from.left + from.width * ox / to.width) - (to.left + ox);
	const dy = (from.top + from.height * oy / to.height) - (to.top + oy);
  console.log(dx, dy);
  node.style.transform = '';

	const {
		delay = 0,
		duration = (d) => Math.sqrt(d) * 120,
		easing = cubicOut
	} = params;

	return {
		delay,
		duration: flipDuration(Math.sqrt(dx * dx + dy * dy)),
		easing,
		css: (t, u) => {
			const x = u * dx;
			const y = u * dy;
			const sx = t + u * from.width / to.width;
			const sy = t + u * from.height / to.height;

			return `transform: ${transform} translate3d(${x}px, ${y}px, 0px) scale(${sx}, ${sy});`;
		}
	};
}