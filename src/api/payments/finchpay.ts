import { Payment } from './request';

export class FinchPay extends Payment {
	constructor () {
		super('finch_pay');
	}
}