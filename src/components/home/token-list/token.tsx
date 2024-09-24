import cn from 'classnames';
import styles from './token.module.scss';
import type { TokenProps } from './types';
import type { FunctionComponent } from 'react';
import { symbols } from '@/helpers/fiatCurrencySymbols';

export const Token: FunctionComponent<TokenProps> = ({ token, className, ...props }) => {
	return (
		<div className={cn(styles['token'], className)} {...props}>
			<div className={styles['token__image']}>
				<img src={`${process.env.API_URL}/${token.imageSource}`} alt='toncoin' />
			</div>

			<p className={styles['token__name']}>{token.name}</p>
			<p
				className={cn(styles['token__stock'], {
					[styles['zero']]: parseFloat(token.dailyPriceDeltaPercent) === 0,
					[styles['up']]: parseFloat(token.dailyPriceDeltaPercent) > 0,
					[styles['down']]: parseFloat(token.dailyPriceDeltaPercent) < 0,
				})}
			>
				{token.dailyPriceDeltaPercent}%
			</p>
			<p className={styles['token__fiat']}>
				{symbols[token.fiatCurrency.toUpperCase()]}
				{token.fiatAmount}
			</p>
			<p className={styles['token__crypto']}>
				{token.amount}
			</p>
		</div>
	);
};
