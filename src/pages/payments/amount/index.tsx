import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { useErrorBoundary } from 'react-error-boundary';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState, createRef } from 'react';

import { Controller } from 'react-hook-form';
import { BackButton } from '@vkruglikov/react-telegram-web-app';

import paymentApi, { payments } from '@/api/payments/index';
import { methods } from '../const';
import { isObjectEmpty } from '@/utils/isObjectEmpty';
import { useTokenInfo } from '@/store/token/useTokenInfo';

import { Loading } from '@/components/loading';
import { colors } from '@/components/loading';
import { AmountCurrencyField, currencyTypes } from '@/components/amount-currency-field';
import styles from './page.module.scss';
import BankIcon from '@/assets/icons/action-button/bank.svg?react';
import { FooterButton } from '@/components/footer-button';
import { useNotifyError } from '@/hooks/useNotifyError.ts';
import { notify } from '@/utils/notify.ts';

export function Amount () {
	const [ amountInConvert, setConvert ] = useState<number | undefined>();
	const [ currencyType, setCurrencyType ] = useState(currencyTypes.fiat);
	const [ redirectUrl, setRedirectUrl ] = useState<string>('');

	const params = useParams<{ network: string; methodName: string }>();
	const navigate = useNavigate();
	const { t } = useTranslation();
	const { showBoundary } = useErrorBoundary();
	const { parse: parseError } = useNotifyError();
	const { loadTokenInfo, tokenInfo } = useTokenInfo();
	const {
		handleSubmit,
		control,
		setValue,
		trigger,
		formState: { isSubmitting, isValid, errors },
	} = useForm<{ amount: string }>({
		mode: 'all',
	});

	const formRef = createRef<HTMLFormElement>();
	const [ limit, setLimit ] = useState<any>();

	const method = methods.find((method) => method.key === params.methodName);

	const loadLimit = async (name: string) => {
		const api = paymentApi[name as 'simple_swap' | 'finch_pay'] as payments.Payment;
		try {
			const res = await api.limit({ address_coin_id: tokenInfo.id });

			if (res.data) {
				return setLimit(res.data);
			}
		} catch (error) {
			parseError(error);
		}
	};

	useEffect(() => {
		if (!isObjectEmpty(tokenInfo) && params.methodName && !limit) {
			loadLimit(params.methodName);
		}
	}, [tokenInfo]);

	useEffect(() => {
		try {
			if (params.network) loadTokenInfo(params.network);
		} catch (error) {
			showBoundary(error);
		}
	}, []);

	useEffect(() => {
		if (!method) {
			showBoundary({ message: 'Method not found!' });
		}
	}, [ params, navigate, method, showBoundary ]);

	// Тригерим проверку форму сразу
	useEffect(() => {
		trigger();
	}, []);

	const send = async ({ amount }: any) => {
		if (!params.methodName) return;

		try {
			const methodName = params.methodName as 'simple_swap' | 'finch_pay';
			const api = paymentApi[methodName] as payments.Payment;
			const res = await api.request({
				amount: currencyType === currencyTypes.fiat ? amount : amountInConvert,
				address_coin_id: tokenInfo.id,
			});

			if (methodName != 'simple_swap') {
				return navigate(
					`/payments/${params.methodName}/${tokenInfo.id}?source=${encodeURIComponent(res.data.redirect_url)}`,
				);
			}

			setRedirectUrl(res.data.redirect_url);
		} catch (error) {
			showBoundary(error);
		}
	};

	const handleExchange = (currencyType: string) => {
		setCurrencyType(currencyType as currencyTypes);
		return null;
	};

	const handleSetValue = (value: number) => {
		setValue('amount', value.toString(), {
			shouldValidate: true,
		});
	};

	const currency = currencyTypes.fiat === currencyType ? 'USD' : tokenInfo?.name.toLocaleUpperCase();

	if (!limit) {
		return (
			<div className='container-loading'>
				<Loading color={colors.blue} />
			</div>
		);
	}
	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(`/payments/select/${params.methodName}/network`)} />

			<div className={styles['wallet']}>
				<div className={styles['wallet__image']}>
					<BankIcon />
				</div>

				<div className={styles['wallet__info']}>
					<p className={styles['wallet__name']}>{method?.name}</p>
					<p className={styles['wallet__balance']}>{method?.name}</p>
				</div>
			</div>

			<form ref={formRef} onSubmit={handleSubmit(send)}>
				<Controller
					render={({ field }) => {
						return (
							<AmountCurrencyField
								t={t}
								fiatCurrency='USD'
								placeholder='0.00'
								network={`${tokenInfo?.network}_${tokenInfo?.name}`}
								max={limit.max}
								min={limit.min}
								onExchange={handleExchange}
								currencyType={currencyType}
								onConvert={(value: number) => {
									setConvert(value);
								}}
								{...field}
							/>
						);
					}}
					control={control}
					name='amount'
					rules={{
						validate: {
							require: (value: string) => {
								if (!value) {
									return t('payments.amount.required');
								}

								const numberValue = parseFloat(value);
								const min = parseFloat(limit.min);

								if (numberValue <= min) {
									return t('payments.amount.limit.min', { min: limit.min });
								}

								const max = parseFloat(limit.max);
								if (numberValue > max) {
									return t('payments.amount.limit.max', { max: limit.max });
								}
							},
						},
					}}
				/>
				<div className={styles['tabs']}>
					<button onClick={() => handleSetValue(100)} type='button' className={styles['tabs__item']}>
						100 {currency}
					</button>
					<button onClick={() => handleSetValue(200)} type='button' className={styles['tabs__item']}>
						200 {currency}
					</button>
					<button onClick={() => handleSetValue(500)} type='button' className={styles['tabs__item']}>
						500 {currency}
					</button>
					<button onClick={() => handleSetValue(1000)} type='button' className={styles['tabs__item']}>
						1000 {currency}
					</button>
				</div>
				{!isValid && (
					<div className={styles.default_feedback}>
						{t('payments.amount.limit', { min: limit.min, max: limit.max })}
					</div>
				)}
			</form>

			<div className={styles['actions']}>
				<FooterButton
					text={redirectUrl ? t('payments.deposit') : t('payments.create.deposit')}
					loading={isSubmitting}
					onClick={() => {
						if (redirectUrl) {
							window.open(redirectUrl, '_blank');
						}

						if (!isValid) {
							notify({
								type: 'error',
								message: errors.amount?.message ?? 'Required',
								position: 'top-center',
							});

							return;
						}

						formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
					}}
				/>
			</div>
		</div>
	);
}
