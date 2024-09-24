import { ChangeEvent, forwardRef, useMemo, useState, useEffect } from 'react';
import classNames from 'classnames';
import { debounce } from 'lodash';

import ExchangeIcon from '@/assets/icons/fields/exchange.svg?react';
import styles from './amount-currency-field.module.scss';
import { AmountFieldProps } from './types';
import { fiatToCrypto, cryptoToFiat, EstimateResponse } from '@/api/estimate';
import { symbols } from '@/helpers/fiatCurrencySymbols';
import { IMaskMixin } from 'react-imask';

export enum currencyTypes {
	fiat = 'fiat',
	spot = 'spot',
}

interface EstimateArgs {
	network: string;
	coin_name: string;
	amount: string;
}

const getEstimate = async (currency: string, query: EstimateArgs): Promise<EstimateResponse> => {
	if (currency === currencyTypes.spot) {
		return await cryptoToFiat({
			network: query.network,
			coin_name: query.coin_name,
			crypto_amount: query.amount,
		});
	}
	return await fiatToCrypto({
		network: query.network,
		coin_name: query.coin_name,
		fiat_amount: query.amount,
	});
};

const IMaskInput = IMaskMixin(({ inputRef, ...props }) => (
	//@ts-expect-error
	<input ref={inputRef} {...props} />
));

export const AmountCurrencyField = forwardRef<HTMLInputElement, AmountFieldProps>(({
	onChange,
	onBlur,
	onConvert,
	network,
	className,
	placeholder,
	max,
	min,
	t,
	name,
	fiatCurrency,
	...props
}: AmountFieldProps, ref) => {
	const [ fieldError, setError ] = useState();
	const [ currencyType, setCurrencyType ] = useState(props.currencyType);
	const [ amountInConvert, setAmount ] = useState(0);
	const [ value, setValue ] = useState(props.value || '');

	const debouncedEstimate = useMemo(() => debounce(async (currencyType: string, network: string, value: any) => {
		if (!network || network.includes('undefined')) {
			return;
		}

		try {
			const [chain, name] = network.split('_');
			const estimate = await getEstimate(currencyType, {
				network: chain,
				coin_name: name,
				amount: value?.toString() || '0',
			});
			const payable_amount = parseFloat(estimate.payable_amount.toFixed(3));
			setAmount(payable_amount);
			onConvert(payable_amount, currencyType);
		} catch (err) {
			setError((err as any)?.message);
		}
	}, 300), [onConvert]);

	useEffect(() => {
		debouncedEstimate(currencyType, network, props.value);
	}, [props.value, currencyType, network]);

	const handleAccept = (value: string): void => {
		setValue(value);
		onChange(value);
	};

	useEffect(() => {
		setValue(props.value || '');
	}, [props.value]);

	const handleExchange = async (type: any) => {
		const currencyType = type === currencyTypes.spot ? currencyTypes.fiat : currencyTypes.spot;
		setCurrencyType(currencyType);
		if (props.onExchange) {
			props.onExchange(currencyType);
		}
	};

	const handleMax = async (value: number) => {
		onChange(`${value}`);
	};

	const _renderAmountInConvert = (amountInConvert: any, currencyType: string) => {
		let currencyCode;
		if (currencyType === currencyTypes.fiat) {
			currencyCode = network.split('_')[1];
		} else {
			currencyCode = symbols['USD'];
		}
		if (!amountInConvert) {
			return `~ ${'0.00'} ${currencyCode}`;
		}
		return `~ ${amountInConvert} ${currencyCode}`;
	};

	const MASK = [
		{
			mask: Number,
			scale: 6, // digits after point, 0 for integers. Временно 6 так как при большем значении выводится 1-e7 нужно писать доп вывод в других местах
			thousandsSeparator: ' ', // any single char
			padFractionalZeros: false, // if true, then pads zeros at end to the length of scale
			normalizeZeros: true, // appends or removes zeros at ends
			radix: '.', // fractional delimiter
			mapToRadix: [','], // symbols to process as radix
			autofix: true,
		}
	];

	if (fieldError) {
		return <div>{fieldError}</div>;
	}

	return (
		<div className={`${styles['amount-field']} ${className}`}>
			<button type='button' className={styles['amount-field__button']} onClick={() => handleExchange(currencyType)}>
				<ExchangeIcon />
			</button>
			<div className={styles['amount-field__main']}>
				<IMaskInput
					className={styles['amount-field__input']}
					onAccept={handleAccept}
					onBlur={(e) => onBlur(e.target.value)}
					value={value}
					placeholder={placeholder}
					name={name}
					ref={ref}
					unmask
					mask={MASK}
				/>
				<span className={styles['amount-field__conversion']}>
					{_renderAmountInConvert(amountInConvert, currencyType)}
				</span>
			</div>

			{max ? (
				<button
					onClick={() => handleMax(parseFloat(max))}
					type='button'
					className={classNames(styles['amount-field__button'], { [styles['hidden']]: !!max })}
				>
					<span>{t('max')}</span>
				</button>
			) : (
				<div></div>
			)}
		</div>
	);
});
