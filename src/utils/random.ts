export function getRandomInt (max: number): number {
	return Math.floor(Math.random() * max) + 1;
}

export function shuffle (array: string[]) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1));
		[ array[i], array[j] ] = [ array[j], array[i] ];
	}
	return array;
}