import { Payment } from './request';

export class SimpleSwap extends Payment {
	constructor () {
		super('simple_swap');
	}
}