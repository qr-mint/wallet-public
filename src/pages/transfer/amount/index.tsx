import { createRef, useState } from 'react';
import { BackButton } from '@vkruglikov/react-telegram-web-app';
import { useTranslation } from 'react-i18next';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg?react';
import styles from './styles.module.scss';
import { useTransfer } from '@/providers/transfer/hooks';

import { FooterButton } from '@/components/footer-button';
import { AmountCurrencyField, currencyTypes } from '@/components/amount-currency-field';
import { Loading } from '@/components/loading';
import { useSettingsStore } from '@/store/useSettingsStore';
import { notify } from '@/utils/notify.ts';
import { TokenInfo } from '@/store/token/types';

const allowMemo: string[] = ['ton'];

export function AmountPage () {
	const params = useParams();
	const transfer = useTransfer();
	const location = useLocation();
	const navigate = useNavigate();
	const settings = useSettingsStore();

	const { t } = useTranslation();
	const {
		handleSubmit,
		control,
		trigger,
		formState: { isValid, isSubmitting, errors },
	} = useForm<{ amount: string; memo: string; address: string }>({
		mode: 'all',
	});

	const formRef = createRef<HTMLFormElement>();

	const [ amountInConvert, setConvert ] = useState<number | undefined>();
	const [ currencyType, setCurrencyType ] = useState(currencyTypes.spot);


	// Сумма трансфера не должна превышать сумму на кошельке
	const validateAmountWithBalance = (amount: number, walletAmount: number): boolean => {
		return walletAmount >= amount;
	};

	if (!transfer.wallet) {
		return (
			<div className="container-loading">
				<Loading />
			</div>
		);
	}

	const handleExchange = (currencyType: string) => {
		setCurrencyType(currencyType as currencyTypes);
		return null;
	};

	const next = ({ memo, amount }: any) => {
		const payableAmount = currencyType === currencyTypes.spot ? amount : amountInConvert;
		let url = `/transfer/confirm/${params.network}${location.search}&amount=${payableAmount}`;
		if (memo) {
			url += `&memo=${memo}`;
		}
		navigate(url);
	};

	const _renderMemo = (network: string) => {
		const chain = network?.split('_')[0];
		if (allowMemo.includes(chain)) {
			return (
				<Controller
					render={({ field }) => (
						<input {...field} type='text' className={styles['input']} placeholder={t('transfer.amount.memo')} />
					)}
					control={control}
					name={'memo'}
					defaultValue={transfer.memo }
				/>
			);
		}
	};

	const _renderCoinButton = (name: string) => {
		return (
			<button onClick={() => navigate('/transfer/select-coin')} type='button' className={styles['button']}>
				<span>{name}</span>
				<ChevronRightIcon />
			</button>
		);
	};

	const _renderBalance = (wallet: TokenInfo) => {

		return (
			<div className={styles['wallet']}>
				<div className={styles['wallet__image']}>
					<img src={transfer.coinLogo} alt='' />
				</div>

				<div className={styles['wallet__info']}>
					<p className={styles['wallet__name']}>{wallet.name}</p>
					<p className={styles['wallet__balance']}>{wallet.amount} {wallet.symbol}</p>
				</div>
			</div>
		);
	};

	return (
		<div className={styles['wrapper']}>
			<BackButton onClick={() => navigate(-1)} />

			{_renderBalance(transfer.wallet)}

			<form ref={formRef} onSubmit={handleSubmit(next)}>
				<Controller
					render={({ field }) => (
						<AmountCurrencyField
							t={t}
							placeholder='0.00'
							fiatCurrency={settings.currency}
							max={transfer.wallet?.amount || '0'}
							network={transfer.network}
							currencyType={currencyType}
							onExchange={handleExchange}
							onConvert={(value: number) => {
								setConvert(value);
							}}
							{...field}
						/>
					)}
					control={control}
					name='amount'
					defaultValue={transfer.amount?.toString() || '0'}
					rules={{
						validate: {
							require: (val: string) => {
								const checkedVal = parseFloat(val ?? '0');

								if (!checkedVal) {
									return t('transfer.amount.required');
								}

								if (!validateAmountWithBalance(checkedVal, parseFloat(transfer.wallet.amount))) {
									return t('transfer.amount.balanceNotEnough');
								}
							},
						},
					}}
				/>

				<div className={styles['buttons']}>
					{_renderCoinButton(transfer.wallet.name)}
					{_renderMemo(transfer.wallet.network)}
					<button onClick={() => navigate(-1)} type='button' className={styles['button']}>
						<span>
							{t('transfer.amount.sendTo')} <span className={styles['blue']}>{transfer.getShortAddress()}</span>
						</span>
						<ChevronRightIcon />
					</button>
				</div>
			</form>
			{errors.amount && <p className={styles['message']}>{errors.amount.message}</p>}

			<div className={styles['actions']}>
				<FooterButton
					onClick={() => {
						if (!isValid) {
							trigger().then(() => {
								notify({
									type: 'error',
									message: errors?.amount?.message ?? 'Required',
								});
							});
							return;
						}

						formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }));
					}}
					disabled={isSubmitting}
					text={t('transfer.send')}
				/>
			</div>
		</div>
	);
}
