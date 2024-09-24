
import { FinchPay } from './finchpay';
import { SimpleSwap } from './simpleswap';
export * as payments from './request';

export default {
	simple_swap: new SimpleSwap(),
	finch_pay: new FinchPay(),
};