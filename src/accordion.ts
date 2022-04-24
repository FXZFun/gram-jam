export const accordion = (node: HTMLElement, {
	isOpen,
	axis = 'height',
	duration = 100,
}) => {
	let initial = axis === 'height' ? node.offsetHeight : node.offsetWidth;
	node.style[axis] = isOpen ? 'auto' : '0';
	node.style.overflow = "hidden";
	return {
		update(isOpen: boolean) {
			let animation = node.animate(
				[
					{
						[axis]: 0,
						overflow: 'hidden'
					},
					{
						[axis]: initial + 'px',
						overflow: 'hidden'
					},
				],
				{ duration, fill: 'both' }
			);
			animation.pause();
			if (!isOpen) {
				animation.play();
			} else {
				animation.reverse();
			}
		}
	};
}